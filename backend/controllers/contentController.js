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
// HELPERS
// ==========================================

// mysql2 throws "Bind parameters must not contain undefined" — never let one through.
const val = (v, fallback = null) => (v === undefined || v === null ? fallback : v);

// Unique even when several rows are written inside the same millisecond.
const uid = (prefix, i) => `${prefix}-${Date.now()}-${i}`;

const slugify = (text) => String(text)
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+/, '')
  .replace(/-+$/, '');

const missingField = (res, field) =>
  res.status(400).json({ success: false, message: `${field} is required` });

/**
 * The mapped columns cover only a fraction of what the admin panel edits, so the full
 * payload rides along in data_json. `packed` writes it; `unpack` layers it back over the
 * mapped row, keeping the row's own id authoritative.
 */
const packed = (obj) => JSON.stringify(obj ?? {});

const unpack = (row, mapped) => {
  if (!row.data_json) return mapped;
  try {
    return { ...mapped, ...JSON.parse(row.data_json), id: mapped.id };
  } catch {
    return mapped;
  }
};

/**
 * Replace the full contents of a table inside a transaction.
 * Without this, a single bad row left the table empty: the DELETE had already
 * committed while the INSERT loop blew up half way through.
 */
const replaceAll = async (pool, table, rows, sql, buildParams) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query(`DELETE FROM ${table}`);
    for (let i = 0; i < rows.length; i++) {
      await conn.execute(sql, buildParams(rows[i], i));
    }
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

