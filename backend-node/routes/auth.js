const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per `window` (here, per 15 minutes)
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().optional(),
  phone: z.string().optional()
});

const employerSignupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(1, 'Name is required'),
  phone: z.string().optional(),
  companyName: z.string().min(2, 'Company name must be at least 2 characters')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

const prisma = require('../lib/prisma');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// SIGN UP ROUTE (For Candidates only)
router.post('/signup', authLimiter, async (req, res) => {
  try {
    const { email, password, name, phone } = signupSchema.parse(req.body);
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create User and Candidate Profile in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'CANDIDATE' // Hardcoded to prevent privilege escalation
        }
      });

      await tx.candidate.create({
        data: {
          userId: newUser.id,
          email,
          name: name || email.split('@')[0],
          phone: phone || null
        }
      });

      return newUser;
    });

    res.status(201).json({ message: 'User created successfully', userId: user.id });
  } catch (error) {
    console.error('Signup Error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Server error during signup' });
  }
});

// SIGN UP ROUTE (For Employers/HR only)
router.post('/signup/employer', authLimiter, async (req, res) => {
  try {
    const { email, password, name, phone, companyName } = employerSignupSchema.parse(req.body);
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });

    // Slugify company name
    const baseSlug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let slug = baseSlug;
    let counter = 1;
    
    while (await prisma.company.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create Company and Admin User in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newCompany = await tx.company.create({
        data: {
          name: companyName,
          slug
        }
      });

      const newUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'ADMIN', // The first person to create a company is the ADMIN
          companyId: newCompany.id
        }
      });

      return newUser;
    });

    res.status(201).json({ message: 'Employer created successfully', userId: user.id });
  } catch (error) {
    console.error('Employer Signup Error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Server error during employer signup' });
  }
});

// LOGIN ROUTE
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email, companyId: user.companyId },
      JWT_SECRET,
      { expiresIn: '15m' } // Short-lived access token
    );
    
    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' } // Long-lived refresh token
    );
    
    // Store refresh token in DB
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
    
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: expiresAt
      }
    });
    // Store refresh token in HTTP-only Cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.json({ token, user: { id: user.id, email: user.email, role: user.role, companyId: user.companyId } });
  } catch (error) {
    console.error('Login Error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Server error during login' });
  }
});

// REFRESH TOKEN ROUTE
router.post('/refresh', authLimiter, async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: 'No refresh token provided' });

  jwt.verify(refreshToken, JWT_REFRESH_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired refresh token' });
    
    try {
      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
      if (!user) return res.status(403).json({ error: 'User not found' });

      // Check DB for refresh token validity
      const storedToken = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
      if (!storedToken) return res.status(403).json({ error: 'Token not found in database' });
      if (storedToken.revoked) return res.status(403).json({ error: 'Token has been revoked' });
      if (new Date() > storedToken.expiresAt) return res.status(403).json({ error: 'Token has expired in database' });

      const newAccessToken = jwt.sign(
        { userId: user.id, role: user.role, email: user.email, companyId: user.companyId },
        JWT_SECRET,
        { expiresIn: '15m' }
      );
      res.json({ token: newAccessToken });
    } catch (error) {
      res.status(500).json({ error: 'Failed to refresh token' });
    }
  });
});

// LOGOUT ROUTE
router.post('/logout', authLimiter, authenticateToken, async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) return res.status(400).json({ error: 'No refresh token provided' });

  try {
    // Revoke the token (or you could just delete it)
    await prisma.refreshToken.update({
      where: { token: refreshToken },
      data: { revoked: true }
    });
    res.clearCookie('refreshToken', { sameSite: 'strict' });
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout Error:', error);
    res.status(500).json({ error: 'Failed to logout' });
  }
});

// ADMIN ONLY: Assign Role to a user (e.g. promote to HR_MANAGER)
router.post('/admin/assign-role', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  const { targetEmail, newRole, companyId } = req.body;
  
  const validRoles = ['ADMIN', 'HR_MANAGER', 'RECRUITER', 'CANDIDATE'];
  if (!validRoles.includes(newRole)) {
    return res.status(400).json({ error: 'Invalid role specified' });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { email: targetEmail },
      data: {
        role: newRole,
        companyId: companyId ? parseInt(companyId) : null
      }
    });

    res.json({ message: 'Role updated successfully', user: { email: updatedUser.email, role: updatedUser.role, companyId: updatedUser.companyId } });
  } catch (error) {
    console.error('Role Assignment Error:', error);
    res.status(500).json({ error: 'Failed to assign role' });
  }
});

// GET CURRENT USER PROFILE
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, email: true, role: true, companyId: true, candidate: true }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Fetch Profile Error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// UPDATE CURRENT USER PROFILE (Password & Details)
router.put('/me', authenticateToken, async (req, res) => {
  const { password, name, phone } = req.body;
  try {
    let updateData = {};
    if (password) {
      if (password.length < 8) return res.status(400).json({ error: 'Password too short' });
      updateData.password = await bcrypt.hash(password, 10);
    }
    
    await prisma.$transaction(async (tx) => {
      if (Object.keys(updateData).length > 0) {
        await tx.user.update({
          where: { id: req.user.userId },
          data: updateData
        });
      }
      
      if (name !== undefined || phone !== undefined) {
        // Update candidate profile if they are a candidate
        if (req.user.role === 'CANDIDATE') {
          await tx.candidate.upsert({
            where: { userId: req.user.userId },
            update: { 
              ...(name && { name }), 
              ...(phone !== undefined && { phone }) 
            },
            create: { userId: req.user.userId, email: req.user.email, name: name || 'User', phone }
          });
        }
      }
    });

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
