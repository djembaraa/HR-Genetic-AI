require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@libsql/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const app = express();
const connection = createClient({ url: process.env.DATABASE_URL });
const adapter = new PrismaLibSql(connection);
const prisma = new PrismaClient({ adapter });

app.use(cors());
app.use(express.json()); // Essential for receiving JSON in req.body

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// JWT Middleware for Protected Routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  const jwt = require('jsonwebtoken');
  const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key';
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Setup Multer for handling file uploads (PDF)
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF is allowed.'), false);
        }
    }
});

app.use(cors());
app.use(express.json());

// FASTAPI SERVICE URL
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

app.get('/', (req, res) => {
    res.send({ message: 'NextGen ATS Express Gateway is running!' });
});

// Example of a Protected Route (Admin Only)
app.get('/api/admin/dashboard', authenticateToken, async (req, res) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Admin access required' });
  
  // Dashboard mock stats
  res.json({
    message: `Welcome Admin ${req.user.email}`,
    stats: {
      candidates: await prisma.candidate.count(),
      jobs: await prisma.job.count()
    }
  });
});

// Endpoint to handle Candidate CV Upload
app.post('/api/candidates/upload', upload.single('cv'), async (req, res) => {
    try {
        const { name, email, applied_job_id } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ error: 'CV file is required' });
        }

        // 1. Save candidate to Database (SQLite via Prisma)
        const candidate = await prisma.candidate.create({
            data: {
                name,
                email,
                appliedJobId: applied_job_id ? parseInt(applied_job_id) : null,
                cvUrl: req.file.path
            }
        });

        // 2. Forward the PDF to the AI Microservice (FastAPI) for processing
        const formData = new FormData();
        formData.append('candidate_id', candidate.id.toString());
        formData.append('file', fs.createReadStream(req.file.path));

        const aiResponse = await fetch(`${AI_SERVICE_URL}/api/process-cv`, {
            method: 'POST',
            body: formData,
        });

        const aiResult = await aiResponse.json();

        res.json({
            message: 'Candidate application submitted and CV is being processed by AI.',
            candidate,
            ai_status: aiResult
        });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to chat with HR Agent
app.post('/api/hr/chat', async (req, res) => {
    try {
        const { query } = req.body;

        const formData = new FormData();
        formData.append('query', query);

        const aiResponse = await fetch(`${AI_SERVICE_URL}/api/chat`, {
            method: 'POST',
            body: formData
        });

        const aiResult = await aiResponse.json();
        res.json(aiResult);
    } catch (error) {
        console.error('Chat Error:', error);
        res.status(500).json({ error: 'Internal Server Error connecting to AI Agent' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Express Gateway running on http://localhost:${PORT}`);
});
