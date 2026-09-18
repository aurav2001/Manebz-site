import express from 'express';
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
  listResetRequests,
  dismissResetRequest,
} from '../controllers/userController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Only admin and HR manage accounts at all; the controller then narrows it further —
// HR may only touch recruiters.
const staffOnly = [requireAuth, requireRole('admin', 'hr')];

router.route('/')
  .get(staffOnly, listUsers)
  .post(staffOnly, createUser);

// Declared before /:id so "reset-requests" is never read as a user id.
router.get('/reset-requests', staffOnly, listResetRequests);
router.delete('/reset-requests/:id', staffOnly, dismissResetRequest);

router.post('/:id/reset-password', staffOnly, resetUserPassword);

router.route('/:id')
  .patch(staffOnly, updateUser)
  .delete(staffOnly, deleteUser);

export default router;
