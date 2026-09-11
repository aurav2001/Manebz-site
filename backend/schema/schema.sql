-- ==============================================================================
-- MANABS / MANEBZ Enterprise Portal Database Schema
-- Database: manabs_db
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `manabs_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `manabs_db`;

-- ------------------------------------------------------------------------------
-- 1. Inquiries & Proposal Requests Table
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
  INDEX idx_status (`status`),
  INDEX idx_created_at (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 2. Job Applications Table
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
-- 3. Contact Messages Table
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
-- 4. Custom CMS Pages Table
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
-- 5. Admin Global Settings Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admin_settings` (
  `setting_key` VARCHAR(100) PRIMARY KEY,
  `setting_value` LONGTEXT DEFAULT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
