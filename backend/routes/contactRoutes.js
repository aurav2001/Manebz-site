import express from 'express';
import {
  submitContactMessage,
  getContactMessages
} from '../controllers/contactController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const hiringStaff = [requireAuth, requireRole('admin', 'hr')];

const router = express.Router();

router.route('/')
  // Messages carry sender name, email and phone — admins only.
  .get(hiringStaff, getContactMessages)
  // Posting stays open: this is the website's own contact form.
  .post(submitContactMessage);

export default router;
