import express from 'express';
import {
  getPages,
  savePage,
  deletePage
} from '../controllers/pageController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const adminOnly = [requireAuth, requireRole('admin')];

const router = express.Router();

router.route('/')
  // Public: the website renders these custom pages.
  .get(getPages)
  .post(adminOnly, savePage);

router.route('/:id')
  .delete(adminOnly, deletePage);

export default router;
