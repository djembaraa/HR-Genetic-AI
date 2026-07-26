const express = require('express');
const FormData = require('form-data');
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

module.exports = router;
