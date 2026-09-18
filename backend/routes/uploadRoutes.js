import express from 'express';
import { uploadImage, listUploads, deleteUpload } from '../controllers/uploadController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const mediaStaff = [requireAuth, requireRole('admin', 'hr')];

const router = express.Router();

// Writing and browsing the media library is admin-only. Reading an individual file is
// public — the images appear on the public website, and Express serves them as static
// files before this router is reached.
router.route('/')
  .get(mediaStaff, listUploads)
  .post(mediaStaff, uploadImage);

router.route('/:name')
  .delete(mediaStaff, deleteUpload);

export default router;
