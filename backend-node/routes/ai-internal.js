const express = require('express');
const prisma = require('../lib/prisma');
const router = express.Router();

// Middleware to protect internal routes
const requireInternalApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const expectedKey = process.env.AI_SERVICE_API_KEY || 'default-ai-secret-key';
  
  if (!apiKey || apiKey !== expectedKey) {
    return res.status(401).json({ error: 'Unauthorized. Invalid API Key.' });
  }
  next();
};

// GET /api/internal/candidates/:companyId
// Used by Python AI Agent to get the list of candidates for a company
router.get('/candidates/:companyId', requireInternalApiKey, async (req, res) => {
  try {
    const companyId = parseInt(req.params.companyId);
    
    // Fetch jobs for this company
    const jobs = await prisma.job.findMany({
      where: { companyId },
      select: { id: true }
    });
    
    const jobIds = jobs.map(j => j.id);

    // Fetch candidates
    const candidates = await prisma.candidate.findMany({
      where: {
        applications: {
          some: { jobId: { in: jobIds } }
        }
      },
      include: {
        applications: {
          where: { jobId: { in: jobIds } },
          include: { job: true }
        }
      }
    });

    // Map to a simplified JSON for the AI
    const simplified = candidates.map(c => ({
      id: c.id,
      name: c.name,
      location: c.location,
      status: c.applications[0]?.status || 'UNKNOWN',
      applied_job: c.applications[0]?.job?.title || 'UNKNOWN'
    }));

    res.json(simplified);
  } catch (err) {
    console.error('Internal API Error:', err);
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
});

// PUT /api/internal/candidates/:candidateId/status
// Used by Python AI Agent to update a candidate's status
router.put('/candidates/:candidateId/status', requireInternalApiKey, async (req, res) => {
  try {
    const candidateId = parseInt(req.params.candidateId);
    const { status, companyId } = req.body; // Needs companyId to ensure the agent is updating the right application

    if (!status || !companyId) {
        return res.status(400).json({ error: 'status and companyId are required' });
    }

    // Find the application
    const application = await prisma.jobApplication.findFirst({
        where: {
            candidateId: candidateId,
            job: { companyId: parseInt(companyId) }
        }
    });

    if (!application) {
        return res.status(404).json({ error: 'Application not found for this candidate and company' });
    }

    const updated = await prisma.jobApplication.update({
        where: { id: application.id },
        data: { status: status }
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        userId: 0, // 0 for AI System
        action: 'AI_UPDATE_APPLICATION_STATUS',
        entity: 'JobApplication',
        entityId: application.id,
        details: `AI Agent updated status to ${status} for candidate ID ${candidateId}`
      }
    });

    res.json({ success: true, message: `Candidate ${candidateId} status updated to ${status}` });
  } catch (err) {
    console.error('Internal API Error:', err);
    res.status(500).json({ error: 'Failed to update candidate status' });
  }
});

module.exports = router;
