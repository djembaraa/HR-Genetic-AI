const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Route: POST /api/ai/enhance
// Protected so only candidates can use it to enhance their resume
router.post('/enhance', authenticateToken, requireRole('CANDIDATE'), async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });

  try {
    const formData = new FormData();
    formData.append('text', text);

    const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    const AI_API_KEY = process.env.AI_SERVICE_API_KEY || 'default-ai-secret-key';
    const response = await fetch(`${AI_SERVICE_URL}/api/enhance-resume`, {
      method: 'POST',
      headers: {
        'x-api-key': AI_API_KEY
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`AI service returned ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error proxying AI enhancement:', error.message);
    res.status(500).json({ error: 'Failed to enhance text with AI' });
  }
});

// Route: POST /api/ai/generate
router.post('/generate', authenticateToken, requireRole('CANDIDATE'), async (req, res) => {
  const { title, company } = req.body;
  if (!title) return res.status(400).json({ error: 'Job title is required' });

  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('company', company || '');

    const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    const AI_API_KEY = process.env.AI_SERVICE_API_KEY || 'default-ai-secret-key';
    const response = await fetch(`${AI_SERVICE_URL}/api/generate-description`, {
      method: 'POST',
      headers: {
        'x-api-key': AI_API_KEY
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`AI service returned ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error proxying AI generation:', error.message);
    res.status(500).json({ error: 'Failed to generate text with AI' });
  }
});

const multer = require('multer');
const fs = require('fs');
const upload = multer({ dest: 'uploads/' });

// Route: POST /api/ai/analyze-cv
router.post('/analyze-cv', authenticateToken, requireRole('CANDIDATE'), upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'PDF file is required' });
  }

  try {
    const fileBuffer = fs.readFileSync(req.file.path);
    const blob = new Blob([fileBuffer], { type: req.file.mimetype || 'application/pdf' });
    const formData = new FormData();
    formData.append('file', blob, req.file.originalname);

    const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    const AI_API_KEY = process.env.AI_SERVICE_API_KEY || 'default-ai-secret-key';
    const response = await fetch(`${AI_SERVICE_URL}/api/analyze-cv-pdf`, {
      method: 'POST',
      headers: {
        'x-api-key': AI_API_KEY
      },
      body: formData
    });

    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    if (!response.ok) {
      throw new Error(`AI service returned ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error proxying AI CV Analysis:', error.message);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Failed to analyze CV with AI' });
  }
});

module.exports = router;
