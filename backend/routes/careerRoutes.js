import express from 'express';
import {
  submitApplication,
  getApplications,
  updateApplicationStatus,
  deleteApplication
} from '../controllers/careerController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

// Recruiters work the candidate pipeline, so they are included here.
const panelStaff = [requireAuth, requireRole('admin', 'hr', 'recruiter')];

const router = express.Router();

router.route('/')
  // Applications carry candidate PII (email, phone, CTC) — admins only.
  .get(panelStaff, getApplications)
  // Posting stays open: this is the website's own job application form.
  .post(submitApplication);

router.route('/:id')
  .patch(panelStaff, updateApplicationStatus)
  .delete(panelStaff, deleteApplication);

export default router;
