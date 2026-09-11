import express from 'express';
import {
  getServices,
  saveService,
  deleteService,
  getJobs,
  saveJob,
  deleteJob,
  getStats,
  saveStats,
  getCompliances,
  saveCompliances,
  getTestimonials,
  saveTestimonials,
  getBlogs,
  saveBlog,
  deleteBlog,
  getNavItems,
  saveNavItems
} from '../controllers/contentController.js';

const router = express.Router();

// Services
router.route('/services').get(getServices).post(saveService);
router.route('/services/:id').delete(deleteService);

// Jobs
router.route('/jobs').get(getJobs).post(saveJob);
router.route('/jobs/:id').delete(deleteJob);

// Company Stats
router.route('/stats').get(getStats).post(saveStats);

// Statutory Compliances
router.route('/compliances').get(getCompliances).post(saveCompliances);

// Testimonials
router.route('/testimonials').get(getTestimonials).post(saveTestimonials);

// Blogs
router.route('/blogs').get(getBlogs).post(saveBlog);
router.route('/blogs/:id').delete(deleteBlog);

// Navigation Items
router.route('/nav').get(getNavItems).post(saveNavItems);

export default router;
