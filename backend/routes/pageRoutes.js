import express from 'express';
import {
  getPages,
  savePage,
  deletePage
} from '../controllers/pageController.js';

const router = express.Router();

router.route('/')
  .get(getPages)
  .post(savePage);

router.route('/:id')
  .delete(deletePage);

export default router;
