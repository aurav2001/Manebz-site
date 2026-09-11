import express from 'express';
import inquiryRoutes from './inquiryRoutes.js';
import careerRoutes from './careerRoutes.js';
import contactRoutes from './contactRoutes.js';
import pageRoutes from './pageRoutes.js';
import settingsRoutes from './settingsRoutes.js';
import { getPool } from '../config/db.js';

const router = express.Router();

// Health Check API Endpoint
router.get('/health', async (req, res) => {
  const pool = getPool();
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
    timestamp: new Date().toISOString()
  });
});

// Register Sub-routes
router.use('/inquiries', inquiryRoutes);
router.use('/careers', careerRoutes);
router.use('/contact', contactRoutes);
router.use('/pages', pageRoutes);
router.use('/settings', settingsRoutes);

export default router;
