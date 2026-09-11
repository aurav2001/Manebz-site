import { getPool } from '../config/db.js';

// In-memory fallbacks
let fallbackServices = [];
let fallbackJobs = [];
let fallbackStats = [];
let fallbackMilestones = [];
let fallbackValues = [];
let fallbackCompliances = [];
let fallbackTestimonials = [];
let fallbackBlogs = [];
let fallbackNavItems = [];

// ==========================================
// 1. SERVICES CRUD
// ==========================================
export const getServices = async (req, res) => {
  try {
    const pool = getPool();
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM services ORDER BY id ASC');
      const services = rows.map(r => ({
        id: r.service_id,
        slug: r.slug,
        title: r.title,
        desc: r.desc_short,
        icon: r.icon,
        fullDesc: r.full_desc,
        deliverables: r.deliverables_json ? JSON.parse(r.deliverables_json) : [],
        technicalSpecs: r.tech_specs_json ? JSON.parse(r.tech_specs_json) : [],
        tags: r.tags_json ? JSON.parse(r.tags_json) : [],
        isActive: Boolean(r.is_active)
      }));
      return res.status(200).json({ success: true, count: services.length, data: services });
    }
    return res.status(200).json({ success: true, count: fallbackServices.length, data: fallbackServices });
  } catch (err) {
    console.error('Error fetching services:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const saveService = async (req, res) => {
  try {
    const { id, slug, title, desc, icon, fullDesc, deliverables, technicalSpecs, tags, isActive } = req.body;
    const serviceId = id || `srv-${Date.now()}`;
    const pool = getPool();

    if (pool) {
      const query = `
        INSERT INTO services (service_id, slug, title, desc_short, icon, full_desc, deliverables_json, tech_specs_json, tags_json, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          slug = VALUES(slug),
          title = VALUES(title),
          desc_short = VALUES(desc_short),
          icon = VALUES(icon),
          full_desc = VALUES(full_desc),
          deliverables_json = VALUES(deliverables_json),
          tech_specs_json = VALUES(tech_specs_json),
          tags_json = VALUES(tags_json),
          is_active = VALUES(is_active)
      `;
      await pool.execute(query, [
        serviceId,
        slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title,
        desc || '',
        icon || 'Building2',
        fullDesc || '',
        JSON.stringify(deliverables || []),
        JSON.stringify(technicalSpecs || []),
        JSON.stringify(tags || []),
        isActive !== false
      ]);
      return res.status(200).json({ success: true, message: 'Service saved in MySQL', data: { id: serviceId, ...req.body } });
    } else {
      const idx = fallbackServices.findIndex(s => s.id === serviceId);
      const obj = { id: serviceId, ...req.body };
      if (idx >= 0) fallbackServices[idx] = obj; else fallbackServices.push(obj);
      return res.status(200).json({ success: true, message: 'Service saved in fallback', data: obj });
    }
  } catch (err) {
    console.error('Error saving service:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    if (pool) {
      await pool.execute('DELETE FROM services WHERE service_id = ? OR slug = ?', [id, id]);
      return res.status(200).json({ success: true, message: 'Service deleted from MySQL' });
    }
    fallbackServices = fallbackServices.filter(s => s.id !== id && s.slug !== id);
    return res.status(200).json({ success: true, message: 'Service deleted from fallback' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 2. JOBS / CAREERS CRUD
// ==========================================
export const getJobs = async (req, res) => {
  try {
    const pool = getPool();
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM jobs ORDER BY id ASC');
      const jobs = rows.map(r => ({
        id: r.job_id,
        title: r.title,
        department: r.department,
        location: r.location,
        experience: r.experience,
        ctc: r.ctc_range,
        type: r.type,
        vacancies: r.vacancies,
        description: r.description,
        requirements: r.requirements_json ? JSON.parse(r.requirements_json) : [],
        isActive: Boolean(r.is_active)
      }));
      return res.status(200).json({ success: true, count: jobs.length, data: jobs });
    }
    return res.status(200).json({ success: true, count: fallbackJobs.length, data: fallbackJobs });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const saveJob = async (req, res) => {
  try {
    const { id, title, department, location, experience, ctc, type, vacancies, description, requirements, isActive } = req.body;
    const jobId = id || `job-${Date.now()}`;
    const pool = getPool();

    if (pool) {
      const query = `
        INSERT INTO jobs (job_id, title, department, location, experience, ctc_range, type, vacancies, description, requirements_json, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          title = VALUES(title),
          department = VALUES(department),
          location = VALUES(location),
          experience = VALUES(experience),
          ctc_range = VALUES(ctc_range),
          type = VALUES(type),
          vacancies = VALUES(vacancies),
          description = VALUES(description),
          requirements_json = VALUES(requirements_json),
          is_active = VALUES(is_active)
      `;
      await pool.execute(query, [
        jobId,
        title,
        department || 'Operations',
        location || 'Delhi NCR',
        experience || '1-3 Years',
        ctc || 'Industry Standard',
        type || 'Full-Time',
        vacancies || '05',
        description || '',
        JSON.stringify(requirements || []),
        isActive !== false
      ]);
      return res.status(200).json({ success: true, message: 'Job opening saved in MySQL', data: { id: jobId, ...req.body } });
    } else {
      const idx = fallbackJobs.findIndex(j => j.id === jobId);
      const obj = { id: jobId, ...req.body };
      if (idx >= 0) fallbackJobs[idx] = obj; else fallbackJobs.push(obj);
      return res.status(200).json({ success: true, message: 'Job saved in fallback', data: obj });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    if (pool) {
      await pool.execute('DELETE FROM jobs WHERE job_id = ?', [id]);
      return res.status(200).json({ success: true, message: 'Job deleted from MySQL' });
    }
    fallbackJobs = fallbackJobs.filter(j => j.id !== id);
    return res.status(200).json({ success: true, message: 'Job deleted from fallback' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 3. COMPANY STATS
// ==========================================
export const getStats = async (req, res) => {
  try {
    const pool = getPool();
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM company_stats ORDER BY order_num ASC, id ASC');
      return res.status(200).json({ success: true, data: rows });
    }
    return res.status(200).json({ success: true, data: fallbackStats });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const saveStats = async (req, res) => {
  try {
    const statsList = req.body;
    const pool = getPool();
    if (pool && Array.isArray(statsList)) {
      await pool.query('DELETE FROM company_stats');
      for (let i = 0; i < statsList.length; i++) {
        const s = statsList[i];
        await pool.execute(`
          INSERT INTO company_stats (stat_id, label, value, prefix, suffix, icon, order_num)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [s.id || `stat-${i}`, s.label, s.value, s.prefix || '', s.suffix || '', s.icon || 'TrendingUp', i]);
      }
      return res.status(200).json({ success: true, message: 'Stats synced to MySQL' });
    }
    fallbackStats = statsList;
    return res.status(200).json({ success: true, message: 'Stats saved in fallback' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 4. STATUTORY COMPLIANCES
// ==========================================
export const getCompliances = async (req, res) => {
  try {
    const pool = getPool();
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM statutory_compliances ORDER BY order_num ASC, id ASC');
      const compliances = rows.map(r => ({
        id: r.compliance_id,
        act: r.act_name,
        applicability: r.applicability,
        filingFrequency: r.filing_frequency,
        returnForm: r.return_form,
        penaltyRisk: r.penalty_risk,
        authority: r.authority
      }));
      return res.status(200).json({ success: true, data: compliances });
    }
    return res.status(200).json({ success: true, data: fallbackCompliances });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const saveCompliances = async (req, res) => {
  try {
    const compliances = req.body;
    const pool = getPool();
    if (pool && Array.isArray(compliances)) {
      await pool.query('DELETE FROM statutory_compliances');
      for (let i = 0; i < compliances.length; i++) {
        const c = compliances[i];
        await pool.execute(`
          INSERT INTO statutory_compliances (compliance_id, act_name, applicability, filing_frequency, return_form, penalty_risk, authority, order_num)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [c.id || `cmp-${i}`, c.act, c.applicability, c.filingFrequency, c.returnForm, c.penaltyRisk, c.authority, i]);
      }
      return res.status(200).json({ success: true, message: 'Compliances synced to MySQL' });
    }
    fallbackCompliances = compliances;
    return res.status(200).json({ success: true, message: 'Compliances saved in fallback' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 5. TESTIMONIALS
// ==========================================
export const getTestimonials = async (req, res) => {
  try {
    const pool = getPool();
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM testimonials ORDER BY created_at DESC');
      const testimonials = rows.map(r => ({
        id: r.testimonial_id,
        name: r.name,
        role: r.role,
        company: r.company,
        feedback: r.feedback,
        rating: r.rating,
        avatar: r.avatar
      }));
      return res.status(200).json({ success: true, data: testimonials });
    }
    return res.status(200).json({ success: true, data: fallbackTestimonials });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const saveTestimonials = async (req, res) => {
  try {
    const list = req.body;
    const pool = getPool();
    if (pool && Array.isArray(list)) {
      await pool.query('DELETE FROM testimonials');
      for (const t of list) {
        await pool.execute(`
          INSERT INTO testimonials (testimonial_id, name, role, company, feedback, rating, avatar)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [t.id || `t-${Date.now()}`, t.name, t.role, t.company, t.feedback, t.rating || 5, t.avatar || null]);
      }
      return res.status(200).json({ success: true, message: 'Testimonials synced to MySQL' });
    }
    fallbackTestimonials = list;
    return res.status(200).json({ success: true, message: 'Saved in fallback' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 6. BLOGS CRUD
// ==========================================
export const getBlogs = async (req, res) => {
  try {
    const pool = getPool();
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM blogs ORDER BY created_at DESC');
      const blogs = rows.map(r => ({
        id: r.blog_id,
        slug: r.slug,
        title: r.title,
        excerpt: r.excerpt,
        content: r.content,
        category: r.category,
        readTime: r.read_time,
        author: r.author,
        date: r.date_str,
        coverImage: r.cover_image
      }));
      return res.status(200).json({ success: true, count: blogs.length, data: blogs });
    }
    return res.status(200).json({ success: true, count: fallbackBlogs.length, data: fallbackBlogs });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const saveBlog = async (req, res) => {
  try {
    const { id, slug, title, excerpt, content, category, readTime, author, date, coverImage } = req.body;
    const blogId = id || `blog-${Date.now()}`;
    const pool = getPool();

    if (pool) {
      const query = `
        INSERT INTO blogs (blog_id, slug, title, excerpt, content, category, read_time, author, date_str, cover_image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          slug = VALUES(slug),
          title = VALUES(title),
          excerpt = VALUES(excerpt),
          content = VALUES(content),
          category = VALUES(category),
          read_time = VALUES(read_time),
          author = VALUES(author),
          date_str = VALUES(date_str),
          cover_image = VALUES(cover_image)
      `;
      await pool.execute(query, [
        blogId,
        slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title,
        excerpt || '',
        content || '',
        category || 'Facility Management',
        readTime || '5 min read',
        author || 'Editorial Team',
        date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        coverImage || null
      ]);
      return res.status(200).json({ success: true, message: 'Blog post saved in MySQL', data: { id: blogId, ...req.body } });
    } else {
      const idx = fallbackBlogs.findIndex(b => b.id === blogId);
      const obj = { id: blogId, ...req.body };
      if (idx >= 0) fallbackBlogs[idx] = obj; else fallbackBlogs.push(obj);
      return res.status(200).json({ success: true, message: 'Blog saved in fallback', data: obj });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    if (pool) {
      await pool.execute('DELETE FROM blogs WHERE blog_id = ? OR slug = ?', [id, id]);
      return res.status(200).json({ success: true, message: 'Blog post deleted from MySQL' });
    }
    fallbackBlogs = fallbackBlogs.filter(b => b.id !== id && b.slug !== id);
    return res.status(200).json({ success: true, message: 'Blog deleted from fallback' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 7. NAVIGATION MENU ITEMS
// ==========================================
export const getNavItems = async (req, res) => {
  try {
    const pool = getPool();
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM nav_items ORDER BY order_num ASC, id ASC');
      const items = rows.map(r => ({
        id: r.nav_id,
        label: r.label,
        path: r.path,
        type: r.type,
        isVisible: Boolean(r.is_visible),
        isHot: Boolean(r.is_hot),
        order: r.order_num
      }));
      return res.status(200).json({ success: true, data: items });
    }
    return res.status(200).json({ success: true, data: fallbackNavItems });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const saveNavItems = async (req, res) => {
  try {
    const navList = req.body;
    const pool = getPool();
    if (pool && Array.isArray(navList)) {
      await pool.query('DELETE FROM nav_items');
      for (let i = 0; i < navList.length; i++) {
        const n = navList[i];
        await pool.execute(`
          INSERT INTO nav_items (nav_id, label, path, type, is_visible, is_hot, order_num)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [n.id || `nav-${i}`, n.label, n.path, n.type || 'internal', n.isVisible !== false, Boolean(n.isHot), i + 1]);
      }
      return res.status(200).json({ success: true, message: 'Nav items synced to MySQL' });
    }
    fallbackNavItems = navList;
    return res.status(200).json({ success: true, message: 'Saved in fallback' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
