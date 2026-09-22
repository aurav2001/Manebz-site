import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Load .env from cwd, and also from the backend root when running as ESM source.
// In the esbuild CJS bundle import.meta.url is undefined, and there the .env sits
// next to app.js in cwd anyway.
dotenv.config();
if (import.meta.url) {
  dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env') });
}

const {
  DB_HOST = 'localhost',
  DB_PORT = 3306,
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'manabs_db'
} = process.env;

let pool = null;
let lastDbError = null;

export const initDB = async () => {
  try {
    // 1. Try connecting directly to target DB
    try {
      pool = mysql.createPool({
        host: DB_HOST,
        port: Number(DB_PORT),
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000
      });
      await pool.query('SELECT 1');
    } catch (connErr) {
      // If DB missing (e.g. local development), attempt to create it
      if (connErr.code === 'ER_BAD_DB_ERROR') {
        const initConn = await mysql.createConnection({
          host: DB_HOST,
          port: Number(DB_PORT),
          user: DB_USER,
          password: DB_PASSWORD
        });
        await initConn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        await initConn.end();
      } else {
        throw connErr;
      }
    }

    console.log(`✅ [MySQL] Connected to Database: ${DB_NAME} on ${DB_HOST}:${DB_PORT}`);

    // 3. Create all tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        service_id VARCHAR(64) UNIQUE NOT NULL,
        slug VARCHAR(150) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        desc_short TEXT NOT NULL,
        icon VARCHAR(64) DEFAULT 'Building2',
        full_desc LONGTEXT DEFAULT NULL,
        deliverables_json LONGTEXT DEFAULT NULL,
        tech_specs_json LONGTEXT DEFAULT NULL,
        tags_json LONGTEXT DEFAULT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_slug (slug)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        job_id VARCHAR(64) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        department VARCHAR(100) NOT NULL,
        location VARCHAR(100) DEFAULT 'Delhi NCR',
        experience VARCHAR(100) DEFAULT '1-3 Years',
        ctc_range VARCHAR(100) DEFAULT 'Industry Standard',
        type VARCHAR(50) DEFAULT 'Full-Time',
        vacancies VARCHAR(20) DEFAULT '05',
        description TEXT DEFAULT NULL,
        requirements_json LONGTEXT DEFAULT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS company_stats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        stat_id VARCHAR(64) UNIQUE NOT NULL,
        label VARCHAR(150) NOT NULL,
        value VARCHAR(50) NOT NULL,
        prefix VARCHAR(20) DEFAULT '',
        suffix VARCHAR(20) DEFAULT '+',
        icon VARCHAR(64) DEFAULT 'TrendingUp',
        order_num INT DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS milestones (
        id INT AUTO_INCREMENT PRIMARY KEY,
        milestone_id VARCHAR(64) UNIQUE NOT NULL,
        year VARCHAR(20) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        icon VARCHAR(64) DEFAULT 'Award',
        order_num INT DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS core_values (
        id INT AUTO_INCREMENT PRIMARY KEY,
        value_id VARCHAR(64) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        icon VARCHAR(64) DEFAULT 'Shield',
        order_num INT DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS statutory_compliances (
        id INT AUTO_INCREMENT PRIMARY KEY,
        compliance_id VARCHAR(64) UNIQUE NOT NULL,
        act_name VARCHAR(255) NOT NULL,
        applicability VARCHAR(255) NOT NULL,
        filing_frequency VARCHAR(100) NOT NULL,
        return_form VARCHAR(150) NOT NULL,
        penalty_risk VARCHAR(255) NOT NULL,
        authority VARCHAR(255) NOT NULL,
        order_num INT DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        testimonial_id VARCHAR(64) UNIQUE NOT NULL,
        name VARCHAR(150) NOT NULL,
        role VARCHAR(150) NOT NULL,
        company VARCHAR(255) NOT NULL,
        feedback TEXT NOT NULL,
        rating INT DEFAULT 5,
        avatar VARCHAR(500) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        blog_id VARCHAR(64) UNIQUE NOT NULL,
        slug VARCHAR(150) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        excerpt TEXT NOT NULL,
        content LONGTEXT NOT NULL,
        category VARCHAR(100) DEFAULT 'Facility Management',
        read_time VARCHAR(50) DEFAULT '5 min read',
        author VARCHAR(150) DEFAULT 'Editorial Team',
        date_str VARCHAR(50) DEFAULT NULL,
        cover_image VARCHAR(500) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_slug (slug)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS nav_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nav_id VARCHAR(64) UNIQUE NOT NULL,
        label VARCHAR(100) NOT NULL,
        path VARCHAR(255) NOT NULL,
        type VARCHAR(50) DEFAULT 'internal',
        is_visible BOOLEAN DEFAULT TRUE,
        is_hot BOOLEAN DEFAULT FALSE,
        order_num INT DEFAULT 1,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS custom_pages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page_id VARCHAR(64) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(150) UNIQUE NOT NULL,
        subtitle TEXT DEFAULT NULL,
        badge VARCHAR(100) DEFAULT NULL,
        content_json LONGTEXT DEFAULT NULL,
        show_in_navbar BOOLEAN DEFAULT TRUE,
        is_published BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_slug (slug)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        inquiry_id VARCHAR(64) UNIQUE NOT NULL,
        name VARCHAR(150) NOT NULL,
        phone VARCHAR(30) NOT NULL,
        email VARCHAR(150) DEFAULT NULL,
        service VARCHAR(150) DEFAULT 'HR STAFFING & PAYROLL MANAGEMENT',
        message TEXT DEFAULT NULL,
        source VARCHAR(100) DEFAULT 'Website Modal',
        status ENUM('New Lead', 'In Discussion', 'Site Inspection Scheduled', 'Proposal Sent', 'Contract Signed', 'Lost / Closed') DEFAULT 'New Lead',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_phone (phone),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS job_applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        application_id VARCHAR(64) UNIQUE NOT NULL,
        full_name VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL,
        phone VARCHAR(30) NOT NULL,
        job_id VARCHAR(64) DEFAULT NULL,
        job_title VARCHAR(150) NOT NULL,
        department VARCHAR(100) DEFAULT 'Operations',
        experience VARCHAR(50) DEFAULT NULL,
        location VARCHAR(100) DEFAULT 'Delhi NCR',
        qualification VARCHAR(100) DEFAULT NULL,
        current_ctc VARCHAR(50) DEFAULT NULL,
        expected_ctc VARCHAR(50) DEFAULT NULL,
        resume_url VARCHAR(500) DEFAULT NULL,
        notes TEXT DEFAULT NULL,
        status ENUM('Under Review', 'Screened', 'Interview Scheduled', 'Selected', 'Rejected') DEFAULT 'Under Review',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_job_title (job_title),
        INDEX idx_phone (phone),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL,
        phone VARCHAR(30) NOT NULL,
        subject VARCHAR(255) DEFAULT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Panel logins. Passwords are stored as scrypt hashes, never in plain text.
    await pool.query(`
      CREATE TABLE IF NOT EXISTS panel_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(64) UNIQUE NOT NULL,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(190) UNIQUE NOT NULL,
        phone VARCHAR(30) DEFAULT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('admin', 'hr', 'recruiter') NOT NULL DEFAULT 'recruiter',
        is_active BOOLEAN DEFAULT TRUE,
        must_change_password BOOLEAN DEFAULT FALSE,
        created_by VARCHAR(64) DEFAULT NULL,
        last_login_at TIMESTAMP NULL DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_role (role),
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Serves both reset paths: a token for the emailed link, and a pending row an
    // admin or HR can action by hand when no mail service is configured.
    await pool.query(`
      CREATE TABLE IF NOT EXISTS password_resets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        request_id VARCHAR(64) UNIQUE NOT NULL,
        user_id VARCHAR(64) DEFAULT NULL,
        email VARCHAR(190) NOT NULL,
        token_hash VARCHAR(255) DEFAULT NULL,
        expires_at TIMESTAMP NULL DEFAULT NULL,
        status ENUM('pending', 'emailed', 'completed', 'cancelled') DEFAULT 'pending',
        handled_by VARCHAR(64) DEFAULT NULL,
        handled_at TIMESTAMP NULL DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_email_reset (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Client companies a recruiter sources for. Employee records point at these so the
    // panel can answer "who did we find for which company".
    await pool.query(`
      CREATE TABLE IF NOT EXISTS client_companies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        company_id VARCHAR(64) UNIQUE NOT NULL,
        name VARCHAR(190) NOT NULL,
        name_key VARCHAR(190) UNIQUE NOT NULL,
        location VARCHAR(190) DEFAULT NULL,
        contact_person VARCHAR(150) DEFAULT NULL,
        phone VARCHAR(30) DEFAULT NULL,
        email VARCHAR(190) DEFAULT NULL,
        industry VARCHAR(120) DEFAULT NULL,
        notes TEXT DEFAULT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        added_by VARCHAR(64) DEFAULT NULL,
        added_by_name VARCHAR(150) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_company_name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // People a recruiter has placed or processed. created_at is the "when was this
    // added" stamp the dashboards show.
    await pool.query(`
      CREATE TABLE IF NOT EXISTS employee_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        record_id VARCHAR(64) UNIQUE NOT NULL,
        full_name VARCHAR(150) NOT NULL,
        age VARCHAR(10) DEFAULT NULL,
        qualification VARCHAR(190) DEFAULT NULL,
        location VARCHAR(190) DEFAULT NULL,
        phone VARCHAR(30) NOT NULL,
        email VARCHAR(190) DEFAULT NULL,
        designation VARCHAR(190) DEFAULT NULL,
        client_site VARCHAR(190) DEFAULT NULL,
        status VARCHAR(60) DEFAULT 'Placed',
        notes TEXT DEFAULT NULL,
        added_by VARCHAR(64) DEFAULT NULL,
        added_by_name VARCHAR(150) DEFAULT NULL,
        data_json LONGTEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_added_by (added_by),
        INDEX idx_created (created_at),
        INDEX idx_phone_emp (phone)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Staffing requirements raised by client companies — from the website form or
    // entered by Admin/HR after a phone call. Placements link back via request_id so
    // "3 of 5 filled" comes straight from the employee records.
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hiring_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        request_id VARCHAR(64) UNIQUE NOT NULL,
        company_id VARCHAR(64) DEFAULT NULL,
        company_name VARCHAR(190) NOT NULL,
        contact_person VARCHAR(150) DEFAULT NULL,
        phone VARCHAR(30) NOT NULL,
        email VARCHAR(190) DEFAULT NULL,
        role_title VARCHAR(190) NOT NULL,
        headcount INT DEFAULT 1,
        location VARCHAR(190) DEFAULT NULL,
        experience VARCHAR(100) DEFAULT NULL,
        salary_range VARCHAR(100) DEFAULT NULL,
        start_date VARCHAR(60) DEFAULT NULL,
        urgency ENUM('Standard', 'Urgent', 'Immediate') DEFAULT 'Standard',
        notes TEXT DEFAULT NULL,
        status ENUM('New', 'Assigned', 'In Progress', 'Fulfilled', 'Closed') DEFAULT 'New',
        assigned_to VARCHAR(64) DEFAULT NULL,
        assigned_to_name VARCHAR(150) DEFAULT NULL,
        source ENUM('website', 'panel') DEFAULT 'website',
        created_by VARCHAR(64) DEFAULT NULL,
        created_by_name VARCHAR(150) DEFAULT NULL,
        data_json LONGTEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_hr_status (status),
        INDEX idx_hr_company (company_id),
        INDEX idx_hr_assigned (assigned_to)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Editable page sections (hero slides, headings, banner copy). Keyed by page so the
    // same mechanism covers the home page today and any other page later.
    await pool.query(`
      CREATE TABLE IF NOT EXISTS site_sections (
        section_key VARCHAR(100) PRIMARY KEY,
        data_json LONGTEXT DEFAULT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_settings (
        setting_key VARCHAR(100) PRIMARY KEY,
        setting_value LONGTEXT DEFAULT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // The admin panel edits many more fields than the mapped columns hold — a service
    // carries features/faqs/workflow, a job carries responsibilities/skills/salary, a
    // testimonial carries quote/metric. Keep the complete object next to the columns so
    // a save never silently drops whatever the panel showed.
    const ensureColumn = async (table, column, definition) => {
      const [rows] = await pool.query(
        `SELECT COUNT(*) AS n FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
        [table, column]
      );
      if (rows[0].n === 0) {
        await pool.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
        console.log(`🔧 [MySQL] Added column ${table}.${column}`);
      }
    };

    const contentTables = [
      'services', 'jobs', 'company_stats', 'milestones', 'core_values',
      'statutory_compliances', 'testimonials', 'blogs', 'nav_items', 'custom_pages'
    ];
    for (const table of contentTables) {
      // A missing ALTER privilege must not take the whole API down — the mapped columns
      // still work without data_json, only the extra admin fields are lost.
      try {
        await ensureColumn(table, 'data_json', 'LONGTEXT DEFAULT NULL');
      } catch (alterErr) {
        console.warn(`⚠️ [MySQL] Could not add ${table}.data_json: ${alterErr.message}`);
      }
    }

    // Links a placement to the client it was sourced for. Added separately because the
    // employee table already exists on deployments made before companies were a thing.
    try {
      await ensureColumn('employee_records', 'company_id', 'VARCHAR(64) DEFAULT NULL');
      await ensureColumn('employee_records', 'company_name', 'VARCHAR(190) DEFAULT NULL');
      // Ties a placement to the requirement it fills, which is what drives the
      // "filled / headcount" progress on each hiring request.
      await ensureColumn('employee_records', 'request_id', 'VARCHAR(64) DEFAULT NULL');
    } catch (alterErr) {
      console.warn(`⚠️ [MySQL] Could not add employee_records company columns: ${alterErr.message}`);
    }

    console.log('✅ [MySQL] All 14 tables verified & active in MySQL.');
    return pool;
  } catch (error) {
    // Drop the half-built pool. It was assigned before the connectivity check ran,
    // so leaving it in place makes getPool() truthy and every request 500s on a dead
    // connection instead of taking the in-memory fallback path.
    if (pool) {
      try {
        await pool.end();
      } catch {
        // Pool was never usable; nothing to close cleanly.
      }
      pool = null;
    }
    lastDbError = error.message || error.code || String(error);
    console.error('❌ [MySQL] Database Connection Failed:', lastDbError);
    console.warn('⚠️ Server will run in Fallback Mode. Ensure MySQL is started or check backend/.env');
    return null;
  }
};

export const getPool = () => pool;
export const getDbDiagnosticInfo = () => ({
  error: lastDbError,
  config: {
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    database: DB_NAME,
    hasPassword: Boolean(DB_PASSWORD && DB_PASSWORD.length > 0)
  }
});

export default {
  initDB,
  getPool,
  getDbDiagnosticInfo
};
