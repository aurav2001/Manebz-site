import crypto from 'node:crypto';
import { getPool } from '../config/db.js';
import {
  hashPassword,
  verifyPasswordHash,
  generatePassword,
  createResetToken,
  hashResetToken,
  issueToken,
  ROLES,
  MANAGEABLE_ROLES,
} from '../middleware/auth.js';
import { sendResetEmail } from '../services/mailer.js';

const uid = (prefix) => `${prefix}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

const publicUser = (row) => ({
  id: row.user_id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  role: row.role,
  isActive: Boolean(row.is_active),
  mustChangePassword: Boolean(row.must_change_password),
  createdBy: row.created_by,
  lastLoginAt: row.last_login_at,
  createdAt: row.created_at,
});

const normaliseEmail = (email) => String(email || '').trim().toLowerCase();

/**
 * The account that exists before anyone has been created in the database.
 *
 * Without this the very first deploy would have no way in: the users table is empty and
 * only a signed-in admin can create users. ADMIN_PASSWORD from .env unlocks a virtual
 * admin so real accounts can be set up, and it keeps working as a recovery route if
 * every real admin is locked out.
 */
const BOOTSTRAP = {
  user_id: 'bootstrap-admin',
  name: 'Owner (bootstrap)',
  email: normaliseEmail(process.env.ADMIN_EMAIL || 'admin@manebz.com'),
  role: 'admin',
  is_active: 1,
};

const bootstrapMatches = (email, password) => {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured) return false;
  // The bootstrap admin accepts either its email or a bare password, so an owner who
  // only remembers the .env password is never locked out.
  const emailOk = !email || normaliseEmail(email) === BOOTSTRAP.email;
  return emailOk && password === configured;
};

// ==========================================
// LOGIN
// ==========================================

let recentFailures = 0;
let lockedUntil = 0;
const MAX_FAILURES = 10;
const LOCKOUT_MS = 5 * 60 * 1000;

export const login = async (req, res) => {
  try {
    if (Date.now() < lockedUntil) {
      return res.status(429).json({
        success: false,
        message: 'Too many failed attempts. Try again in a few minutes.',
      });
    }

    const { email, password } = req.body || {};
    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required' });
    }

    const pool = getPool();
    let user = null;

    if (pool && email) {
      const [rows] = await pool.execute(
        'SELECT * FROM panel_users WHERE email = ? LIMIT 1', [normaliseEmail(email)]
      );
      if (rows.length > 0) {
        const row = rows[0];
        if (!row.is_active) {
          return res.status(403).json({ success: false, message: 'This account has been deactivated.' });
        }
        if (await verifyPasswordHash(password, row.password_hash)) {
          user = row;
          await pool.execute(
            'UPDATE panel_users SET last_login_at = CURRENT_TIMESTAMP WHERE user_id = ?', [row.user_id]
          );
        }
      }
    }

    if (!user && bootstrapMatches(email, password)) {
      user = BOOTSTRAP;
    }

    if (!user) {
      recentFailures += 1;
      if (recentFailures >= MAX_FAILURES) {
        lockedUntil = Date.now() + LOCKOUT_MS;
        recentFailures = 0;
      }
      // Same delay and message whether the email exists or not, so the response cannot
      // be used to discover which addresses have accounts.
      await new Promise((r) => setTimeout(r, 400));
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    recentFailures = 0;
    const { token, expiresAt } = issueToken({
      userId: user.user_id,
      role: user.role,
      name: user.name,
      email: user.email,
    });

    return res.status(200).json({
      success: true,
      token,
      expiresAt,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        mustChangePassword: Boolean(user.must_change_password),
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const me = async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user.sub,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
    expiresAt: req.user.exp,
  });
};

// ==========================================
// USER MANAGEMENT
// ==========================================

export const listUsers = async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(200).json({ success: true, count: 0, data: [] });

    // HR only needs to see the recruiters it manages.
    const allowed = MANAGEABLE_ROLES[req.user.role] || [];
    if (allowed.length === 0) {
      return res.status(403).json({ success: false, message: 'Not allowed' });
    }

    const placeholders = allowed.map(() => '?').join(', ');
    const [rows] = await pool.execute(
      `SELECT * FROM panel_users WHERE role IN (${placeholders}) ORDER BY created_at DESC`,
      allowed
    );
    return res.status(200).json({ success: true, count: rows.length, data: rows.map(publicUser) });
  } catch (err) {
    console.error('Error listing users:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, phone, role, password } = req.body || {};

    if (!name?.trim()) return res.status(400).json({ success: false, message: 'Name is required' });
    if (!email?.trim()) return res.status(400).json({ success: false, message: 'Email is required' });
    if (!ROLES.includes(role)) {
      return res.status(400).json({ success: false, message: `Role must be one of: ${ROLES.join(', ')}` });
    }

    const allowed = MANAGEABLE_ROLES[req.user.role] || [];
    if (!allowed.includes(role)) {
      return res.status(403).json({
        success: false,
        message: `A ${req.user.role} account cannot create ${role} accounts`,
      });
    }

    const pool = getPool();
    if (!pool) return res.status(503).json({ success: false, message: 'Database unavailable' });

    const cleanEmail = normaliseEmail(email);
    const [existing] = await pool.execute(
      'SELECT user_id FROM panel_users WHERE email = ? LIMIT 1', [cleanEmail]
    );
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'An account with that email already exists' });
    }

    // A generated password is handed back once so the creator can pass it on; the user
    // is then forced to change it at first login.
    const initialPassword = password?.trim() || generatePassword();
    const userId = uid('usr');

    await pool.execute(`
      INSERT INTO panel_users (user_id, name, email, phone, password_hash, role, created_by, must_change_password)
      VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)
    `, [
      userId,
      name.trim(),
      cleanEmail,
      phone?.trim() || null,
      await hashPassword(initialPassword),
      role,
      req.user.sub,
    ]);

    return res.status(201).json({
      success: true,
      message: `${role} account created`,
      data: { id: userId, name: name.trim(), email: cleanEmail, role },
      initialPassword,
    });
  } catch (err) {
    console.error('Error creating user:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, isActive } = req.body || {};

    const pool = getPool();
    if (!pool) return res.status(503).json({ success: false, message: 'Database unavailable' });

    const [rows] = await pool.execute('SELECT * FROM panel_users WHERE user_id = ? LIMIT 1', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });

    const target = rows[0];
    const allowed = MANAGEABLE_ROLES[req.user.role] || [];
    if (!allowed.includes(target.role)) {
      return res.status(403).json({ success: false, message: 'Not allowed to change this account' });
    }
    if (target.user_id === req.user.sub && isActive === false) {
      return res.status(400).json({ success: false, message: 'You cannot deactivate your own account' });
    }

    await pool.execute(
      'UPDATE panel_users SET name = ?, phone = ?, is_active = ? WHERE user_id = ?',
      [
        name?.trim() || target.name,
        phone?.trim() ?? target.phone,
        isActive === undefined ? target.is_active : Boolean(isActive),
        id,
      ]
    );

    return res.status(200).json({ success: true, message: 'Account updated' });
  } catch (err) {
    console.error('Error updating user:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    if (!pool) return res.status(503).json({ success: false, message: 'Database unavailable' });

    if (id === req.user.sub) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
    }

    const [rows] = await pool.execute('SELECT role FROM panel_users WHERE user_id = ? LIMIT 1', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });

    const allowed = MANAGEABLE_ROLES[req.user.role] || [];
    if (!allowed.includes(rows[0].role)) {
      return res.status(403).json({ success: false, message: 'Not allowed to delete this account' });
    }

    await pool.execute('DELETE FROM panel_users WHERE user_id = ?', [id]);
    return res.status(200).json({ success: true, message: 'Account deleted' });
  } catch (err) {
    console.error('Error deleting user:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/** Admin or HR sets a new password for someone they manage. */
export const resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    if (!pool) return res.status(503).json({ success: false, message: 'Database unavailable' });

    const [rows] = await pool.execute('SELECT * FROM panel_users WHERE user_id = ? LIMIT 1', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });

    const allowed = MANAGEABLE_ROLES[req.user.role] || [];
    if (!allowed.includes(rows[0].role)) {
      return res.status(403).json({ success: false, message: 'Not allowed to reset this password' });
    }

    const newPassword = req.body?.password?.trim() || generatePassword();
    await pool.execute(
      'UPDATE panel_users SET password_hash = ?, must_change_password = TRUE WHERE user_id = ?',
      [await hashPassword(newPassword), id]
    );

    // Close any outstanding request for this person so the queue does not keep it.
    await pool.execute(
      `UPDATE password_resets SET status = 'completed', handled_by = ?, handled_at = CURRENT_TIMESTAMP
       WHERE email = ? AND status IN ('pending', 'emailed')`,
      [req.user.sub, rows[0].email]
    );

    return res.status(200).json({
      success: true,
      message: 'Password reset',
      newPassword,
      user: { name: rows[0].name, email: rows[0].email },
    });
  } catch (err) {
    console.error('Error resetting password:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/** Signed-in user changes their own password. */
export const changeOwnPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters' });
    }

    const pool = getPool();
    if (!pool) return res.status(503).json({ success: false, message: 'Database unavailable' });

    const [rows] = await pool.execute('SELECT * FROM panel_users WHERE user_id = ? LIMIT 1', [req.user.sub]);
    if (rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'The bootstrap owner account has no stored password. Change ADMIN_PASSWORD in .env instead.',
      });
    }

    if (!(await verifyPasswordHash(currentPassword, rows[0].password_hash))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    await pool.execute(
      'UPDATE panel_users SET password_hash = ?, must_change_password = FALSE WHERE user_id = ?',
      [await hashPassword(newPassword), req.user.sub]
    );

    return res.status(200).json({ success: true, message: 'Password changed' });
  } catch (err) {
    console.error('Error changing password:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// FORGOT PASSWORD
// ==========================================

/**
 * Records a reset request. If a mail service is configured the user gets a link; if not
 * the request sits in the panel for an admin or HR to action by hand.
 */
export const forgotPassword = async (req, res) => {
  try {
    const email = normaliseEmail(req.body?.email);
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const pool = getPool();
    // Always answer the same way so the form cannot be used to find valid addresses.
    const genericReply = {
      success: true,
      message: 'If that email belongs to an account, a reset has been started. '
        + 'You will receive a link, or an administrator will issue a new password.',
    };

    if (!pool) return res.status(200).json(genericReply);

    const [rows] = await pool.execute(
      'SELECT user_id, name, email, is_active FROM panel_users WHERE email = ? LIMIT 1', [email]
    );
    if (rows.length === 0 || !rows[0].is_active) return res.status(200).json(genericReply);

    const user = rows[0];
    const { token, tokenHash } = createResetToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // one hour

    const sent = await sendResetEmail({
      to: user.email,
      name: user.name,
      token,
      origin: req.headers.origin || `https://${req.headers.host || 'manebz.com'}`,
    });

    await pool.execute(`
      INSERT INTO password_resets (request_id, user_id, email, token_hash, expires_at, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [uid('rst'), user.user_id, user.email, tokenHash, expiresAt, sent ? 'emailed' : 'pending']);

    return res.status(200).json(genericReply);
  } catch (err) {
    console.error('Error starting password reset:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/** Completes the emailed-link flow. */
export const resetWithToken = async (req, res) => {
  try {
    const { token, newPassword } = req.body || {};
    if (!token) return res.status(400).json({ success: false, message: 'Reset token is required' });
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters' });
    }

    const pool = getPool();
    if (!pool) return res.status(503).json({ success: false, message: 'Database unavailable' });

    const [rows] = await pool.execute(`
      SELECT * FROM password_resets
      WHERE token_hash = ? AND status IN ('pending', 'emailed') AND expires_at > NOW()
      LIMIT 1
    `, [hashResetToken(token)]);

    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: 'This reset link is invalid or has expired' });
    }

    const request = rows[0];
    await pool.execute(
      'UPDATE panel_users SET password_hash = ?, must_change_password = FALSE WHERE user_id = ?',
      [await hashPassword(newPassword), request.user_id]
    );
    await pool.execute(
      `UPDATE password_resets SET status = 'completed', handled_at = CURRENT_TIMESTAMP WHERE request_id = ?`,
      [request.request_id]
    );

    return res.status(200).json({ success: true, message: 'Password updated. You can sign in now.' });
  } catch (err) {
    console.error('Error completing password reset:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/** The queue Admin/HR works through when no mail service is configured. */
export const listResetRequests = async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(200).json({ success: true, count: 0, data: [] });

    const [rows] = await pool.query(`
      SELECT r.*, u.name AS user_name, u.role AS user_role
      FROM password_resets r
      LEFT JOIN panel_users u ON u.user_id = r.user_id
      WHERE r.status IN ('pending', 'emailed')
      ORDER BY r.created_at DESC
      LIMIT 100
    `);

    const allowed = MANAGEABLE_ROLES[req.user.role] || [];
    const visible = rows
      .filter((r) => !r.user_role || allowed.includes(r.user_role))
      .map((r) => ({
        id: r.request_id,
        userId: r.user_id,
        email: r.email,
        name: r.user_name,
        role: r.user_role,
        status: r.status,
        requestedAt: r.created_at,
      }));

    return res.status(200).json({ success: true, count: visible.length, data: visible });
  } catch (err) {
    console.error('Error listing reset requests:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const dismissResetRequest = async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(503).json({ success: false, message: 'Database unavailable' });

    await pool.execute(
      `UPDATE password_resets SET status = 'cancelled', handled_by = ?, handled_at = CURRENT_TIMESTAMP
       WHERE request_id = ?`,
      [req.user.sub, req.params.id]
    );
    return res.status(200).json({ success: true, message: 'Request dismissed' });
  } catch (err) {
    console.error('Error dismissing reset request:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
