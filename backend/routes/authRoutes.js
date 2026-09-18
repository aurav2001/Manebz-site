import express from 'express';
import {
  login,
  me,
  changeOwnPassword,
  forgotPassword,
  resetWithToken,
} from '../controllers/userController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Public: anyone at the login screen needs these.
router.post('/login', login);
router.post('/forgot', forgotPassword);
router.post('/reset', resetWithToken);

// Signed in.
router.get('/me', requireAuth, me);
router.post('/change-password', requireAuth, changeOwnPassword);

export default router;
