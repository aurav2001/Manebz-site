import crypto from 'node:crypto';
import { getPool } from '../config/db.js';
import { registerFallbackCompany } from './companyController.js';

/**
 * People a recruiter has placed or processed.
 *
 * A recruiter only ever sees their own entries; admin and HR see everyone's, with the
 * recruiter's name and the exact time attached to each row — that is what the dashboards
 * report on.
 */

let fallbackRecords = [];

/** Lets the hiring-request fallback count placements without a database. */
export const countFallbackFills = (requestId) =>
  fallbackRecords.filter((r) => r.requestId === requestId).length;

const uid = () => `emp-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
const val = (v, fallback = null) => (v === undefined || v === null || v === '' ? fallback : v);

const mapRow = (r) => {
  const base = {
    id: r.record_id,
    fullName: r.full_name,
    age: r.age,
    qualification: r.qualification,
    location: r.location,
    phone: r.phone,
    email: r.email,
    designation: r.designation,
    clientSite: r.client_site,
    companyId: r.company_id,
    requestId: r.request_id,
    requestRole: r.request_role,
    // Falls back to the joined name so a record still reads correctly if the
    // denormalised copy was written before the company was renamed.
    companyName: r.joined_company_name || r.company_name,
    status: r.status,
    notes: r.notes,
    addedBy: r.added_by,
    addedByName: r.added_by_name,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
  if (!r.data_json) return base;
  try {
    return { ...base, ...JSON.parse(r.data_json), id: base.id, createdAt: base.createdAt };
  } catch {
    return base;
  }
};

const canSeeEveryone = (role) => role === 'admin' || role === 'hr';

export const getEmployees = async (req, res) => {
  try {
    const pool = getPool();
    const mine = !canSeeEveryone(req.user.role);

    if (!pool) {
      const list = mine ? fallbackRecords.filter((r) => r.addedBy === req.user.sub) : fallbackRecords;
      return res.status(200).json({ success: true, count: list.length, data: list });
    }

    const select = `
      SELECT e.*, c.name AS joined_company_name, h.role_title AS request_role
      FROM employee_records e
      LEFT JOIN client_companies c ON c.company_id = e.company_id
      LEFT JOIN hiring_requests h ON h.request_id = e.request_id
    `;
    const [rows] = mine
      ? await pool.execute(`${select} WHERE e.added_by = ? ORDER BY e.created_at DESC`, [req.user.sub])
      : await pool.query(`${select} ORDER BY e.created_at DESC`);

    return res.status(200).json({ success: true, count: rows.length, data: rows.map(mapRow) });
  } catch (err) {
    console.error('Error fetching employee records:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Resolves the company a placement belongs to.
 *
 * A recruiter may pick an existing company or type a new client name. Typing one creates
 * it on the spot, so logging a placement never stalls waiting for an admin to add the
 * company first. Matching is case-insensitive to avoid near-duplicate clients.
 */
const resolveCompany = async (pool, { companyId, companyName }, user) => {
  if (!companyId && !companyName?.trim()) return { id: null, name: null };

  if (companyId) {
    const [rows] = await pool.execute(
      'SELECT company_id, name FROM client_companies WHERE company_id = ? LIMIT 1', [companyId]
    );
    if (rows.length > 0) return { id: rows[0].company_id, name: rows[0].name };
  }

  const name = companyName.trim();
  const key = name.toLowerCase().replace(/\s+/g, ' ');

  const [existing] = await pool.execute(
    'SELECT company_id, name FROM client_companies WHERE name_key = ? LIMIT 1', [key]
  );
  if (existing.length > 0) return { id: existing[0].company_id, name: existing[0].name };

  const newId = `cmp-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  await pool.execute(`
    INSERT INTO client_companies (company_id, name, name_key, added_by, added_by_name)
    VALUES (?, ?, ?, ?, ?)
  `, [newId, name, key, user.sub, user.name || user.email || 'Unknown']);

  return { id: newId, name };
};

