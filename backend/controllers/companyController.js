import crypto from 'node:crypto';
import { getPool } from '../config/db.js';

/**
 * Client companies a recruiter sources staff for.
 *
 * Every panel role can read and create these — a recruiter has to be able to add a new
 * client while logging a placement, without waiting for an admin. Editing and deleting
 * stay with admin and HR.
 */

export const fallbackCompanies = [];

/** Used by the employee fallback path so a typed client name still becomes a company. */
export const registerFallbackCompany = ({ companyId, companyName }, user) => {
  if (!companyId && !companyName?.trim()) return { id: null, name: null };
  const key = nameKey(companyName || '');
  const existing = fallbackCompanies.find((x) => x.id === companyId || nameKey(x.name) === key);
  if (existing) return { id: existing.id, name: existing.name };

  const entry = {
    id: uid(),
    name: companyName.trim(),
    addedBy: user.sub,
    addedByName: user.name || user.email || 'Unknown',
    createdAt: new Date().toISOString(),
    employeeCount: 0,
  };
  fallbackCompanies.push(entry);
  return { id: entry.id, name: entry.name };
};

const uid = () => `cmp-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

/** Collapses case and spacing so "Apex Towers" and "apex  towers" are one company. */
const nameKey = (name) => String(name || '').trim().toLowerCase().replace(/\s+/g, ' ');

const mapRow = (r) => ({
  id: r.company_id,
  name: r.name,
  location: r.location,
  contactPerson: r.contact_person,
  phone: r.phone,
  email: r.email,
  industry: r.industry,
  notes: r.notes,
  isActive: Boolean(r.is_active),
  addedBy: r.added_by,
  addedByName: r.added_by_name,
  createdAt: r.created_at,
  employeeCount: r.employee_count !== undefined ? Number(r.employee_count) : undefined,
  lastPlacementAt: r.last_placement_at,
});

export const getCompanies = async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.status(200).json({ success: true, count: fallbackCompanies.length, data: fallbackCompanies });
    }

    // The counts come from the same query so the list can be shown with totals without
    // a second round trip. A recruiter only counts their own placements.
    const mine = req.user.role === 'recruiter';
    const [rows] = mine
      ? await pool.execute(`
          SELECT c.*,
                 COUNT(e.id) AS employee_count,
                 MAX(e.created_at) AS last_placement_at
          FROM client_companies c
          LEFT JOIN employee_records e ON e.company_id = c.company_id AND e.added_by = ?
          GROUP BY c.id
          ORDER BY c.name ASC
        `, [req.user.sub])
      : await pool.query(`
          SELECT c.*,
                 COUNT(e.id) AS employee_count,
                 MAX(e.created_at) AS last_placement_at
          FROM client_companies c
          LEFT JOIN employee_records e ON e.company_id = c.company_id
          GROUP BY c.id
          ORDER BY c.name ASC
        `);

    return res.status(200).json({ success: true, count: rows.length, data: rows.map(mapRow) });
  } catch (err) {
    console.error('Error fetching companies:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Creates a company, or returns the existing one when the name already exists.
 *
 * Returning the existing row instead of erroring keeps the recruiter's flow smooth:
 * typing a client name that someone already added simply reuses it rather than
 * creating a duplicate or blocking the save.
 */
export const saveCompany = async (req, res) => {
  try {
    const { id, name, location, contactPerson, phone, email, industry, notes, isActive } = req.body || {};
    if (!name?.trim()) return res.status(400).json({ success: false, message: 'Company name is required' });

    const pool = getPool();
    const key = nameKey(name);

    if (!pool) {
      const existing = fallbackCompanies.find((c) => nameKey(c.name) === key);
      if (existing) return res.status(200).json({ success: true, data: existing, existed: true });
      const obj = { ...req.body, id: id || uid(), addedBy: req.user.sub, addedByName: req.user.name, createdAt: new Date().toISOString(), employeeCount: 0 };
      fallbackCompanies.push(obj);
      return res.status(201).json({ success: true, data: obj });
    }

    if (!id) {
      const [dupes] = await pool.execute(
        'SELECT * FROM client_companies WHERE name_key = ? LIMIT 1', [key]
      );
      if (dupes.length > 0) {
        return res.status(200).json({ success: true, data: mapRow(dupes[0]), existed: true });
      }
    }

    // Only admin and HR may edit an existing company; anyone may add a new one.
    if (id && req.user.role === 'recruiter') {
      return res.status(403).json({ success: false, message: 'Only admin or HR can edit a company' });
    }

    const companyId = id || uid();
    await pool.execute(`
      INSERT INTO client_companies
        (company_id, name, name_key, location, contact_person, phone, email, industry, notes, is_active, added_by, added_by_name)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        location = VALUES(location),
        contact_person = VALUES(contact_person),
        phone = VALUES(phone),
        email = VALUES(email),
        industry = VALUES(industry),
        notes = VALUES(notes),
        is_active = VALUES(is_active)
    `, [
      companyId,
      name.trim(),
      key,
      location?.trim() || null,
      contactPerson?.trim() || null,
      phone?.trim() || null,
      email?.trim() || null,
      industry?.trim() || null,
      notes?.trim() || null,
      isActive === undefined ? true : Boolean(isActive),
      req.user.sub,
      req.user.name || req.user.email || 'Unknown',
    ]);

    // Keep the denormalised name on placements in step with a rename.
    if (id) {
      await pool.execute(
        'UPDATE employee_records SET company_name = ? WHERE company_id = ?', [name.trim(), companyId]
      );
    }

    return res.status(id ? 200 : 201).json({
      success: true,
      message: id ? 'Company updated' : 'Company added',
      data: { id: companyId, name: name.trim(), location, contactPerson, phone, email, industry, notes },
    });
  } catch (err) {
    console.error('Error saving company:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    if (!pool) {
      const at = fallbackCompanies.findIndex((c) => c.id === id);
      if (at >= 0) fallbackCompanies.splice(at, 1);
      return res.status(200).json({ success: true, message: 'Company deleted from fallback' });
    }

    const [[count]] = await pool.execute(
      'SELECT COUNT(*) AS n FROM employee_records WHERE company_id = ?', [id]
    );
    if (Number(count.n) > 0) {
      // Deleting would orphan the placement history, so say so instead of cascading.
      return res.status(409).json({
        success: false,
        message: `This company has ${count.n} employee record${count.n > 1 ? 's' : ''} linked to it. `
          + 'Move or delete those first, or mark the company inactive instead.',
      });
    }

    await pool.execute('DELETE FROM client_companies WHERE company_id = ?', [id]);
    return res.status(200).json({ success: true, message: 'Company deleted' });
  } catch (err) {
    console.error('Error deleting company:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/** Company-by-company placement summary for the dashboards. */
export const getCompanyBreakdown = async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(200).json({ success: true, data: [] });

    const [rows] = await pool.query(`
      SELECT
        COALESCE(e.company_id, 'unassigned') AS companyId,
        COALESCE(c.name, e.company_name, 'Not assigned') AS companyName,
        c.location,
        COUNT(e.id) AS total,
        SUM(CASE WHEN DATE(e.created_at) = CURDATE() THEN 1 ELSE 0 END) AS today,
        MAX(e.created_at) AS lastPlacementAt,
        COUNT(DISTINCT e.added_by) AS recruiters
      FROM employee_records e
      LEFT JOIN client_companies c ON c.company_id = e.company_id
      GROUP BY companyId, companyName, c.location
      ORDER BY total DESC
    `);

    return res.status(200).json({
      success: true,
      data: rows.map((r) => ({
        companyId: r.companyId,
        companyName: r.companyName,
        location: r.location,
        total: Number(r.total),
        today: Number(r.today),
        recruiters: Number(r.recruiters),
        lastPlacementAt: r.lastPlacementAt,
      })),
    });
  } catch (err) {
    console.error('Error building company breakdown:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