// ==========================================
// 1. SERVICES CRUD
// ==========================================
export const getServices = async (req, res) => {
  try {
    const pool = getPool();
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM services ORDER BY id ASC');
      const services = rows.map(r => unpack(r, {
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
    if (!title || !String(title).trim()) return missingField(res, 'Title');

    const serviceId = id || uid('srv', 0);
    const pool = getPool();

    if (pool) {
      const query = `
        INSERT INTO services (service_id, slug, title, desc_short, icon, full_desc, deliverables_json, tech_specs_json, tags_json, is_active, data_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          slug = VALUES(slug),
          title = VALUES(title),
          desc_short = VALUES(desc_short),
          icon = VALUES(icon),
          full_desc = VALUES(full_desc),
          deliverables_json = VALUES(deliverables_json),
          tech_specs_json = VALUES(tech_specs_json),
          tags_json = VALUES(tags_json),
          is_active = VALUES(is_active),
          data_json = VALUES(data_json)
      `;
      await pool.execute(query, [
        String(serviceId),
        slug ? slugify(slug) : slugify(title),
        String(title).trim(),
        val(desc, ''),
        val(icon, 'Building2'),
        val(fullDesc, ''),
        JSON.stringify(deliverables || []),
        JSON.stringify(technicalSpecs || []),
        JSON.stringify(tags || []),
        isActive !== false,
        packed({ ...req.body, id: serviceId })
      ]);
      return res.status(200).json({ success: true, message: 'Service saved in MySQL', data: { ...req.body, id: serviceId } });
    } else {
      const idx = fallbackServices.findIndex(s => s.id === serviceId);
      const obj = { ...req.body, id: serviceId };
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
    console.error('Error deleting service:', err);
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
      const jobs = rows.map(r => unpack(r, {
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
    console.error('Error fetching jobs:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const saveJob = async (req, res) => {
  try {
    const { id, title, department, location, experience, ctc, type, vacancies, description, requirements, isActive } = req.body;
    if (!title || !String(title).trim()) return missingField(res, 'Job title');

    const jobId = id || uid('job', 0);
    const pool = getPool();

    if (pool) {
      const query = `
        INSERT INTO jobs (job_id, title, department, location, experience, ctc_range, type, vacancies, description, requirements_json, is_active, data_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
          is_active = VALUES(is_active),
          data_json = VALUES(data_json)
      `;
      await pool.execute(query, [
        String(jobId),
        String(title).trim(),
        val(department, 'Operations'),
        val(location, 'Delhi NCR'),
        val(experience, '1-3 Years'),
        // The panel calls these salary / openingsCount; accept either spelling.
        val(ctc ?? req.body.salary, 'Industry Standard'),
        val(type, 'Full-Time'),
        String(val(vacancies ?? req.body.openingsCount, '05')),
        val(description, ''),
        JSON.stringify(requirements || req.body.responsibilities || []),
        isActive !== false,
        packed({ ...req.body, id: jobId })
      ]);
      return res.status(200).json({ success: true, message: 'Job opening saved in MySQL', data: { ...req.body, id: jobId } });
    } else {
      const idx = fallbackJobs.findIndex(j => j.id === jobId);
      const obj = { ...req.body, id: jobId };
      if (idx >= 0) fallbackJobs[idx] = obj; else fallbackJobs.push(obj);
      return res.status(200).json({ success: true, message: 'Job saved in fallback', data: obj });
    }
  } catch (err) {
    console.error('Error saving job:', err);
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
    console.error('Error deleting job:', err);
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
      const stats = rows.map(r => unpack(r, {
        id: r.stat_id,
        label: r.label,
        value: r.value,
        prefix: r.prefix,
        suffix: r.suffix,
        icon: r.icon,
        order: r.order_num
      }));
      return res.status(200).json({ success: true, data: stats });
    }
    return res.status(200).json({ success: true, data: fallbackStats });
  } catch (err) {
    console.error('Error fetching stats:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const saveStats = async (req, res) => {
  try {
    const statsList = req.body;
    if (!Array.isArray(statsList)) {
      return res.status(400).json({ success: false, message: 'Expected an array of stats' });
    }
    const pool = getPool();
    if (pool) {
      await replaceAll(
        pool,
        'company_stats',
        statsList,
        `INSERT INTO company_stats (stat_id, label, value, prefix, suffix, icon, order_num, data_json)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        (s, i) => [
          String(val(s.id, uid('stat', i))),
          val(s.label, ''),
          String(val(s.value, '')),
          val(s.prefix, ''),
          val(s.suffix, ''),
          val(s.icon, 'TrendingUp'),
          i,
          packed(s)
        ]
      );
      return res.status(200).json({ success: true, message: 'Stats synced to MySQL' });
    }
    fallbackStats = statsList;
    return res.status(200).json({ success: true, message: 'Stats saved in fallback' });
  } catch (err) {
    console.error('Error saving stats:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 4. MILESTONES
// ==========================================
export const getMilestones = async (req, res) => {
  try {
    const pool = getPool();
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM milestones ORDER BY order_num ASC, id ASC');
      const milestones = rows.map(r => unpack(r, {
        id: r.milestone_id,
        year: r.year,
        title: r.title,
        description: r.description,
        icon: r.icon
      }));
      return res.status(200).json({ success: true, data: milestones });
    }
    return res.status(200).json({ success: true, data: fallbackMilestones });
  } catch (err) {
    console.error('Error fetching milestones:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const saveMilestones = async (req, res) => {
  try {
    const list = req.body;
    if (!Array.isArray(list)) {
      return res.status(400).json({ success: false, message: 'Expected an array of milestones' });
    }
    const pool = getPool();
    if (pool) {
      await replaceAll(
        pool,
        'milestones',
        list,
        `INSERT INTO milestones (milestone_id, year, title, description, icon, order_num, data_json)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        (m, i) => [
          String(val(m.id, uid('ms', i))),
          String(val(m.year, '')),
          val(m.title, ''),
          val(m.description, ''),
          val(m.icon, 'Award'),
          i,
          packed(m)
        ]
      );
      return res.status(200).json({ success: true, message: 'Milestones synced to MySQL' });
    }
    fallbackMilestones = list;
    return res.status(200).json({ success: true, message: 'Milestones saved in fallback' });
  } catch (err) {
    console.error('Error saving milestones:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 5. CORE VALUES
// ==========================================
export const getCoreValues = async (req, res) => {
  try {
    const pool = getPool();
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM core_values ORDER BY order_num ASC, id ASC');
      const values = rows.map(r => unpack(r, {
        id: r.value_id,
        title: r.title,
        description: r.description,
        icon: r.icon
      }));
      return res.status(200).json({ success: true, data: values });
    }
    return res.status(200).json({ success: true, data: fallbackValues });
  } catch (err) {
    console.error('Error fetching core values:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const saveCoreValues = async (req, res) => {
  try {
    const list = req.body;
    if (!Array.isArray(list)) {
      return res.status(400).json({ success: false, message: 'Expected an array of core values' });
    }
    const pool = getPool();
    if (pool) {
      await replaceAll(
        pool,
        'core_values',
        list,
        `INSERT INTO core_values (value_id, title, description, icon, order_num, data_json)
         VALUES (?, ?, ?, ?, ?, ?)`,
        (v, i) => [
          String(val(v.id, uid('val', i))),
          val(v.title, ''),
          val(v.description, ''),
          val(v.icon, 'Shield'),
          i,
          packed(v)
        ]
      );
      return res.status(200).json({ success: true, message: 'Core values synced to MySQL' });
    }
    fallbackValues = list;
    return res.status(200).json({ success: true, message: 'Core values saved in fallback' });
  } catch (err) {
    console.error('Error saving core values:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 6. STATUTORY COMPLIANCES
// ==========================================
export const getCompliances = async (req, res) => {
  try {
    const pool = getPool();
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM statutory_compliances ORDER BY order_num ASC, id ASC');
      const compliances = rows.map(r => unpack(r, {
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
    console.error('Error fetching compliances:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const saveCompliances = async (req, res) => {
  try {
    const compliances = req.body;
    if (!Array.isArray(compliances)) {
      return res.status(400).json({ success: false, message: 'Expected an array of compliances' });
    }
    const pool = getPool();
    if (pool) {
      await replaceAll(
        pool,
        'statutory_compliances',
        compliances,
        `INSERT INTO statutory_compliances (compliance_id, act_name, applicability, filing_frequency, return_form, penalty_risk, authority, order_num, data_json)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        // The panel's compliance cards are {title, desc, code}; the older columns use
        // act/applicability/authority. Accept both so neither shape is lost.
        (c, i) => [
          String(val(c.id, uid('cmp', i))),
          val(c.act ?? c.title, ''),
          val(c.applicability ?? c.desc, ''),
          val(c.filingFrequency, ''),
          val(c.returnForm, ''),
          val(c.penaltyRisk, ''),
          val(c.authority ?? c.code, ''),
          i,
          packed(c)
        ]
      );
      return res.status(200).json({ success: true, message: 'Compliances synced to MySQL' });
    }
    fallbackCompliances = compliances;
    return res.status(200).json({ success: true, message: 'Compliances saved in fallback' });
  } catch (err) {
    console.error('Error saving compliances:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 7. TESTIMONIALS
// ==========================================
export const getTestimonials = async (req, res) => {
  try {
    const pool = getPool();
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM testimonials ORDER BY id ASC');
      const testimonials = rows.map(r => unpack(r, {
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
    console.error('Error fetching testimonials:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const saveTestimonials = async (req, res) => {
  try {
    const list = req.body;
    if (!Array.isArray(list)) {
      return res.status(400).json({ success: false, message: 'Expected an array of testimonials' });
    }
    const pool = getPool();
    if (pool) {
      await replaceAll(
        pool,
        'testimonials',
        list,
        `INSERT INTO testimonials (testimonial_id, name, role, company, feedback, rating, avatar, data_json)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        // The panel calls these clientName / designation / quote; accept either spelling.
        (t, i) => [
          String(val(t.id, uid('t', i))),
          val(t.name ?? t.clientName, ''),
          val(t.role ?? t.designation, ''),
          val(t.company, ''),
          val(t.feedback ?? t.quote, ''),
          Number(t.rating) || 5,
          val(t.avatar ?? t.image, null),
          packed(t)
        ]
      );
      return res.status(200).json({ success: true, message: 'Testimonials synced to MySQL' });
    }
    fallbackTestimonials = list;
    return res.status(200).json({ success: true, message: 'Saved in fallback' });
  } catch (err) {
    console.error('Error saving testimonials:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 8. BLOGS CRUD
// ==========================================
export const getBlogs = async (req, res) => {
  try {
    const pool = getPool();
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM blogs ORDER BY created_at DESC');
      const blogs = rows.map(r => unpack(r, {
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
    console.error('Error fetching blogs:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const saveBlog = async (req, res) => {
  try {
    const { id, slug, title, excerpt, content, category, readTime, author, date, coverImage } = req.body;
    if (!title || !String(title).trim()) return missingField(res, 'Blog title');

    const blogId = id || uid('blog', 0);
    const pool = getPool();

    if (pool) {
      const query = `
        INSERT INTO blogs (blog_id, slug, title, excerpt, content, category, read_time, author, date_str, cover_image, data_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          slug = VALUES(slug),
          title = VALUES(title),
          excerpt = VALUES(excerpt),
          content = VALUES(content),
          category = VALUES(category),
          read_time = VALUES(read_time),
          author = VALUES(author),
          date_str = VALUES(date_str),
          cover_image = VALUES(cover_image),
          data_json = VALUES(data_json)
      `;
      await pool.execute(query, [
        String(blogId),
        slug ? slugify(slug) : slugify(title),
        String(title).trim(),
        val(excerpt, ''),
        val(content, ''),
        val(category, 'Facility Management'),
        val(readTime, '5 min read'),
        val(author, 'Editorial Team'),
        // The panel calls this publishedDate; accept either spelling.
        val(date ?? req.body.publishedDate, new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })),
        val(coverImage, null),
        packed({ ...req.body, id: blogId })
      ]);
      return res.status(200).json({ success: true, message: 'Blog post saved in MySQL', data: { ...req.body, id: blogId } });
    } else {
      const idx = fallbackBlogs.findIndex(b => b.id === blogId);
      const obj = { ...req.body, id: blogId };
      if (idx >= 0) fallbackBlogs[idx] = obj; else fallbackBlogs.push(obj);
      return res.status(200).json({ success: true, message: 'Blog saved in fallback', data: obj });
    }
  } catch (err) {
    console.error('Error saving blog:', err);
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
    console.error('Error deleting blog:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 9. EDITABLE PAGE SECTIONS
// ==========================================
// Hero slides, section headings and banner copy, keyed by page. Reads are public
// because the website renders from them; writes are admin-only.
let fallbackSections = {};

export const getSection = async (req, res) => {
  try {
    const key = String(req.params.key || '').trim();
    if (!key) return missingField(res, 'Section key');

    const pool = getPool();
    if (pool) {
      const [rows] = await pool.query(
        'SELECT data_json FROM site_sections WHERE section_key = ?', [key]
      );
      if (rows.length === 0) return res.status(200).json({ success: true, data: null });
      let data = null;
      try {
        data = rows[0].data_json ? JSON.parse(rows[0].data_json) : null;
      } catch {
        data = null;
      }
      return res.status(200).json({ success: true, data });
    }
    return res.status(200).json({ success: true, data: fallbackSections[key] ?? null });
  } catch (err) {
    console.error('Error fetching section:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const saveSection = async (req, res) => {
  try {
    const key = String(req.params.key || '').trim();
    if (!key) return missingField(res, 'Section key');
    if (typeof req.body !== 'object' || req.body === null || Array.isArray(req.body)) {
      return res.status(400).json({ success: false, message: 'Expected a section object' });
    }

    const pool = getPool();
    if (pool) {
      await pool.execute(`
        INSERT INTO site_sections (section_key, data_json)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE data_json = VALUES(data_json)
      `, [key, packed(req.body)]);
      return res.status(200).json({ success: true, message: `Section "${key}" saved` });
    }

    fallbackSections[key] = req.body;
    return res.status(200).json({ success: true, message: `Section "${key}" saved in fallback` });
  } catch (err) {
    console.error('Error saving section:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 10. NAVIGATION MENU ITEMS
// ==========================================
export const getNavItems = async (req, res) => {
  try {
    const pool = getPool();
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM nav_items ORDER BY order_num ASC, id ASC');
      const items = rows.map(r => unpack(r, {
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
    console.error('Error fetching nav items:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const saveNavItems = async (req, res) => {
  try {
    const navList = req.body;
    if (!Array.isArray(navList)) {
      return res.status(400).json({ success: false, message: 'Expected an array of nav items' });
    }
    const pool = getPool();
    if (pool) {
      await replaceAll(
        pool,
        'nav_items',
        navList,
        `INSERT INTO nav_items (nav_id, label, path, type, is_visible, is_hot, order_num, data_json)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        (n, i) => [
          String(val(n.id, uid('nav', i))),
          val(n.label, ''),
          val(n.path, '/'),
          val(n.type, 'internal'),
          n.isVisible !== false,
          Boolean(n.isHot),
          i + 1,
          packed(n)
        ]
      );
      return res.status(200).json({ success: true, message: 'Nav items synced to MySQL' });
    }
    fallbackNavItems = navList;
    return res.status(200).json({ success: true, message: 'Saved in fallback' });
  } catch (err) {
    console.error('Error saving nav items:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
