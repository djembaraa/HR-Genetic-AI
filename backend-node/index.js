const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const prisma = new PrismaClient();

// Setup Multer for handling file uploads (PDF)
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

app.use(cors());
app.use(express.json());

// FASTAPI SERVICE URL
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

app.get('/', (req, res) => {
    res.send({ message: 'NextGen ATS Express Gateway is running!' });
});

// Endpoint to handle Candidate CV Upload
app.post('/api/candidates/upload', upload.single('cv'), async (req, res) => {
    try {
        const { name, email, applied_job_id } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ error: 'CV file is required' });
        }

        // 1. Save candidate to Database (SQLite via Prisma)
        // Note: For now we mock the DB save if Prisma schema isn't fully set up yet.
        // Uncomment once DB is migrated:
        /*
        const candidate = await prisma.candidate.create({
            data: {
                name,
                email,
                applied_job_id: applied_job_id ? parseInt(applied_job_id) : null,
                cv_url: req.file.path
            }
        });
        */
        const candidate = { id: Date.now().toString(), name, email }; // Mock ID

        // 2. Forward the PDF to the AI Microservice (FastAPI) for processing
        const formData = new FormData();
        formData.append('candidate_id', candidate.id.toString());
        formData.append('file', fs.createReadStream(req.file.path));

        const aiResponse = await fetch(`${AI_SERVICE_URL}/api/process-cv`, {
            method: 'POST',
            body: formData,
        });

        const aiResult = await aiResponse.json();

        res.json({
            message: 'Candidate application submitted and CV is being processed by AI.',
            candidate,
            ai_status: aiResult
        });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to chat with HR Agent
app.post('/api/hr/chat', async (req, res) => {
    try {
        const { query } = req.body;

        const formData = new FormData();
        formData.append('query', query);

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Express Gateway running on http://localhost:${PORT}`);
});
