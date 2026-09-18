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
  getMilestones,
  saveMilestones,
  getCoreValues,
  saveCoreValues,
  getCompliances,
  saveCompliances,
  getTestimonials,
  saveTestimonials,
  getBlogs,
  saveBlog,
  deleteBlog,
  getNavItems,
  saveNavItems,
  getSection,
  saveSection
} from '../controllers/contentController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

// Website content is an admin job. Job openings are HR's, per the agreed roles.
const adminOnly = [requireAuth, requireRole('admin')];
const hiringStaff = [requireAuth, requireRole('admin', 'hr')];

const router = express.Router();

// Reads stay public throughout this file — the website itself renders from them.
// Every write is admin-only.

// Services
router.route('/services').get(getServices).post(adminOnly, saveService);
router.route('/services/:id').delete(adminOnly, deleteService);

// Jobs
router.route('/jobs').get(getJobs).post(hiringStaff, saveJob);
router.route('/jobs/:id').delete(hiringStaff, deleteJob);

// Company Stats
router.route('/stats').get(getStats).post(adminOnly, saveStats);

// Milestones
router.route('/milestones').get(getMilestones).post(adminOnly, saveMilestones);

// Core Values
router.route('/values').get(getCoreValues).post(adminOnly, saveCoreValues);

// Statutory Compliances
router.route('/compliances').get(getCompliances).post(adminOnly, saveCompliances);

// Testimonials
router.route('/testimonials').get(getTestimonials).post(adminOnly, saveTestimonials);

// Blogs
router.route('/blogs').get(getBlogs).post(adminOnly, saveBlog);
router.route('/blogs/:id').delete(adminOnly, deleteBlog);

// Navigation Items
router.route('/nav').get(getNavItems).post(adminOnly, saveNavItems);

// Editable page sections, e.g. /content/sections/home
router.route('/sections/:key').get(getSection).post(adminOnly, saveSection);

export default router;
