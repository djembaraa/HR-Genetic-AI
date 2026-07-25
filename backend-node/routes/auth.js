const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = require('../lib/prisma');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key';

// SIGN UP ROUTE (For Candidates only)
router.post('/signup', async (req, res) => {
  const { email, password, name, phone } = req.body;
  try {
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
    res.status(500).json({ error: 'Server error during signup' });
  }
});

// LOGIN ROUTE
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email, companyId: user.companyId },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.json({ token, user: { id: user.id, email: user.email, role: user.role, companyId: user.companyId } });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Server error during login' });
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

module.exports = router;
