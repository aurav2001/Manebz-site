import express from 'express';
import {
  createInquiry,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry
} from '../controllers/inquiryController.js';

const router = express.Router();

router.route('/')
  .get(getInquiries)
  .post(createInquiry);

router.route('/:id')
  .patch(updateInquiryStatus)
  .delete(deleteInquiry);

export default router;
