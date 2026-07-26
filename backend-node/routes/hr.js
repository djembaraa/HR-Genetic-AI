const express = require('express');
const PDFDocument = require('pdfkit');
const prisma = require('../lib/prisma');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { z } = require('zod');

const router = express.Router();

const chatSchema = z.object({
  query: z.string().min(1, 'Query is required').max(1000, 'Query is too long')
});

const statusSchema = z.object({
  status: z.enum(['APPLIED', 'REVIEWING', 'INTERVIEW', 'REJECTED', 'HIRED'])
});

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

    // Fetch candidates who applied to these jobs via JobApplication
    const candidates = await prisma.candidate.findMany({
      where: {
        applications: {
          some: {
            jobId: { in: jobIds }
          }
        }
      },
      include: {
        applications: {
          where: { jobId: { in: jobIds } },
          include: { job: true }
        }
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
        const validated = chatSchema.safeParse(req.body);
        if (!validated.success) {
            return res.status(400).json({ error: validated.error.errors[0].message });
        }
        const { query } = validated.data;
        
        const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
        const AI_API_KEY = process.env.AI_SERVICE_API_KEY || 'default-ai-secret-key';
        
        const formData = new FormData();
        formData.append('query', query);
        formData.append('company_id', req.user.companyId || 'default');
        formData.append('thread_id', `hr_${req.user.userId}`); // Use HR user ID as thread_id

        const aiResponse = await fetch(`${AI_SERVICE_URL}/api/chat`, {
            method: 'POST',
            headers: { 'x-api-key': AI_API_KEY },
            body: formData
        });

        const aiResult = await aiResponse.json();
        res.json(aiResult);
    } catch (error) {
        console.error('Chat Error:', error);
        res.status(500).json({ error: 'Internal Server Error connecting to AI Agent' });
    }
});

// GET /api/hr/resume/pdf/:candidateId
router.get('/resume/pdf/:candidateId', authenticateToken, requireRole('ADMIN', 'HR_MANAGER', 'RECRUITER'), async (req, res) => {
  try {
    const candidateId = parseInt(req.params.candidateId);
    const companyId = req.user.companyId;

    const candidate = await prisma.candidate.findFirst({
      where: { 
        id: candidateId,
        applications: {
          some: { job: { companyId: companyId } }
        }
      },
      include: {
        experiences: { orderBy: { sortOrder: 'asc' } },
        educations: { orderBy: { sortOrder: 'asc' } },
        skills: true
      }
    });

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate profile not found or not applied to your company' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${candidate.name.replace(/\\s+/g, '_')}_Resume.pdf"`);
    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);
    doc.fontSize(24).font('Helvetica-Bold').text(candidate.name || 'Candidate Resume', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).font('Helvetica').text(`${candidate.email || ''} | ${candidate.phone || ''} | ${candidate.location || ''}`, { align: 'center' });
    doc.moveDown(1.5);
    
    if (candidate.summary) {
      doc.fontSize(14).font('Helvetica-Bold').text('Summary');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica').text(candidate.summary);
      doc.moveDown(1.5);
    }
    
    if (candidate.experiences && candidate.experiences.length > 0) {
      doc.fontSize(14).font('Helvetica-Bold').text('Experience');
      doc.moveDown(0.5);
      candidate.experiences.forEach(exp => {
        doc.fontSize(12).font('Helvetica-Bold').text(`${exp.title} at ${exp.company}`);
        const start = new Date(exp.startDate).getFullYear();
        const end = exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present';
        doc.fontSize(10).font('Helvetica-Oblique').text(`${start} - ${end}`);
        doc.fontSize(10).font('Helvetica').text(exp.description);
        doc.moveDown(1);
      });
    }
    
    if (candidate.educations && candidate.educations.length > 0) {
      doc.fontSize(14).font('Helvetica-Bold').text('Education');
      doc.moveDown(0.5);
      candidate.educations.forEach(edu => {
        doc.fontSize(12).font('Helvetica-Bold').text(`${edu.degree} in ${edu.field}`);
        doc.fontSize(10).font('Helvetica-Oblique').text(edu.institution);
        doc.moveDown(1);
      });
    }
    
    if (candidate.skills && candidate.skills.length > 0) {
      doc.fontSize(14).font('Helvetica-Bold').text('Skills');
      doc.moveDown(0.5);
      const skillsText = candidate.skills.map(s => `${s.name} (${s.proficiency})`).join(', ');
      doc.fontSize(10).font('Helvetica').text(skillsText);
    }
    
    doc.end();

  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// PUT /api/hr/applications/:id/status
router.put('/applications/:id/status', authenticateToken, requireRole('ADMIN', 'HR_MANAGER', 'RECRUITER'), async (req, res) => {
  try {
    const validated = statusSchema.safeParse(req.body);
    if (!validated.success) {
      return res.status(400).json({ error: validated.error.errors[0].message });
    }
    
    const { status } = validated.data;
    const applicationId = parseInt(req.params.id);
    const companyId = req.user.companyId;

    // Verify application belongs to this company's job
    const application = await prisma.jobApplication.findFirst({
      where: { 
        id: applicationId,
        job: { companyId }
      },
      include: { candidate: true, job: true }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found or unauthorized' });
    }

    const updatedApp = await prisma.jobApplication.update({
      where: { id: applicationId },
      data: { status }
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        userId: req.user.userId,
        action: 'UPDATE_APPLICATION_STATUS',
        entity: 'JobApplication',
        entityId: applicationId,
        details: `Updated status from ${application.status} to ${status} for candidate ${application.candidate.name} on job ${application.job.title}`
      }
    });

    res.json(updatedApp);
  } catch (error) {
    console.error('Update Status Error:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

module.exports = router;
