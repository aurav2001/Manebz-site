import express from 'express';
import {
  submitApplication,
  getApplications,
  updateApplicationStatus,
  deleteApplication
} from '../controllers/careerController.js';

const router = express.Router();

router.route('/')
  .get(getApplications)
  .post(submitApplication);

router.route('/:id')
  .patch(updateApplicationStatus)
  .delete(deleteApplication);

export default router;
