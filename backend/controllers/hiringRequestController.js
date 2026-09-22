import crypto from 'node:crypto';
import { getPool } from '../config/db.js';
import { countFallbackFills } from './employeeController.js';
import { notifyHiringRequest } from '../services/mailer.js';

/**
 * Staffing requirements raised by client companies.
 *
 * Two ways in: the public website form (no login) and Admin/HR entering one after a
 * phone call. Both land in the same queue. Progress is never typed in — it is counted
 * from the placements recruiters log against the request.
 */

let fallbackRequests = [];

const uid = () => `req-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
const val = (v, fallback = null) => (v === undefined || v === null || v === '' ? fallback : v);

const STATUSES = ['New', 'Assigned', 'In Progress', 'Fulfilled', 'Closed'];
const URGENCIES = ['Standard', 'Urgent', 'Immediate'];

const mapRow = (r) => ({
  id: r.request_id,
  companyId: r.company_id,
  companyName: r.company_name,
  contactPerson: r.contact_person,
  phone: r.phone,
  email: r.email,
  roleTitle: r.role_title,
  headcount: Number(r.headcount) || 1,
  location: r.location,
  experience: r.experience,
  salaryRange: r.salary_range,
  startDate: r.start_date,
  urgency: r.urgency,
  notes: r.notes,
  status: r.status,
  assignedTo: r.assigned_to,
  assignedToName: r.assigned_to_name,
  source: r.source,
  createdByName: r.created_by_name,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
  // Counted from employee_records, never stored.
  filled: r.filled !== undefined ? Number(r.filled) : 0,
});

/**
 * Finds or creates the client company for a request, so a requirement and the
 * placements that fill it hang off the same company record.
 */
const resolveCompany = async (pool, { companyId, companyName }, actor) => {
  if (companyId) {
    const [rows] = await pool.execute(
      'SELECT company_id, name FROM client_companies WHERE company_id = ? LIMIT 1', [companyId]
    );
    if (rows.length > 0) return { id: rows[0].company_id, name: rows[0].name };
  }

  const name = String(companyName || '').trim();
  if (!name) return { id: null, name: null };
  const key = name.toLowerCase().replace(/\s+/g, ' ');

  const [existing] = await pool.execute(
    'SELECT company_id, name FROM client_companies WHERE name_key = ? LIMIT 1', [key]
  );
  if (existing.length > 0) return { id: existing[0].company_id, name: existing[0].name };

  const newId = `cmp-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  await pool.execute(`
    INSERT INTO client_companies (company_id, name, name_key, added_by, added_by_name)
    VALUES (?, ?, ?, ?, ?)
  `, [newId, name, key, actor?.sub || null, actor?.name || 'Website form']);

  return { id: newId, name };
};

// ==========================================
// CREATE — public form and panel both land here
// ==========================================

