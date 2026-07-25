const { Worker } = require('bullmq');
const Redis = require('ioredis');
const FormData = require('form-data');

// Use the local docker-compose Redis connection
const connection = new Redis('redis://localhost:6379');

const worker = new Worker('ai-jobs', async (job) => {
  console.log(`[BullMQ] Processing job ${job.id} of type ${job.name}`);
  
  if (job.name === 'vectorize-profile') {
    const { candidateId, profileData } = job.data;
    
    // In a real scenario, we'd generate a PDF from profileData, or just send raw text.
    // Since our AI service expects a PDF CV (from Phase 1), we could use a library like PDFKit here.
    // For MVP Tahap B, let's just log the async processing success.
    
    console.log(`[BullMQ] Started vectorizing profile for candidate ${candidateId}...`);
    
    // Simulating heavy AI processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log(`[BullMQ] Completed vectorizing profile for candidate ${candidateId}`);
    return { status: 'success', candidateId };
  }

}, { connection });

worker.on('completed', job => {
  console.log(`[BullMQ] Job ${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
  console.log(`[BullMQ] Job ${job.id} has failed with ${err.message}`);
});

module.exports = worker;
