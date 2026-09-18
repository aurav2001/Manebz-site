import { getPool } from '../config/db.js';

/**
 * Outbound email without a mail library.
 *
 * Node 18+ has fetch built in, so both supported transports are plain HTTP calls and the
 * backend keeps bundling into a single app.js. Nothing here throws: if no transport is
 * configured, sending simply reports false and the caller falls back to the manual
 * reset queue in the admin panel.
 *
 * Transport is read from admin_settings, so it can be switched on from the panel later
 * without touching the server.
 */

const readSettings = async () => {
  const pool = getPool();
  if (!pool) return {};
  try {
    const [rows] = await pool.query('SELECT setting_key, setting_value FROM admin_settings');
    const settings = {};
    for (const row of rows) {
      try {
        settings[row.setting_key] = JSON.parse(row.setting_value);
      } catch {
        settings[row.setting_key] = row.setting_value;
      }
    }
    return settings;
  } catch {
    return {};
  }
};

const sendViaEmailJs = async (settings, { to, subject, body }) => {
  const { emailJsServiceId, emailJsTemplateId, emailJsPublicKey, emailJsPrivateKey } = settings;
  if (!emailJsServiceId || !emailJsTemplateId || !emailJsPublicKey) return false;

  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: emailJsServiceId,
      template_id: emailJsTemplateId,
      user_id: emailJsPublicKey,
      // EmailJS requires the private key for server-side calls.
      ...(emailJsPrivateKey ? { accessToken: emailJsPrivateKey } : {}),
      template_params: { to_email: to, subject, message: body },
    }),
  });

  if (!res.ok) {
    console.warn(`⚠️ [Mailer] EmailJS refused the message: ${res.status} ${await res.text()}`);
    return false;
  }
  return true;
};

const sendViaWebhook = async (settings, payload) => {
  const url = settings.webhookUrl;
  if (!url) return false;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.warn(`⚠️ [Mailer] Webhook refused the message: ${res.status}`);
    return false;
  }
  return true;
};

/** Returns true only if a transport actually accepted the message. */
export const sendMail = async ({ to, subject, body, meta = {} }) => {
  try {
    const settings = await readSettings();

    if (await sendViaEmailJs(settings, { to, subject, body })) return true;
    if (await sendViaWebhook(settings, { type: 'email', to, subject, body, ...meta })) return true;

    console.info('ℹ️ [Mailer] No email transport configured — falling back to the manual queue.');
    return false;
  } catch (err) {
    console.warn('⚠️ [Mailer] Send failed:', err.message);
    return false;
  }
};

export const sendResetEmail = async ({ to, name, token, origin }) => {
  const link = `${String(origin).replace(/\/+$/, '')}/admin?reset=${encodeURIComponent(token)}`;
  return sendMail({
    to,
    subject: 'Reset your MANEBZ panel password',
    body: [
      `Hello ${name || ''},`.trim(),
      '',
      'A password reset was requested for your MANEBZ panel account.',
      'Open the link below to set a new password. It expires in one hour.',
      '',
      link,
      '',
      'If you did not request this, you can ignore this email — nothing has changed.',
    ].join('\n'),
    meta: { event: 'password_reset', link },
  });
};

export default { sendMail, sendResetEmail };
