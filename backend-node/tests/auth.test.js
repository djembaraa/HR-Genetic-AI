const express = require('express');
const request = require('supertest');
const authRoutes = require('../routes/auth');
const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');

// Mock prisma and bullmq
jest.mock('../lib/prisma', () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  candidate: {
    create: jest.fn(),
  },
  refreshToken: {
    create: jest.fn(),
  },
  $transaction: jest.fn(async (cb) => {
    // A simple mock for transaction that just runs the callback with the mock prisma instance
    const txPrisma = {
      user: { create: jest.fn().mockResolvedValue({ id: 1, email: 'test@test.com', role: 'CANDIDATE' }) },
      candidate: { create: jest.fn().mockResolvedValue({ id: 1, userId: 1, name: 'Test User' }) }
    };
    return cb(txPrisma);
  })
}));

jest.mock('bullmq', () => ({
  Queue: jest.fn().mockImplementation(() => ({
    add: jest.fn(),
  }))
}));

jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
  }));
});

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth API Endpoints', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/signup', () => {
    it('should create a new candidate user', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({ id: 1, email: 'test@test.com', role: 'CANDIDATE' });
      prisma.candidate.create.mockResolvedValue({ id: 1, userId: 1, name: 'Test User' });

      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'test@test.com',
          password: 'Password123!' // Valid password
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('message', 'User created successfully');
    });

    it('should return 400 if email already exists', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 2, email: 'exist@test.com' });

      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'exist@test.com',
          password: 'Password123!'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', 'Email already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return token on valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('Password123!', 10);
      
      prisma.user.findUnique.mockResolvedValue({ 
        id: 1, 
        email: 'test@test.com', 
        password: hashedPassword,
        role: 'CANDIDATE'
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@test.com',
          password: 'Password123!'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
    });

    it('should return 401 on invalid password', async () => {
      const hashedPassword = await bcrypt.hash('Password123!', 10);
      
      prisma.user.findUnique.mockResolvedValue({ 
        id: 1, 
        email: 'test@test.com', 
        password: hashedPassword,
        role: 'CANDIDATE'
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@test.com',
          password: 'WrongPassword'
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error', 'Invalid credentials');
    });
  });
});
