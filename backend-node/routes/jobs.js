const express = require('express');
const prisma = require('../lib/prisma');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all jobs (Candidates can see OPEN jobs, HR sees all jobs for their company)
router.get('/', async (req, res) => {
  try {
    // If not authenticated or candidate, only show open jobs across companies
    // For a real SaaS, a candidate might filter by company.
    // We'll just return all OPEN jobs for now.
    const jobs = await prisma.job.findMany({
      where: { status: 'OPEN' },
      include: { company: true }
    });
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Admin/HR: Get jobs for their specific company
router.get('/company', authenticateToken, requireRole('ADMIN', 'HR_MANAGER', 'RECRUITER'), async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { companyId: req.user.companyId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch company jobs' });
  }
});

// Admin/HR: Create a new job
router.post('/', authenticateToken, requireRole('ADMIN', 'HR_MANAGER', 'RECRUITER'), async (req, res) => {
  const { title, department, description, location, type, status } = req.body;
  try {
    if (!req.user.companyId) {
      return res.status(403).json({ error: 'User is not associated with a company' });
    }

    const job = await prisma.job.create({
      data: {
        companyId: req.user.companyId,
        title,
        department,
        description,
        location,
        type: type || 'FULL_TIME',
        status: status || 'OPEN'
      }
    });
    res.status(201).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// Admin/HR: Update a job
router.put('/:id', authenticateToken, requireRole('ADMIN', 'HR_MANAGER', 'RECRUITER'), async (req, res) => {
  const { id } = req.params;
  const { title, department, description, location, type, status } = req.body;
  try {
    // Verify job belongs to their company
    const existingJob = await prisma.job.findUnique({ where: { id: parseInt(id) } });
    if (!existingJob || existingJob.companyId !== req.user.companyId) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const job = await prisma.job.update({
      where: { id: parseInt(id) },
      data: { title, department, description, location, type, status }
    });
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update job' });
  }
});

module.exports = router;
