const express = require('express');
const PDFDocument = require('pdfkit');
const prisma = require('../lib/prisma');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/candidate/resume/pdf
router.get('/', authenticateToken, requireRole('CANDIDATE'), async (req, res) => {
  try {
    const candidate = await prisma.candidate.findUnique({
      where: { userId: req.user.userId },
      include: {
        experiences: { orderBy: { sortOrder: 'asc' } },
        educations: { orderBy: { sortOrder: 'asc' } },
        skills: true
      }
    });

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate profile not found' });
    }

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${candidate.name.replace(/\s+/g, '_')}_Resume.pdf"`);

    // Create a PDF document
    const doc = new PDFDocument({ margin: 50 });

    // Pipe its output to the response
    doc.pipe(res);

    // Add Content
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

    // Finalize the PDF and end the stream
    doc.end();

  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

module.exports = router;
