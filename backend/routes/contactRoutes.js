import express from 'express';
import {
  submitContactMessage,
  getContactMessages
} from '../controllers/contactController.js';

const router = express.Router();

router.route('/')
  .get(getContactMessages)
  .post(submitContactMessage);

export default router;
