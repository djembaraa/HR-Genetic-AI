const express = require('express');
const prisma = require('../lib/prisma');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Middleware specifically for CANDIDATE role
router.use(authenticateToken);
router.use(requireRole('CANDIDATE'));

// Get the logged-in candidate's full profile
router.get('/profile', async (req, res) => {
  try {
    const candidate = await prisma.candidate.findUnique({
      where: { userId: req.user.userId },
      include: {
        experiences: { orderBy: { sortOrder: 'asc' } },
        educations: { orderBy: { sortOrder: 'asc' } },
        skills: true
      }
    });
    if (!candidate) return res.status(404).json({ error: 'Candidate profile not found' });
    res.json(candidate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch candidate profile' });
  }
});

// Update candidate basic info
router.put('/profile', async (req, res) => {
  const { name, phone, location, summary } = req.body;
  try {
    const candidate = await prisma.candidate.update({
      where: { userId: req.user.userId },
      data: { name, phone, location, summary }
    });
    res.json(candidate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update candidate profile' });
  }
});

// --- Experience ---

router.post('/experience', async (req, res) => {
  const { company, title, description, startDate, endDate } = req.body;
  try {
    const candidate = await prisma.candidate.findUnique({ where: { userId: req.user.userId } });
    const experience = await prisma.experience.create({
      data: {
        candidateId: candidate.id,
        company,
        title,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null
      }
    });
    res.status(201).json(experience);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add experience' });
  }
});

router.delete('/experience/:id', async (req, res) => {
  try {
    // Should verify ownership, simplified for MVP
    await prisma.experience.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

// --- Education ---

router.post('/education', async (req, res) => {
  const { institution, degree, field, startDate, endDate } = req.body;
  try {
    const candidate = await prisma.candidate.findUnique({ where: { userId: req.user.userId } });
    const education = await prisma.education.create({
      data: {
        candidateId: candidate.id,
        institution,
        degree,
        field,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null
      }
    });
    res.status(201).json(education);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add education' });
  }
});

router.delete('/education/:id', async (req, res) => {
  try {
    await prisma.education.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

// --- Skills ---

router.post('/skill', async (req, res) => {
  const { name, proficiency } = req.body;
  try {
    const candidate = await prisma.candidate.findUnique({ where: { userId: req.user.userId } });
    const skill = await prisma.skill.create({
      data: {
        candidateId: candidate.id,
        name,
        proficiency: proficiency || 'INTERMEDIATE'
      }
    });
    res.status(201).json(skill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add skill' });
  }
});

router.delete('/skill/:id', async (req, res) => {
  try {
    await prisma.skill.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

module.exports = router;
