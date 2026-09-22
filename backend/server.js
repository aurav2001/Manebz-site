import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initDB } from './config/db.js';
import apiRouter from './routes/api.js';
import { UPLOAD_DIR, ensureUploadDir } from './controllers/uploadController.js';
import { getMailStatus, verifySmtp } from './services/mailer.js';

dotenv.config();
// Same guard as config/db.js: import.meta.url is undefined inside the CJS bundle.
if (import.meta.url) {
  dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '.env') });
}

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || '*';

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: false
}));

// CORS Configuration
// Origins are compared byte-for-byte by the cors package, so a configured
// "https://manebz.com/" never matches the browser's "https://manebz.com".
// Normalise here, and accept the www/non-www twin of every allowed host.
const allowedOrigins = CLIENT_URL === '*' ? null : CLIENT_URL
  .split(',')
  .map(o => o.trim().replace(/\/+$/, ''))
  .filter(Boolean)
  .flatMap(o => (o.includes('://www.') ? [o, o.replace('://www.', '://')] : [o, o.replace('://', '://www.')]));

app.use(cors({
  origin: (origin, callback) => {
    // Same-origin requests, curl and server-to-server calls send no Origin header.
    if (!origin || !allowedOrigins) return callback(null, true);
    return callback(null, allowedOrigins.includes(origin.replace(/\/+$/, '')));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logger
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Uploaded images, served straight from Node so they resolve whatever the hosting
// layout is — /api already reaches this app. Mounted ahead of the API router because
// express.static only answers GET/HEAD, leaving POST /api/uploads to the router below.
const uploadStatic = express.static(UPLOAD_DIR, {
  maxAge: '30d',
  immutable: true,
  fallthrough: true,
  index: false,
  // Without this, a bare GET /api/uploads is answered with an HTML 301 to the trailing
  // slash instead of falling through to the router that lists the media library.
  redirect: false,
});
app.use('/api/uploads', uploadStatic);
app.use('/uploads', uploadStatic);

// API Routes (supports both /api and root mount for cPanel sub-path deployments)
app.use('/api', apiRouter);
app.use('/', apiRouter);

// Root Index Route
app.get('/', (req, res) => {
  res.json({
    message: 'MANABS / MANEBZ Enterprise API Server is running.',
    healthCheck: '/api/health',
    endpoints: [
      '/api/inquiries',
      '/api/careers',
      '/api/contact',
      '/api/pages',
      '/api/settings'
    ]
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.originalUrl} not found`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server and Initialize Database
//
// The socket opens first and the database warms up behind it. Waiting on initDB()
// before listening meant that under Passenger — which spins the app down when idle and
// cold-boots it on the next request — anything arriving mid-startup got Apache's HTML
// 500 page instead of the API. A schema migration on first boot made that window long
// enough to hit. Every controller already falls back when getPool() is null, so the few
// requests that land before MySQL is ready get an empty result, not an error page.
// Email status is worth one log line at boot: it is the first thing to check
// when "the form was submitted but no mail came".
const logMailStatus = () => getMailStatus().then(async (m) => {
  if (!m.smtpConfigured) {
    console.info(`📭 [Mailer] SMTP not configured — notifications to ${m.notifyTo} will ${m.fallback ? 'use ' + m.fallback : 'be skipped'}. Set SMTP_USER / SMTP_PASS in .env.`);
    return;
  }
  const v = await verifySmtp();
  console.info(v.ok
    ? `📬 [Mailer] SMTP ready: ${m.user} via ${m.host}:${m.port} → notifications to ${m.notifyTo}`
    : `⚠️ [Mailer] SMTP configured but login failed (${m.host}:${m.port}): ${v.error}`);
}).catch(() => {});


const startServer = () => {
  app.listen(PORT, () => {
    console.log(`🚀 [MANABS Backend] Server running on http://localhost:${PORT}`);
    console.log(`📡 [MANABS Backend] API endpoints active at http://localhost:${PORT}/api`);
  });

  ensureUploadDir().then((ok) => {
    if (ok) console.log(`🖼️  [Uploads] Media folder ready at ${UPLOAD_DIR}`);
  });

  initDB()
    .catch((err) => {
      console.error('❌ [MANABS Backend] Database initialisation failed:', err.message || err);
    })
    .then(logMailStatus);
};

startServer();

export default app;
