import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { initDB } from './config/db.js';
import apiRouter from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || '*';

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: false
}));

// CORS Configuration
app.use(cors({
  origin: CLIENT_URL === '*' ? '*' : CLIENT_URL.split(','),
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

// API Routes
app.use('/api', apiRouter);

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
const startServer = async () => {
  await initDB();

  app.listen(PORT, () => {
    console.log(`🚀 [MANABS Backend] Server running on http://localhost:${PORT}`);
    console.log(`📡 [MANABS Backend] API endpoints active at http://localhost:${PORT}/api`);
  });
};

startServer();

export default app;
