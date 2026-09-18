import express from 'express';
import { getSettings, saveSettings } from '../controllers/settingsController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const adminOnly = [requireAuth, requireRole('admin')];

const router = express.Router();

// Both sides are admin-only: settings hold the webhook URL, EmailJS keys and the
// notification address, none of which belong in a public response.
router.route('/')
  .get(adminOnly, getSettings)
  .post(adminOnly, saveSettings);

export default router;
