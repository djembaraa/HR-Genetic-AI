const express = require('express');
const { Queue } = require('bullmq');
const Redis = require('ioredis');
const prisma = require('../lib/prisma');
const { authenticateToken, requireRole } = require('../middleware/auth');
const FormData = require('form-data');
const { z } = require('zod');

const router = express.Router();

const profileSchema = z.object({
  name: z.string().min(2, "Name is required").optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  summary: z.string().optional()
});

const experienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid start date"),
  endDate: z.string().refine((val) => val === '' || !isNaN(Date.parse(val)), "Invalid end date").optional().nullable()
});

const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().min(1, "Field is required"),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid start date"),
  endDate: z.string().refine((val) => val === '' || !isNaN(Date.parse(val)), "Invalid end date").optional().nullable()
});

const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  proficiency: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]).optional()
});

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null
});
const aiQueue = new Queue('ai-jobs', { connection });

// Middleware specifically for CANDIDATE role
router.use(authenticateToken);
router.use(requireRole('CANDIDATE'));

// Trigger async vectorization of the candidate profile
router.post('/vectorize', async (req, res) => {
  try {
    const candidate = await prisma.candidate.findUnique({
      where: { userId: req.user.userId },
      include: { 
        experiences: true, 
        educations: true, 
        skills: true,
        applications: { include: { job: true } }
      }
    });

    const companyIds = ['default', ...new Set(candidate.applications.map(app => app.job.companyId))];

    for (const companyId of companyIds) {
      await aiQueue.add('vectorize-profile', {
        candidateId: candidate.id,
        companyId: companyId,
        profileData: candidate
      }, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000
        }
      });
    }

    res.status(202).json({ message: 'Profile queued for AI vectorization' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to queue vectorization' });
  }
});

