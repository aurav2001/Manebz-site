-- ==============================================================================
-- MANABS / MANEBZ Enterprise Portal Master Database Schema
-- Database: manabs_db
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `manabs_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `manabs_db`;

-- ------------------------------------------------------------------------------
-- 1. Services Table (Admin CMS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `service_id` VARCHAR(64) UNIQUE NOT NULL,
  `slug` VARCHAR(150) UNIQUE NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `desc_short` TEXT NOT NULL,
  `icon` VARCHAR(64) DEFAULT 'Building2',
  `full_desc` LONGTEXT DEFAULT NULL,
  `deliverables_json` LONGTEXT DEFAULT NULL,
  `tech_specs_json` LONGTEXT DEFAULT NULL,
  `tags_json` LONGTEXT DEFAULT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 2. Job Openings / Careers Table (Admin CMS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `job_id` VARCHAR(64) UNIQUE NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `department` VARCHAR(100) NOT NULL,
  `location` VARCHAR(100) DEFAULT 'Delhi NCR',
  `experience` VARCHAR(100) DEFAULT '1-3 Years',
  `ctc_range` VARCHAR(100) DEFAULT 'Industry Standard',
  `type` VARCHAR(50) DEFAULT 'Full-Time',
  `vacancies` VARCHAR(20) DEFAULT '05',
  `description` TEXT DEFAULT NULL,
  `requirements_json` LONGTEXT DEFAULT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 3. Company Stats & Counters Table (Admin CMS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `company_stats` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `stat_id` VARCHAR(64) UNIQUE NOT NULL,
  `label` VARCHAR(150) NOT NULL,
  `value` VARCHAR(50) NOT NULL,
  `prefix` VARCHAR(20) DEFAULT '',
  `suffix` VARCHAR(20) DEFAULT '+',
  `icon` VARCHAR(64) DEFAULT 'TrendingUp',
  `order_num` INT DEFAULT 0,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 4. Milestones Table (Admin CMS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `milestones` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `milestone_id` VARCHAR(64) UNIQUE NOT NULL,
  `year` VARCHAR(20) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `icon` VARCHAR(64) DEFAULT 'Award',
  `order_num` INT DEFAULT 0,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 5. Core Values Table (Admin CMS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `core_values` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `value_id` VARCHAR(64) UNIQUE NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `icon` VARCHAR(64) DEFAULT 'Shield',
  `order_num` INT DEFAULT 0,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 6. Statutory Compliances Table (Admin CMS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `statutory_compliances` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `compliance_id` VARCHAR(64) UNIQUE NOT NULL,
  `act_name` VARCHAR(255) NOT NULL,
  `applicability` VARCHAR(255) NOT NULL,
  `filing_frequency` VARCHAR(100) NOT NULL,
  `return_form` VARCHAR(150) NOT NULL,
  `penalty_risk` VARCHAR(255) NOT NULL,
  `authority` VARCHAR(255) NOT NULL,
  `order_num` INT DEFAULT 0,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 7. Testimonials Table (Admin CMS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `testimonial_id` VARCHAR(64) UNIQUE NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `role` VARCHAR(150) NOT NULL,
  `company` VARCHAR(255) NOT NULL,
  `feedback` TEXT NOT NULL,
  `rating` INT DEFAULT 5,
  `avatar` VARCHAR(500) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 8. Blog Posts Table (Admin CMS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `blogs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `blog_id` VARCHAR(64) UNIQUE NOT NULL,
  `slug` VARCHAR(150) UNIQUE NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `excerpt` TEXT NOT NULL,
  `content` LONGTEXT NOT NULL,
  `category` VARCHAR(100) DEFAULT 'Facility Management',
  `read_time` VARCHAR(50) DEFAULT '5 min read',
  `author` VARCHAR(150) DEFAULT 'Editorial Team',
  `date_str` VARCHAR(50) DEFAULT NULL,
  `cover_image` VARCHAR(500) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 9. Navigation Menu Items (Admin CMS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `nav_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nav_id` VARCHAR(64) UNIQUE NOT NULL,
  `label` VARCHAR(100) NOT NULL,
  `path` VARCHAR(255) NOT NULL,
  `type` VARCHAR(50) DEFAULT 'internal',
  `is_visible` BOOLEAN DEFAULT TRUE,
  `is_hot` BOOLEAN DEFAULT FALSE,
  `order_num` INT DEFAULT 1,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 10. Custom CMS Pages Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `custom_pages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `page_id` VARCHAR(64) UNIQUE NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(150) UNIQUE NOT NULL,
  `subtitle` TEXT DEFAULT NULL,
  `badge` VARCHAR(100) DEFAULT NULL,
  `content_json` LONGTEXT DEFAULT NULL,
  `show_in_navbar` BOOLEAN DEFAULT TRUE,
  `is_published` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 11. Proposal Inquiries & Quotes Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `inquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `inquiry_id` VARCHAR(64) UNIQUE NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `service` VARCHAR(150) DEFAULT 'HR STAFFING & PAYROLL MANAGEMENT',
  `message` TEXT DEFAULT NULL,
  `source` VARCHAR(100) DEFAULT 'Website Modal',
  `status` ENUM('New Lead', 'In Discussion', 'Site Inspection Scheduled', 'Proposal Sent', 'Contract Signed', 'Lost / Closed') DEFAULT 'New Lead',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_phone (`phone`),
  INDEX idx_status (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 12. Candidate Job Applications Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `job_applications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `application_id` VARCHAR(64) UNIQUE NOT NULL,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `job_id` VARCHAR(64) DEFAULT NULL,
  `job_title` VARCHAR(150) NOT NULL,
  `department` VARCHAR(100) DEFAULT 'Operations',
  `experience` VARCHAR(50) DEFAULT NULL,
  `location` VARCHAR(100) DEFAULT 'Delhi NCR',
  `qualification` VARCHAR(100) DEFAULT NULL,
  `current_ctc` VARCHAR(50) DEFAULT NULL,
  `expected_ctc` VARCHAR(50) DEFAULT NULL,
  `resume_url` VARCHAR(500) DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `status` ENUM('Under Review', 'Screened', 'Interview Scheduled', 'Selected', 'Rejected') DEFAULT 'Under Review',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_job_title (`job_title`),
  INDEX idx_phone (`phone`),
  INDEX idx_status (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 13. Contact Messages Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `subject` VARCHAR(255) DEFAULT NULL,
  `message` TEXT NOT NULL,
  `is_read` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 14. Admin Global Settings Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admin_settings` (
  `setting_key` VARCHAR(100) PRIMARY KEY,
  `setting_value` LONGTEXT DEFAULT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
