const express = require('express');
const { Queue } = require('bullmq');
const Redis = require('ioredis');
const prisma = require('../lib/prisma');
const { authenticateToken, requireRole } = require('../middleware/auth');
const FormData = require('form-data');
const { z } = require('zod');
const multer = require('multer');
const fs = require('fs');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// --- Auto-Fill Candidate Profile from CV ---
router.post('/extract-cv', authenticateToken, requireRole('CANDIDATE'), upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'PDF file is required' });

  try {
    const fileBuffer = fs.readFileSync(req.file.path);
    const blob = new Blob([fileBuffer], { type: req.file.mimetype || 'application/pdf' });
    const formData = new FormData();
    formData.append('file', blob, req.file.originalname);

    const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    const AI_API_KEY = process.env.AI_SERVICE_API_KEY || 'default-ai-secret-key';
    const response = await fetch(`${AI_SERVICE_URL}/api/extract-cv-pdf`, {
      method: 'POST',
      headers: { 'x-api-key': AI_API_KEY },
      body: formData
    });

    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    if (!response.ok) throw new Error(`AI service returned ${response.status}`);

    const extractedData = await response.json();
    
    // Update DB
    const candidate = await prisma.candidate.findUnique({ where: { userId: req.user.userId } });
    if (!candidate) return res.status(404).json({ error: "Candidate not found" });

    await prisma.$transaction(async (tx) => {
      // 1. Update basic info if empty
      const updateData = {};
      if (extractedData.location && !candidate.location) updateData.location = extractedData.location;
      if (extractedData.summary && !candidate.summary) updateData.summary = extractedData.summary;
      if (Object.keys(updateData).length > 0) {
         await tx.candidate.update({ where: { id: candidate.id }, data: updateData });
      }

      // 2. Add skills (avoiding duplicates by just adding new ones since they might have old ones)
      if (extractedData.skills && extractedData.skills.length > 0) {
         const existingSkills = await tx.skill.findMany({ where: { candidateId: candidate.id } });
         const existingNames = new Set(existingSkills.map(s => s.name.toLowerCase()));
         const newSkills = extractedData.skills.filter(s => !existingNames.has(s.toLowerCase()));
         
         if (newSkills.length > 0) {
           await tx.skill.createMany({
              data: newSkills.map(s => ({
                candidateId: candidate.id,
                name: s,
                proficiency: 'INTERMEDIATE'
              }))
           });
         }
      }

      // 3. Add experiences (we clear existing to prevent duplicates during extraction)
      if (extractedData.experiences && extractedData.experiences.length > 0) {
         await tx.experience.deleteMany({ where: { candidateId: candidate.id } });
         await tx.experience.createMany({
            data: extractedData.experiences.map((exp, i) => {
              const startDate = exp.startDate ? new Date(exp.startDate) : new Date();
              const endDate = exp.endDate ? new Date(exp.endDate) : null;
              
              const safeStartDate = isNaN(startDate) ? new Date() : startDate;
              const safeEndDate = endDate && isNaN(endDate) ? null : endDate;
              
              return {
                candidateId: candidate.id,
                company: exp.company || "Unknown",
                title: exp.title || "Unknown",
                description: exp.description || "",
                startDate: safeStartDate,
                endDate: safeEndDate,
                sortOrder: i
              }
            })
         });
      }

      // 4. Add educations
      if (extractedData.educations && extractedData.educations.length > 0) {
         await tx.education.deleteMany({ where: { candidateId: candidate.id } });
         await tx.education.createMany({
            data: extractedData.educations.map((edu, i) => {
              const startDate = edu.startDate ? new Date(edu.startDate) : new Date();
              const endDate = edu.endDate ? new Date(edu.endDate) : null;
              
              const safeStartDate = isNaN(startDate) ? new Date() : startDate;
              const safeEndDate = endDate && isNaN(endDate) ? null : endDate;
              
              return {
                candidateId: candidate.id,
                institution: edu.institution || "Unknown",
                degree: edu.degree || "Unknown",
                field: edu.field || "Unknown",
                startDate: safeStartDate,
                endDate: safeEndDate,
                sortOrder: i
              }
            })
         });
      }
    });

    res.json({ message: "Profile automatically filled from CV!" });
  } catch (error) {
    console.error('Error proxying AI CV Extraction:', error.message);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: 'Failed to extract CV with AI' });
  }
});

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

// Onboarding: Save full profile and trigger vectorization
router.post('/onboard', async (req, res) => {
  try {
    const { location, summary, skills = [], experience = [] } = req.body;
    
    // Validate basics
    if (!location) return res.status(400).json({ error: "Location is required" });

    const candidate = await prisma.candidate.findUnique({
      where: { userId: req.user.userId }
    });

    if (!candidate) return res.status(404).json({ error: "Candidate not found" });

    // Transaction to update candidate, add skills, and add experience
    await prisma.$transaction(async (tx) => {
      // Update basic info
      await tx.candidate.update({
        where: { id: candidate.id },
        data: { location, summary }
      });

      // Clear existing skills to prevent duplicates if they somehow go back and re-onboard
      await tx.skill.deleteMany({ where: { candidateId: candidate.id } });
      if (skills.length > 0) {
        await tx.skill.createMany({
          data: skills.map(s => ({
            candidateId: candidate.id,
            name: s,
            proficiency: 'INTERMEDIATE'
          }))
        });
      }

      // Clear existing experience
      await tx.experience.deleteMany({ where: { candidateId: candidate.id } });
      if (experience.length > 0) {
        await tx.experience.createMany({
          data: experience.map((exp, i) => ({
            candidateId: candidate.id,
            company: exp.company,
            title: exp.title,
            description: exp.description || "",
            startDate: new Date(exp.startDate),
            endDate: exp.endDate ? new Date(exp.endDate) : null,
            sortOrder: i
          }))
        });
      }
    });

    // Automatically trigger vectorization so HR can search them immediately
    const updatedCandidate = await prisma.candidate.findUnique({
      where: { id: candidate.id },
      include: { experiences: true, educations: true, skills: true, applications: { include: { job: true } } }
    });

    const companyIds = ['default', ...new Set(updatedCandidate.applications.map(app => app.job.companyId))];
    for (const companyId of companyIds) {
      await aiQueue.add('vectorize-profile', {
        candidateId: updatedCandidate.id,
        companyId: companyId,
        profileData: updatedCandidate
      }, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 }
      });
    }

    res.json({ message: "Onboarding completed successfully!" });
  } catch (error) {
    console.error("Onboarding error:", error);
    res.status(500).json({ error: "Failed to save onboarding data" });
  }
});

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

router.get('/applications', async (req, res) => {
  try {
    const candidate = await prisma.candidate.findUnique({
      where: { userId: req.user.userId }
    });

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate profile not found' });
    }

    const applications = await prisma.jobApplication.findMany({
      where: { candidateId: candidate.id },
      include: {
        job: { include: { company: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(applications);
  } catch (error) {
    console.error('Fetch applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

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
