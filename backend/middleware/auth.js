import crypto from 'node:crypto';
import { promisify } from 'node:util';

/**
 * Admin / HR / Recruiter authentication.
 *
 * Tokens are HMAC-signed and passwords are hashed with node's own scrypt, so the whole
 * thing still bundles into a single app.js for cPanel with no extra dependency.
 *
 * Token format:  base64url(payload) + "." + base64url(HMAC-SHA256(payload, secret))
 */

const scrypt = promisify(crypto.scrypt);

const TOKEN_TTL_HOURS = Number(process.env.ADMIN_TOKEN_TTL_HOURS || 12);

// A missing secret must not silently fall back to a guessable constant. A random
// per-boot secret is still safe — it only means tokens stop working after a restart.
const SECRET = process.env.ADMIN_TOKEN_SECRET || crypto.randomBytes(32).toString('hex');

if (!process.env.ADMIN_TOKEN_SECRET) {
  console.warn('⚠️ [Auth] ADMIN_TOKEN_SECRET is not set — using a random per-boot secret.');
  console.warn('   Everyone will be logged out on every restart. Set it in .env to fix.');
}

export const ROLES = ['admin', 'hr', 'recruiter'];

// Who may create or manage whom. Admin manages everyone; HR only recruiters.
export const MANAGEABLE_ROLES = {
  admin: ['admin', 'hr', 'recruiter'],
  hr: ['recruiter'],
  recruiter: [],
};

const b64url = (buf) => Buffer.from(buf).toString('base64url');

const sign = (payloadB64) =>
  crypto.createHmac('sha256', SECRET).update(payloadB64).digest('base64url');

/** Compare without leaking how much of the value matched. */
const safeEqual = (a, b) => {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
};

// ==========================================
// PASSWORDS
// ==========================================

export const hashPassword = async (plain) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = await scrypt(String(plain), salt, 64);
  return `scrypt$${salt}$${derived.toString('hex')}`;
};

export const verifyPasswordHash = async (plain, stored) => {
  if (typeof stored !== 'string') return false;
  const [scheme, salt, hash] = stored.split('$');
  if (scheme !== 'scrypt' || !salt || !hash) return false;

  const derived = await scrypt(String(plain), salt, 64);
  const expected = Buffer.from(hash, 'hex');
  if (derived.length !== expected.length) return false;
  return crypto.timingSafeEqual(derived, expected);
};

/** Readable but unguessable — an admin has to read these out to someone. */
export const generatePassword = () => {
  const words = crypto.randomBytes(6).toString('base64').replace(/[+/=]/g, '');
  return `Mnz-${words.slice(0, 8)}-${crypto.randomInt(100, 999)}`;
};

// ==========================================
// RESET TOKENS
// ==========================================

export const createResetToken = () => {
  const token = crypto.randomBytes(32).toString('base64url');
  // Only the hash is stored, so a database leak cannot be used to reset anyone.
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  return { token, tokenHash };
};

export const hashResetToken = (token) =>
  crypto.createHash('sha256').update(String(token)).digest('hex');

// ==========================================
// SESSION TOKENS
// ==========================================

export const issueToken = ({ userId, role, name, email }) => {
  const payload = {
    sub: userId,
    role,
    name,
    email,
    iat: Date.now(),
    exp: Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000,
  };
  const payloadB64 = b64url(JSON.stringify(payload));
  return {
    token: `${payloadB64}.${sign(payloadB64)}`,
    expiresAt: payload.exp,
  };
};

export const readToken = (token) => {
  if (typeof token !== 'string' || !token.includes('.')) return null;
  const [payloadB64, signature] = token.split('.');
  if (!payloadB64 || !signature) return null;
  if (!safeEqual(signature, sign(payloadB64))) return null;

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'));
    if (!payload.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
};

// ==========================================
// GUARDS
// ==========================================

/** Any signed-in panel user. */
export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  const payload = readToken(token);

  if (!payload) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
      code: 'AUTH_REQUIRED',
    });
  }

  req.user = payload;
  return next();
};

/**
 * Restricts a route to the given roles. Always used after requireAuth, and returns 403
 * rather than 401 so the panel can tell "log in again" apart from "not allowed".
 */
export const requireRole = (...allowed) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required', code: 'AUTH_REQUIRED' });
  }
  if (!allowed.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Your account does not have access to this action',
      code: 'FORBIDDEN',
    });
  }
  return next();
};

/** Shorthand for the two roles that manage people and content. */
export const requireStaff = [requireAuth, requireRole('admin', 'hr')];
export const requireAdmin = [requireAuth, requireRole('admin')];

export default {
  requireAuth,
  requireRole,
  issueToken,
  readToken,
  hashPassword,
  verifyPasswordHash,
  generatePassword,
  createResetToken,
  hashResetToken,
  ROLES,
  MANAGEABLE_ROLES,
};
