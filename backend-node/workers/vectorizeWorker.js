const { Worker } = require('bullmq');
const Redis = require('ioredis');
const FormData = require('form-data');
const fs = require('fs');
const promClient = require('prom-client');
const Sentry = require('@sentry/node');
const prisma = require('../lib/prisma');

// Define Prometheus metrics for Worker
const workerJobsProcessed = new promClient.Counter({
  name: 'worker_jobs_processed_total',
  help: 'Total number of jobs processed by BullMQ worker',
  labelNames: ['job_name', 'status'] // status: success, failed, dlq
});

// Use the environment Redis connection
const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null
});

const worker = new Worker('ai-jobs', async (job) => {
  console.log(`[BullMQ] Processing job ${job.id} of type ${job.name}`);
  
  if (job.name === 'vectorize-cv') {
    const { candidateId, companyId, filePath } = job.data;
    console.log(`[BullMQ] Started vectorizing CV for candidate ${candidateId}...`);
    
    try {
      const formData = new FormData();
      formData.append('candidate_id', candidateId.toString());
      formData.append('company_id', companyId.toString());
      formData.append('file', fs.createReadStream(filePath));
      
      const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
      const response = await fetch(`${AI_SERVICE_URL}/api/process-cv`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`AI Service returned ${response.status}`);
      }
      
      const result = await response.json();
      console.log(`[BullMQ] Completed vectorizing CV for candidate ${candidateId}: ${result.message}`);
      
      // Cleanup the temporary PDF file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`[BullMQ] Cleaned up temporary file: ${filePath}`);
      }
      
      // Update DB Status
      await prisma.candidate.update({
        where: { id: candidateId },
        data: { vectorizationStatus: 'COMPLETED' }
      });
      
      return { status: 'success', candidateId };
    } catch (error) {
      console.error(`[BullMQ] Failed to vectorize CV for candidate ${candidateId}`, error);
      // Update DB Status on failure
      await prisma.candidate.update({
        where: { id: candidateId },
        data: { vectorizationStatus: 'FAILED' }
      }).catch(e => console.error(e));
      
      throw error;
    }
  } else if (job.name === 'vectorize-profile') {
    const { candidateId, profileData } = job.data;
    
    console.log(`[BullMQ] Started vectorizing profile for candidate ${candidateId}...`);
    
    // Format profile data to string
    let profileText = `Name: ${profileData.name || 'Unknown'}\nLocation: ${profileData.location || 'Unknown'}\nSummary: ${profileData.summary || ''}\n\n`;
    
    if (profileData.experiences && profileData.experiences.length > 0) {
      profileText += "EXPERIENCE:\n";
      profileData.experiences.forEach(e => {
        profileText += `${e.title} at ${e.company} (${new Date(e.startDate).getFullYear()} - ${e.endDate ? new Date(e.endDate).getFullYear() : 'Present'})\n${e.description}\n\n`;
      });
    }
    
    if (profileData.educations && profileData.educations.length > 0) {
      profileText += "EDUCATION:\n";
      profileData.educations.forEach(e => {
        profileText += `${e.degree} in ${e.field} from ${e.institution}\n\n`;
      });
    }
    
    if (profileData.skills && profileData.skills.length > 0) {
      profileText += "SKILLS:\n";
      profileData.skills.forEach(s => {
        profileText += `${s.name} (${s.proficiency})\n`;
      });
    }
    
    // Send to Python AI Service
    const formData = new FormData();
    formData.append('candidate_id', candidateId.toString());
    formData.append('company_id', job.data.companyId ? job.data.companyId.toString() : 'default_company');
    formData.append('profile_text', profileText);
    
    try {
      const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
      const response = await fetch(`${AI_SERVICE_URL}/api/vectorize-profile`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`AI Service returned ${response.status}`);
      }
      
      const result = await response.json();
      console.log(`[BullMQ] Completed vectorizing profile for candidate ${candidateId}: ${result.message}`);
      
      // Update DB Status
      await prisma.candidate.update({
        where: { id: candidateId },
        data: { vectorizationStatus: 'COMPLETED' }
      });

      return { status: 'success', candidateId };
    } catch (error) {
      console.error(`[BullMQ] Failed to vectorize profile for candidate ${candidateId}`, error);
      
      // Update DB Status on failure
      await prisma.candidate.update({
        where: { id: candidateId },
        data: { vectorizationStatus: 'FAILED' }
      }).catch(e => console.error(e));
      
      throw error;
    }
  }

}, { connection });

worker.on('completed', job => {
  console.log(`[BullMQ] Job ${job.id} has completed!`);
  workerJobsProcessed.inc({ job_name: job.name, status: 'success' });
});

worker.on('failed', async (job, err) => {
  console.log(`[BullMQ] Job ${job.id} has failed with ${err.message}`);
  workerJobsProcessed.inc({ job_name: job.name, status: 'failed' });
  
  if (Sentry.isInitialized && Sentry.isInitialized()) {
    Sentry.captureException(err, { tags: { jobName: job.name, jobId: job.id } });
  }

  // Check if job has exhausted retries to move to DLQ
  if (job.attemptsMade >= job.opts.attempts) {
    console.error(`[BullMQ] Job ${job.id} exhausted retries. Moving to DLQ.`);
    workerJobsProcessed.inc({ job_name: job.name, status: 'dlq' });
    try {
      await connection.sadd('dlq:ai-jobs', JSON.stringify({
        id: job.id,
        name: job.name,
        data: job.data,
        error: err.message,
        failedAt: new Date().toISOString()
      }));
    } catch (dlqErr) {
      console.error(`[BullMQ] Failed to push to DLQ:`, dlqErr);
    }
  }
});

module.exports = worker;
