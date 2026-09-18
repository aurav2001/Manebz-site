import express from 'express';
import {
  createInquiry,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry
} from '../controllers/inquiryController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const hiringStaff = [requireAuth, requireRole('admin', 'hr')];

const router = express.Router();

router.route('/')
  // Reading leads exposes names, phone numbers and emails — admins only.
  .get(hiringStaff, getInquiries)
  // Posting stays open: this is the website's own quote form.
  .post(createInquiry);

router.route('/:id')
  .patch(hiringStaff, updateInquiryStatus)
  .delete(hiringStaff, deleteInquiry);

export default router;
