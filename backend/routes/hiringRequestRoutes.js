import express from 'express';
import {
  createHiringRequest,
  getHiringRequests,
  updateHiringRequest,
  deleteHiringRequest,
  getHiringStats,
} from '../controllers/hiringRequestController.js';
import { requireAuth, requireRole, readToken } from '../middleware/auth.js';

const router = express.Router();

const panelStaff = [requireAuth, requireRole('admin', 'hr', 'recruiter')];
const managers = [requireAuth, requireRole('admin', 'hr')];

/**
 * Attaches req.user when a valid token is present but lets anonymous requests through.
 *
 * The create route is public so a company can post a requirement from the website, yet
 * it still needs to know when Admin or HR is the one entering it — that decides whether
 * the row is marked as coming from the website or the panel.
 */
const optionalAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  const payload = token ? readToken(token) : null;
  if (payload) req.user = payload;
  return next();
};

router.route('/')
  // Public: the website's "Hire staff" form posts here.
  .post(optionalAuth, createHiringRequest)
  // Reading requirements exposes client contact details — panel only. Recruiters see
  // just the ones assigned to them.
  .get(panelStaff, getHiringRequests);

// Declared before /:id so "stats" is never read as a request id.
router.get('/stats', managers, getHiringStats);

router.route('/:id')
  .patch(managers, updateHiringRequest)
  .delete(managers, deleteHiringRequest);

export default router;
