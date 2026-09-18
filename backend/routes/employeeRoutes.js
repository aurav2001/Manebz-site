import express from 'express';
import {
  getEmployees,
  saveEmployee,
  deleteEmployee,
  getEmployeeStats,
} from '../controllers/employeeController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Every panel role can log placements; the controller decides whose rows come back.
router.route('/')
  .get(requireAuth, getEmployees)
  .post(requireAuth, saveEmployee);

// Cross-recruiter totals are a management view.
router.get('/stats', requireAuth, requireRole('admin', 'hr'), getEmployeeStats);

router.delete('/:id', requireAuth, deleteEmployee);

export default router;
