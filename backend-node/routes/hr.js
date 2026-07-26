const express = require('express');
const prisma = require('../lib/prisma');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/hr/candidates
// Fetch candidates applied to jobs in the HR's company
router.get('/candidates', authenticateToken, requireRole('ADMIN', 'HR_MANAGER', 'RECRUITER'), async (req, res) => {
  try {
    const companyId = req.user.companyId;
    if (!companyId) return res.status(403).json({ error: 'HR user has no associated company.' });

    // Fetch jobs for this company
    const jobs = await prisma.job.findMany({
      where: { companyId },
      select: { id: true }
    });
    
    const jobIds = jobs.map(j => j.id);

    // Fetch candidates who applied to these jobs
    // In our simplified MVP, we assume a candidate applies to a job by setting `appliedJobId`.
    const candidates = await prisma.candidate.findMany({
      where: {
        appliedJobId: { in: jobIds }
      },
      include: {
        appliedJob: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(candidates);
  } catch (error) {
    console.error('Fetch Candidates Error:', error);
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
});

// POST /api/hr/chat
// Endpoint to chat with HR Agent
router.post('/chat', authenticateToken, requireRole('ADMIN', 'HR_MANAGER', 'RECRUITER'), async (req, res) => {
    try {
        const { query } = req.body;
        const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
        
        const formData = new FormData();
        formData.append('query', query);
        formData.append('company_id', req.user.companyId || 'default');
        formData.append('thread_id', `hr_${req.user.userId}`); // Use HR user ID as thread_id

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

module.exports = router;
