const express = require('express');
const prisma = require('../lib/prisma');
const { authenticateToken, requireRole } = require('../middleware/auth');
const Redis = require('ioredis');

const router = express.Router();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

router.get('/', async (req, res) => {
  try {
    try {
      const cachedJobs = await redis.get('jobs:all:open');
      if (cachedJobs) {
        return res.json(JSON.parse(cachedJobs));
      }
    } catch (redisError) {
      console.warn('Redis Get Error (Fallback to DB):', redisError.message);
    }

    // If not authenticated or candidate, only show open jobs across companies
    const jobs = await prisma.job.findMany({
      where: { status: 'OPEN' },
      include: { company: true }
    });

    try {
      await redis.set('jobs:all:open', JSON.stringify(jobs), 'EX', 300); // 5 min TTL
    } catch (redisError) {
      console.warn('Redis Set Error:', redisError.message);
    }
    
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
    
    // Invalidate public job cache safely
    try {
      await redis.del('jobs:all:open');
    } catch (redisError) {
      console.warn('Redis Del Error:', redisError.message);
    }
    
    // --- MATCHMAKING ENGINE ---
    if (location && status === 'OPEN') {
      try {
        const matchingCandidates = await prisma.candidate.findMany({
          where: { location: location },
          select: { userId: true, name: true }
        });

        if (matchingCandidates.length > 0) {
          const company = await prisma.company.findUnique({ where: { id: req.user.companyId } });
          const notificationsData = matchingCandidates.map(c => ({
            userId: c.userId,
            title: '🔥 Lowongan Baru di Kotamu!',
            message: `${company?.name || 'Sebuah Perusahaan'} baru saja membuka lowongan ${title} di ${location}.`,
            link: '/candidate'
          }));
          
          await prisma.notification.createMany({ data: notificationsData });
          console.log(`Sent match notifications to ${matchingCandidates.length} candidates.`);
        }
      } catch (matchError) {
        console.error('Matchmaking error:', matchError);
      }
    }

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
    
    // Invalidate public job cache safely
    try {
      await redis.del('jobs:all:open');
    } catch (redisError) {
      console.warn('Redis Del Error:', redisError.message);
    }
    
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update job' });
  }
});

// Admin/HR: Delete a job
router.delete('/:id', authenticateToken, requireRole('ADMIN', 'HR_MANAGER', 'RECRUITER'), async (req, res) => {
  const { id } = req.params;
  try {
    const existingJob = await prisma.job.findUnique({ where: { id: parseInt(id) } });
    if (!existingJob || existingJob.companyId !== req.user.companyId) {
      return res.status(404).json({ error: 'Job not found' });
    }

    await prisma.job.delete({ where: { id: parseInt(id) } });
    
    // Invalidate public job cache safely
    try {
      await redis.del('jobs:all:open');
    } catch (redisError) {
      console.warn('Redis Del Error:', redisError.message);
    }
    
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

module.exports = router;
