import express from 'express';
import inquiryRoutes from './inquiryRoutes.js';
import careerRoutes from './careerRoutes.js';
import contactRoutes from './contactRoutes.js';
import pageRoutes from './pageRoutes.js';
import settingsRoutes from './settingsRoutes.js';
import contentRoutes from './contentRoutes.js';
import authRoutes from './authRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import userRoutes from './userRoutes.js';
import employeeRoutes from './employeeRoutes.js';
import companyRoutes from './companyRoutes.js';
import hiringRequestRoutes from './hiringRequestRoutes.js';
import { getPool, getDbDiagnosticInfo } from '../config/db.js';

const router = express.Router();

// Health Check API Endpoint
router.get('/health', async (req, res) => {
  const pool = getPool();
  const diag = getDbDiagnosticInfo ? getDbDiagnosticInfo() : {};
  let dbStatus = 'Disconnected / Fallback Mode';
  
  if (pool) {
    try {
      await pool.query('SELECT 1');
      dbStatus = 'Connected (MySQL Healthy)';
    } catch (err) {
      dbStatus = `Error: ${err.message}`;
    }
  }

  res.status(200).json({
    status: 'online',
    system: 'MANABS / MANEBZ Enterprise Portal API',
    uptime: process.uptime(),
    database: dbStatus,
    ...(pool ? {} : { dbError: diag.error || 'Connection failed', dbConfig: diag.config }),
    timestamp: new Date().toISOString()
  });
});

// Register Sub-routes
router.use('/auth', authRoutes);
router.use('/uploads', uploadRoutes);
router.use('/users', userRoutes);
router.use('/employees', employeeRoutes);
router.use('/companies', companyRoutes);
router.use('/hiring-requests', hiringRequestRoutes);
router.use('/content', contentRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/careers', careerRoutes);
router.use('/contact', contactRoutes);
router.use('/pages', pageRoutes);
router.use('/settings', settingsRoutes);

export default router;