// Get the logged-in candidate's full profile
router.get('/profile', async (req, res) => {
  try {
    const candidate = await prisma.candidate.findUnique({
      where: { userId: req.user.userId },
      include: {
        experiences: { orderBy: { sortOrder: 'asc' } },
        educations: { orderBy: { sortOrder: 'asc' } },
        skills: true,
        applications: {
          include: { job: { include: { company: true } } }
        }
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
  try {
    const validated = profileSchema.safeParse(req.body);
    if (!validated.success) return res.status(400).json({ error: validated.error.errors[0].message });
    const { name, phone, location, summary } = validated.data;
    
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

// Get AI Job Recommendations
router.get('/recommendations', async (req, res) => {
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

    let profileText = `Name: ${candidate.name || 'Unknown'}\nSummary: ${candidate.summary || ''}\n\n`;
    if (candidate.experiences?.length > 0) {
      profileText += "EXPERIENCE:\n" + candidate.experiences.map(e => `${e.title} at ${e.company}\n${e.description}`).join('\n\n') + "\n\n";
    }
    if (candidate.skills?.length > 0) {
      profileText += "SKILLS:\n" + candidate.skills.map(s => s.name).join(', ') + "\n\n";
    }

    const jobs = await prisma.job.findMany({
      where: { status: 'OPEN' },
      select: { id: true, title: true, department: true, description: true }
    });

    const formData = new FormData();
    formData.append('profile_text', profileText);
    formData.append('jobs_json', JSON.stringify(jobs));

    const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    const response = await fetch(`${AI_SERVICE_URL}/api/recommend-jobs`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`AI Service returned ${response.status}`);
    }

    const result = await response.json();
    res.json(result);
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

// --- Job Application ---

router.post('/apply/:jobId', async (req, res) => {
  const { jobId } = req.params;
  try {
    // Check if the job exists and is open
    const job = await prisma.job.findUnique({
      where: { id: parseInt(jobId) },
    });
    
    if (!job || job.status !== 'OPEN') {
      return res.status(404).json({ error: 'Job not found or is closed' });
    }

    const candidate = await prisma.candidate.findUnique({
      where: { userId: req.user.userId },
      include: { experiences: true, educations: true, skills: true }
    });
    
    // Check if already applied
    const existingApp = await prisma.jobApplication.findUnique({
      where: {
        candidateId_jobId: {
          candidateId: candidate.id,
          jobId: parseInt(jobId)
        }
      }
    });
    if (existingApp) {
      return res.status(400).json({ error: 'You have already applied to this job' });
    }

    // Create the application
    await prisma.jobApplication.create({
      data: {
        candidateId: candidate.id,
        jobId: parseInt(jobId)
      }
    });

    // Also trigger vectorize-profile for this specific company so they are added to the company's ChromaDB context
    await aiQueue.add('vectorize-profile', {
      candidateId: candidate.id,
      companyId: job.companyId,
      profileData: candidate
    }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 }
    });

    // Return the updated candidate profile structure for the frontend
    const updatedCandidate = await prisma.candidate.findUnique({
      where: { userId: req.user.userId },
      include: {
        experiences: { orderBy: { sortOrder: 'asc' } },
        educations: { orderBy: { sortOrder: 'asc' } },
        skills: true,
        applications: { include: { job: { include: { company: true } } } }
      }
    });

    res.json({ message: 'Successfully applied to job', candidate: updatedCandidate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to apply for job' });
  }
});

// --- Experience ---

router.post('/experience', async (req, res) => {
  try {
    const validated = experienceSchema.safeParse(req.body);
    if (!validated.success) return res.status(400).json({ error: validated.error.errors[0].message });
    const { company, title, description, startDate, endDate } = validated.data;
    
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

router.put('/experience/:id', async (req, res) => {
  try {
    if (!req.body.description) return res.status(400).json({ error: "Description is required" });
    const { description } = req.body;
    
    const candidate = await prisma.candidate.findUnique({ where: { userId: req.user.userId } });
    const existing = await prisma.experience.findFirst({
      where: { id: parseInt(req.params.id), candidateId: candidate.id }
    });
    
    if (!existing) {
      return res.status(404).json({ error: 'Experience not found or unauthorized' });
    }

    const experience = await prisma.experience.update({
      where: { id: parseInt(req.params.id) },
      data: { description }
    });
    res.json(experience);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update experience' });
  }
});

router.delete('/experience/:id', async (req, res) => {
  try {
    const candidate = await prisma.candidate.findUnique({ where: { userId: req.user.userId } });
    const existing = await prisma.experience.findFirst({
      where: { id: parseInt(req.params.id), candidateId: candidate.id }
    });
    
    if (!existing) {
      return res.status(404).json({ error: 'Experience not found or unauthorized' });
    }

    await prisma.experience.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

// --- Education ---

router.post('/education', async (req, res) => {
  try {
    const validated = educationSchema.safeParse(req.body);
    if (!validated.success) return res.status(400).json({ error: validated.error.errors[0].message });
    const { institution, degree, field, startDate, endDate } = validated.data;
    
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
    const candidate = await prisma.candidate.findUnique({ where: { userId: req.user.userId } });
    const existing = await prisma.education.findFirst({
      where: { id: parseInt(req.params.id), candidateId: candidate.id }
    });
    
    if (!existing) {
      return res.status(404).json({ error: 'Education not found or unauthorized' });
    }

    await prisma.education.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

// --- Skills ---

router.post('/skill', async (req, res) => {
  try {
    const validated = skillSchema.safeParse(req.body);
    if (!validated.success) return res.status(400).json({ error: validated.error.errors[0].message });
    const { name, proficiency } = validated.data;
    
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
    const candidate = await prisma.candidate.findUnique({ where: { userId: req.user.userId } });
    const existing = await prisma.skill.findFirst({
      where: { id: parseInt(req.params.id), candidateId: candidate.id }
    });
    
    if (!existing) {
      return res.status(404).json({ error: 'Skill not found or unauthorized' });
    }

    await prisma.skill.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

module.exports = router;
