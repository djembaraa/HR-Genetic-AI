const express = require('express');
const prisma = require('../lib/prisma');
const { authenticateToken, requireRole } = require('../middleware/auth');
const Redis = require('ioredis');

const router = express.Router();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// GET /api/company/:slug - Public endpoint to view company details + open jobs
router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const cachedCompany = await redis.get(`company:${slug}`);
    if (cachedCompany) {
      return res.json(JSON.parse(cachedCompany));
    }

    const company = await prisma.company.findUnique({
      where: { slug },
      include: {
        jobs: {
          where: { status: 'OPEN' },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Cache the result (5 min TTL)
    await redis.set(`company:${slug}`, JSON.stringify(company), 'EX', 300);

    res.json(company);
  } catch (error) {
    console.error('Fetch company error:', error);
    res.status(500).json({ error: 'Failed to fetch company details' });
  }
});

// PUT /api/company/profile - Protected endpoint for HR to update their company profile
router.put('/profile', authenticateToken, requireRole('ADMIN', 'HR_MANAGER', 'RECRUITER'), async (req, res) => {
  try {
    const companyId = req.user.companyId;
    if (!companyId) {
      return res.status(403).json({ error: 'User is not associated with a company' });
    }

    const { description, industry, website, logoUrl } = req.body;

    const company = await prisma.company.update({
      where: { id: companyId },
      data: {
        description,
        industry,
        website,
        logoUrl
      }
    });

    // Invalidate caches
    try {
      await redis.del(`company:${company.slug}`);
      await redis.del('jobs:all:open');
    } catch (e) {
      console.warn('Redis del error:', e.message);
    }

    res.json({ message: 'Company profile updated successfully', company });
  } catch (error) {
    console.error('Update company profile error:', error);
    res.status(500).json({ error: 'Failed to update company profile' });
  }
});

module.exports = router;
