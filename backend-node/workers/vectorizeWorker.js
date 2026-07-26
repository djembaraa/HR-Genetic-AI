const { Worker } = require('bullmq');
const Redis = require('ioredis');
const FormData = require('form-data');

// Use the local docker-compose Redis connection
const connection = new Redis('redis://localhost:6379', {
  maxRetriesPerRequest: null
});

const worker = new Worker('ai-jobs', async (job) => {
  console.log(`[BullMQ] Processing job ${job.id} of type ${job.name}`);
  
  if (job.name === 'vectorize-profile') {
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
    formData.append('profile_text', profileText);
    
    try {
      const response = await fetch('http://localhost:8000/api/vectorize-profile', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`AI Service returned ${response.status}`);
      }
      
      const result = await response.json();
      console.log(`[BullMQ] Completed vectorizing profile for candidate ${candidateId}: ${result.message}`);
      return { status: 'success', candidateId };
    } catch (error) {
      console.error(`[BullMQ] Failed to vectorize profile for candidate ${candidateId}`, error);
      throw error;
    }
  }

}, { connection });

worker.on('completed', job => {
  console.log(`[BullMQ] Job ${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
  console.log(`[BullMQ] Job ${job.id} has failed with ${err.message}`);
});

module.exports = worker;
