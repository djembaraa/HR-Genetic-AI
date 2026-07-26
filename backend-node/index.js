require('dotenv').config();

// Startup Validation (Fail-Fast)
const requiredEnvVars = ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'DATABASE_URL'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`FATAL: Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { Queue } = require('bullmq');
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const aiQueue = new Queue('ai-jobs', { connection: new require('ioredis')(redisUrl, { maxRetriesPerRequest: null }) });
const prisma = require('./lib/prisma');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const app = express();

// Logger and Sentry Setup
const winston = require('winston');
const Sentry = require('@sentry/node');
const { nodeProfilingIntegration } = require('@sentry/profiling-node');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Sentry initialization (Mock/Ready if DSN is provided)
Sentry.init({
  dsn: process.env.SENTRY_DSN || "", // Fails safely if empty
  integrations: [
    nodeProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

// Prometheus Setup
const promClient = require('prom-client');
promClient.collectDefaultMetrics({ register: promClient.register });
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

const cookieParser = require('cookie-parser');
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json()); // Essential for receiving JSON in req.body
app.use(cookieParser());

// Sentry & Prometheus Request Handlers
if (Sentry.Handlers && Sentry.Handlers.requestHandler) {
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
}

app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.route ? req.route.path : req.path, code: res.statusCode });
  });
  next();
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

const authRoutes = require('./routes/auth');
const jobsRoutes = require('./routes/jobs');
const candidateRoutes = require('./routes/candidate');
const aiRoutes = require('./routes/ai');

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/candidate', candidateRoutes);
app.use('/api/candidate/resume/pdf', require('./routes/resume-pdf'));
app.use('/api/hr', require('./routes/hr'));
app.use('/api/ai', aiRoutes);

const { authenticateToken, requireRole } = require('./middleware/auth');

// JWT Middleware is now imported from ./middleware/auth.js

// Setup Multer for handling file uploads (PDF)
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF is allowed.'), false);
        }
    }
});


// FASTAPI SERVICE URL
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

app.get('/', (req, res) => {
    logger.info('Gateway health check requested');
    res.send({ message: 'NextGen ATS Express Gateway is running!' });
});

// Example of a Protected Route (Admin Only)
app.get('/api/admin/dashboard', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  // Dashboard mock stats
  res.json({
    message: `Welcome Admin ${req.user.email}`,
    stats: {
      candidates: await prisma.candidate.count(),
      jobs: await prisma.job.count()
    }
  });
});

// Endpoint to handle Candidate CV Upload (B2B HR Flow)
app.post('/api/candidates/upload', authenticateToken, requireRole('ADMIN', 'HR_MANAGER', 'RECRUITER'), upload.single('cv'), async (req, res) => {
    try {
        const { name, email, applied_job_id } = req.body;
        const companyId = req.user.companyId;
        
        if (!req.file) {
            return res.status(400).json({ error: 'CV file is required' });
        }

        // 1. Save candidate to Database (PostgreSQL via Prisma)
        const candidate = await prisma.candidate.create({
            data: {
                name,
                email,
                appliedJobId: applied_job_id ? parseInt(applied_job_id) : null,
                cvUrl: req.file.filename,
                companyId: companyId
            }
        });

        // 2. Enqueue the PDF vectorization job to BullMQ with Exponential Backoff
        await aiQueue.add('vectorize-cv', {
            candidateId: candidate.id,
            companyId: companyId,
            filePath: req.file.path
        }, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 5000
            }
        });
        
        logger.info(`Enqueued CV vectorization for candidate ${candidate.id}`);

        res.status(202).json({
            message: 'Candidate application submitted and CV is queued for AI processing.',
            candidate
        });
    } catch (error) {
        logger.error('Upload Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// AI Agent chat route moved to routes/hr.js

if (Sentry.Handlers && Sentry.Handlers.errorHandler) {
  app.use(Sentry.Handlers.errorHandler());
}

// Start BullMQ Worker
require('./workers/vectorizeWorker');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Express Gateway running on http://localhost:${PORT}`);
});
