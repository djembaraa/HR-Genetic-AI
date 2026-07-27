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
const Redis = require('ioredis');
const aiQueue = new Queue('ai-jobs', { connection: new Redis(redisUrl, { maxRetriesPerRequest: null }) });
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
const helmet = require('helmet');

app.use(helmet());
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

// Require auth middleware before routes
const { authenticateToken, requireRole } = require('./middleware/auth');

app.get('/metrics', async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== (process.env.PROMETHEUS_API_KEY || 'default-metrics-key-please-change')) {
    return res.status(401).send('Unauthorized');
  }
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

const authRoutes = require('./routes/auth');
const jobsRoutes = require('./routes/jobs');
const candidateRoutes = require('./routes/candidate');
const aiRoutes = require('./routes/ai');
const notificationRoutes = require('./routes/notifications');

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/candidate', candidateRoutes);
app.use('/api/candidate/resume/pdf', require('./routes/resume-pdf'));
app.use('/api/company', require('./routes/company'));
app.use('/api/hr', require('./routes/hr'));
app.use('/api/ai', aiRoutes);
app.use('/api/internal', require('./routes/ai-internal'));
app.use('/api/notifications', notificationRoutes);

// FastAPI Service URL (imported globally if needed, though used in specific routes)
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';



app.get('/', (req, res) => {
    logger.info('Gateway health check requested');
    res.send({ message: 'NextGen ATS Express Gateway is running!' });
});

// Example of a Protected Route (Admin Only)
app.get('/api/admin/dashboard', authenticateToken, requireRole('ADMIN', 'HR_MANAGER', 'RECRUITER'), async (req, res) => {
  try {
    const companyId = req.user.companyId;
    if (!companyId) return res.status(403).json({ error: 'User is not associated with a company' });
    
    const company = await prisma.company.findUnique({
      where: { id: companyId }
    });

      // Scoped dashboard stats
      const totalCandidates = await prisma.candidate.count({
        where: { applications: { some: { job: { companyId } } } }
      });
      const processedCandidates = await prisma.candidate.count({
        where: { 
          applications: { some: { job: { companyId } } },
          vectorizationStatus: 'COMPLETED'
        }
      });
      const totalJobs = await prisma.job.count({
        where: { companyId }
      });

      res.json({
        message: `Welcome Admin ${req.user.email}`,
        company, // include company info
        stats: {
          candidates: totalCandidates,
          processedCandidates: processedCandidates,
          jobs: totalJobs
        }
      });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});



// AI Agent chat route moved to routes/hr.js

if (Sentry.Handlers && Sentry.Handlers.errorHandler) {
  app.use(Sentry.Handlers.errorHandler());
}

// Global Express Error Handler
app.use((err, req, res, next) => {
  logger.error('Unhandled Exception:', err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start BullMQ Worker
require('./workers/vectorizeWorker');

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Express Gateway running on http://localhost:${PORT}`);
});

// Graceful Shutdown
const shutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  
  server.close(async () => {
    console.log('HTTP server closed.');
    try {
      await prisma.$disconnect();
      console.log('Prisma disconnected.');
      process.exit(0);
    } catch (err) {
      console.error('Error during shutdown:', err);
      process.exit(1);
    }
  });
  
  // Force shutdown after 10s
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
