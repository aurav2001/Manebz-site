import express from 'express';
import {
  getCompanies,
  saveCompany,
  deleteCompany,
  getCompanyBreakdown,
} from '../controllers/companyController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

const panelStaff = [requireAuth, requireRole('admin', 'hr', 'recruiter')];
const managers = [requireAuth, requireRole('admin', 'hr')];

// Recruiters read and add clients — they need to log a placement against a new company
// without waiting for someone else. The controller blocks them from editing one.
router.route('/')
  .get(panelStaff, getCompanies)
  .post(panelStaff, saveCompany);

// Declared before /:id so "breakdown" is never read as a company id.
router.get('/breakdown', managers, getCompanyBreakdown);

router.delete('/:id', managers, deleteCompany);

export default router;