export const saveEmployee = async (req, res) => {
  try {
    const {
      id, fullName, age, qualification, location, phone, email,
      designation, clientSite, status, notes, companyId, companyName, requestId,
    } = req.body || {};

    if (!fullName?.trim()) return res.status(400).json({ success: false, message: 'Full name is required' });
    if (!phone?.trim()) return res.status(400).json({ success: false, message: 'Phone number is required' });

    const pool = getPool();
    const recordId = id || uid();

    if (!pool) {
      // Mirror the MySQL behaviour so a typed client name still registers as a company
      // while running without a database.
      const fallbackCompany = registerFallbackCompany({ companyId, companyName }, req.user);
      const obj = {
        ...req.body,
        id: recordId,
        companyId: fallbackCompany.id,
        companyName: fallbackCompany.name,
        addedBy: req.user.sub,
        addedByName: req.user.name,
        createdAt: new Date().toISOString(),
      };
      const idx = fallbackRecords.findIndex((r) => r.id === recordId);
      if (idx >= 0) fallbackRecords[idx] = obj; else fallbackRecords.unshift(obj);
      return res.status(200).json({ success: true, message: 'Record saved in fallback', data: obj });
    }

    if (id) {
      // A recruiter may only edit rows they created; admin and HR may edit any.
      const [existing] = await pool.execute(
        'SELECT added_by FROM employee_records WHERE record_id = ? LIMIT 1', [id]
      );
      if (existing.length > 0 && !canSeeEveryone(req.user.role) && existing[0].added_by !== req.user.sub) {
        return res.status(403).json({ success: false, message: 'You can only edit records you added' });
      }
    }

    const company = await resolveCompany(pool, { companyId, companyName }, req.user);

    await pool.execute(`
      INSERT INTO employee_records
        (record_id, full_name, age, qualification, location, phone, email, designation, client_site,
         company_id, company_name, request_id, status, notes, added_by, added_by_name, data_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        full_name = VALUES(full_name),
        age = VALUES(age),
        qualification = VALUES(qualification),
        location = VALUES(location),
        phone = VALUES(phone),
        email = VALUES(email),
        designation = VALUES(designation),
        client_site = VALUES(client_site),
        company_id = VALUES(company_id),
        company_name = VALUES(company_name),
        request_id = VALUES(request_id),
        status = VALUES(status),
        notes = VALUES(notes),
        data_json = VALUES(data_json)
    `, [
      String(recordId),
      fullName.trim(),
      val(age),
      val(qualification),
      val(location),
      phone.trim(),
      val(email),
      val(designation),
      val(clientSite),
      company.id,
      company.name,
      val(requestId),
      val(status, 'Placed'),
      val(notes),
      req.user.sub,
      req.user.name || req.user.email || 'Unknown',
      JSON.stringify({ ...req.body, id: recordId, companyId: company.id, companyName: company.name }),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Employee record saved',
      data: { ...req.body, id: recordId, companyId: company.id, companyName: company.name },
    });
  } catch (err) {
    console.error('Error saving employee record:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    if (!pool) {
      fallbackRecords = fallbackRecords.filter((r) => r.id !== id);
      return res.status(200).json({ success: true, message: 'Record deleted from fallback' });
    }

    const [existing] = await pool.execute(
      'SELECT added_by FROM employee_records WHERE record_id = ? LIMIT 1', [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    if (!canSeeEveryone(req.user.role) && existing[0].added_by !== req.user.sub) {
      return res.status(403).json({ success: false, message: 'You can only delete records you added' });
    }

    await pool.execute('DELETE FROM employee_records WHERE record_id = ?', [id]);
    return res.status(200).json({ success: true, message: 'Employee record deleted' });
  } catch (err) {
    console.error('Error deleting employee record:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/** Per-recruiter totals for the admin and HR dashboards. */
export const getEmployeeStats = async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) {
      // Same shape as the SQL branch, computed from the in-memory records.
      const now = Date.now();
      const dayStart = new Date().setHours(0, 0, 0, 0);
      const byRecruiter = Object.values(fallbackRecords.reduce((acc, r) => {
        const k = r.addedBy || 'unknown';
        acc[k] ??= { userId: r.addedBy, name: r.addedByName, total: 0, lastAddedAt: null };
        acc[k].total += 1;
        if (!acc[k].lastAddedAt || r.createdAt > acc[k].lastAddedAt) acc[k].lastAddedAt = r.createdAt;
        return acc;
      }, {})).sort((a, b) => b.total - a.total);
      return res.status(200).json({
        success: true,
        data: {
          total: fallbackRecords.length,
          today: fallbackRecords.filter((r) => new Date(r.createdAt).getTime() >= dayStart).length,
          week: fallbackRecords.filter((r) => now - new Date(r.createdAt).getTime() < 7 * 86400000).length,
          byRecruiter,
        },
      });
    }

    const [[totals]] = await pool.query(`
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) AS today,
        SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) AS week
      FROM employee_records
    `);

    const [byRecruiter] = await pool.query(`
      SELECT added_by AS userId, added_by_name AS name, COUNT(*) AS total,
             MAX(created_at) AS lastAddedAt
      FROM employee_records
      GROUP BY added_by, added_by_name
      ORDER BY total DESC
    `);

    return res.status(200).json({
      success: true,
      data: {
        total: Number(totals.total) || 0,
        today: Number(totals.today) || 0,
        week: Number(totals.week) || 0,
        byRecruiter: byRecruiter.map((r) => ({
          userId: r.userId,
          name: r.name || 'Unknown',
          total: Number(r.total),
          lastAddedAt: r.lastAddedAt,
        })),
      },
    });
  } catch (err) {
    console.error('Error building employee stats:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