export const createHiringRequest = async (req, res) => {
  try {
    const {
      companyId, companyName, contactPerson, phone, email,
      roleTitle, headcount, location, experience, salaryRange,
      startDate, urgency, notes,
    } = req.body || {};

    if (!companyName?.trim()) return res.status(400).json({ success: false, message: 'Company name is required' });
    if (!phone?.trim()) return res.status(400).json({ success: false, message: 'Phone number is required' });
    if (!roleTitle?.trim()) return res.status(400).json({ success: false, message: 'Which role you need is required' });

    // req.user is only present when a signed-in admin or HR is entering this.
    const actor = req.user || null;
    const source = actor ? 'panel' : 'website';

    const count = Math.max(1, Math.min(999, Number(headcount) || 1));
    const requestId = uid();

    // Trigger async email notification in background
    notifyHiringRequest({
      requestId,
      companyName: companyName.trim(),
      contactPerson: contactPerson?.trim(),
      phone: phone.trim(),
      email: email?.trim(),
      roleTitle: roleTitle.trim(),
      headcount: count,
      location,
      experience,
      salaryRange,
      startDate,
      urgency,
      notes,
      source
    }).catch(err => {
      console.warn('⚠️ [HiringRequest] Email notification error:', err.message);
    });

    const pool = getPool();

    if (!pool) {
      const obj = {
        ...req.body, id: requestId, headcount: count, status: 'New', source,
        filled: 0, createdAt: new Date().toISOString(),
      };
      fallbackRequests.unshift(obj);
      return res.status(201).json({ success: true, message: 'Requirement received', data: obj });
    }

    const company = await resolveCompany(pool, { companyId, companyName }, actor);

    await pool.execute(`
      INSERT INTO hiring_requests
        (request_id, company_id, company_name, contact_person, phone, email, role_title, headcount,
         location, experience, salary_range, start_date, urgency, notes, status, source,
         created_by, created_by_name, data_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'New', ?, ?, ?, ?)
    `, [
      requestId,
      company.id,
      company.name || companyName.trim(),
      val(contactPerson),
      phone.trim(),
      val(email),
      roleTitle.trim(),
      count,
      val(location),
      val(experience),
      val(salaryRange),
      val(startDate),
      URGENCIES.includes(urgency) ? urgency : 'Standard',
      val(notes),
      source,
      actor?.sub || null,
      actor?.name || null,
      JSON.stringify({ ...req.body, id: requestId }),
    ]);

    return res.status(201).json({
      success: true,
      message: 'Requirement received. Our team will be in touch shortly.',
      data: { id: requestId, companyName: company.name, roleTitle: roleTitle.trim(), headcount: count },
    });
  } catch (err) {
    console.error('Error creating hiring request:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ==========================================
// READ
// ==========================================

export const getHiringRequests = async (req, res) => {
  try {
    const pool = getPool();
    const recruiter = req.user.role === 'recruiter';

    if (!pool) {
      const list = (recruiter
        ? fallbackRequests.filter((r) => r.assignedTo === req.user.sub)
        : fallbackRequests
      ).map((r) => ({ ...r, filled: countFallbackFills(r.id) }));
      return res.status(200).json({ success: true, count: list.length, data: list });
    }

    // The filled count is a correlated subquery so a request with no placements still
    // comes back (a JOIN + GROUP BY would need care to avoid dropping it).
    const select = `
      SELECT h.*,
             (SELECT COUNT(*) FROM employee_records e WHERE e.request_id = h.request_id) AS filled
      FROM hiring_requests h
    `;

    const [rows] = recruiter
      ? await pool.execute(`${select} WHERE h.assigned_to = ? ORDER BY h.created_at DESC`, [req.user.sub])
      : await pool.query(`${select} ORDER BY
          FIELD(h.status, 'New', 'Assigned', 'In Progress', 'Fulfilled', 'Closed'),
          FIELD(h.urgency, 'Immediate', 'Urgent', 'Standard'),
          h.created_at DESC`);

    return res.status(200).json({ success: true, count: rows.length, data: rows.map(mapRow) });
  } catch (err) {
    console.error('Error fetching hiring requests:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// UPDATE
// ==========================================

export const updateHiringRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedTo, assignedToName, headcount, notes, roleTitle, location, salaryRange, urgency } = req.body || {};

    const pool = getPool();

    if (!pool) {
      const target = fallbackRequests.find((r) => r.id === id);
      if (!target) return res.status(404).json({ success: false, message: 'Requirement not found' });
      if (status) target.status = status;
      else if (assignedTo && target.status === 'New') target.status = 'Assigned';
      if (assignedTo !== undefined) {
        target.assignedTo = assignedTo || null;
        target.assignedToName = assignedToName || null;
      }
      if (headcount !== undefined) target.headcount = Math.max(1, Number(headcount) || 1);
      if (notes !== undefined) target.notes = notes;
      return res.status(200).json({ success: true, message: 'Requirement updated in fallback' });
    }

    const [rows] = await pool.execute('SELECT * FROM hiring_requests WHERE request_id = ? LIMIT 1', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Requirement not found' });

    const current = rows[0];
    if (status && !STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${STATUSES.join(', ')}` });
    }

    // Assigning someone moves it out of "New" on its own — one less click, and the
    // queue never shows an assigned request as untouched.
    const nextStatus = status
      || (assignedTo && current.status === 'New' ? 'Assigned' : current.status);

    await pool.execute(`
      UPDATE hiring_requests SET
        status = ?, assigned_to = ?, assigned_to_name = ?, headcount = ?,
        notes = ?, role_title = ?, location = ?, salary_range = ?, urgency = ?
      WHERE request_id = ?
    `, [
      nextStatus,
      assignedTo === undefined ? current.assigned_to : (assignedTo || null),
      assignedTo === undefined ? current.assigned_to_name : (assignedToName || null),
      headcount === undefined ? current.headcount : Math.max(1, Math.min(999, Number(headcount) || 1)),
      notes === undefined ? current.notes : val(notes),
      roleTitle?.trim() || current.role_title,
      location === undefined ? current.location : val(location),
      salaryRange === undefined ? current.salary_range : val(salaryRange),
      URGENCIES.includes(urgency) ? urgency : current.urgency,
      id,
    ]);

    return res.status(200).json({ success: true, message: 'Requirement updated' });
  } catch (err) {
    console.error('Error updating hiring request:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteHiringRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    if (!pool) {
      fallbackRequests = fallbackRequests.filter((r) => r.id !== id);
      return res.status(200).json({ success: true, message: 'Requirement deleted from fallback' });
    }

    // Placements stay; they just stop pointing at a request.
    await pool.execute('UPDATE employee_records SET request_id = NULL WHERE request_id = ?', [id]);
    await pool.execute('DELETE FROM hiring_requests WHERE request_id = ?', [id]);
    return res.status(200).json({ success: true, message: 'Requirement deleted' });
  } catch (err) {
    console.error('Error deleting hiring request:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/** Headline numbers for the Admin and HR dashboards. */
export const getHiringStats = async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) {
      const live = fallbackRequests.filter((r) => !['Fulfilled', 'Closed'].includes(r.status));
      return res.status(200).json({
        success: true,
        data: {
          open: live.length,
          unassigned: fallbackRequests.filter((r) => r.status === 'New').length,
          positions: live.reduce((n, r) => n + (Number(r.headcount) || 1), 0),
          filled: live.reduce((n, r) => n + countFallbackFills(r.id), 0),
        },
      });
    }

    const [[totals]] = await pool.query(`
      SELECT
        SUM(CASE WHEN status NOT IN ('Fulfilled', 'Closed') THEN 1 ELSE 0 END) AS open,
        SUM(CASE WHEN status = 'New' THEN 1 ELSE 0 END) AS unassigned,
        SUM(CASE WHEN status NOT IN ('Fulfilled', 'Closed') THEN headcount ELSE 0 END) AS positions
      FROM hiring_requests
    `);

    const [[fill]] = await pool.query(`
      SELECT COUNT(*) AS filled
      FROM employee_records e
      JOIN hiring_requests h ON h.request_id = e.request_id
      WHERE h.status NOT IN ('Fulfilled', 'Closed')
    `);

    return res.status(200).json({
      success: true,
      data: {
        open: Number(totals.open) || 0,
        unassigned: Number(totals.unassigned) || 0,
        positions: Number(totals.positions) || 0,
        filled: Number(fill.filled) || 0,
      },
    });
  } catch (err) {
    console.error('Error building hiring stats:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
