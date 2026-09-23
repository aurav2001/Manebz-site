import nodemailer from 'nodemailer';
import { getPool } from '../config/db.js';

/**
 * Universal Mailer Service for MANABS / MANEBZ
 *
 * Supports:
 * 1. Nodemailer SMTP (Gmail, Zoho, cPanel Webmail, SendGrid, Amazon SES, etc.)
 *    Configured via environment variables:
 *    - SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, MAIL_FROM, MAIL_TO
 * 2. Fallback to EmailJS or Webhook if stored in admin_settings table.
 * 3. Safe async non-blocking execution: form submissions never crash if credentials are missing or wrong.
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

/**
 * Creates or returns a nodemailer transporter based on environment or database settings.
 */
const getSmtpConfig = (settings = {}) => {
  const host = process.env.SMTP_HOST || settings.smtpHost || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT || settings.smtpPort || 587);
  const secure = (process.env.SMTP_SECURE === 'true' || settings.smtpSecure === true || port === 465);
  const user = process.env.SMTP_USER || settings.smtpUser || '';
  const pass = process.env.SMTP_PASS || settings.smtpPass || '';
  return { host, port, secure, user, pass, configured: Boolean(user && pass) };
};

const getSmtpTransporter = (settings = {}) => {
  const cfg = getSmtpConfig(settings);
  if (!cfg.configured) return null;

  return nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: { user: cfg.user, pass: cfg.pass },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    tls: {
      rejectUnauthorized: false // Helps avoid self-signed certificate errors on cPanel
    }
  });
};

const resolveRecipient = (settings = {}, to) =>
  to || process.env.MAIL_TO || settings.adminEmail || process.env.ADMIN_EMAIL || 'admin@manebz.com';

const resolveFrom = (cfg) =>
  process.env.MAIL_FROM || `"MANEBZ" <${cfg.user || 'no-reply@manebz.com'}>`;

const resolveReplyTo = (settings = {}, replyTo) =>
  replyTo || process.env.MAIL_REPLY_TO || settings.adminEmail || undefined;

/**
 * Microsoft 365 (and Google Workspace) refuse a From header that is not the mailbox we
 * authenticated with unless that mailbox has explicit "Send As" permission. Rather than
 * losing the notification, resend it from the authenticated address and keep the intended
 * sender as Reply-To. Any other failure is rethrown untouched.
 */
const sendWithFromFallback = async (transporter, cfg, message) => {
  try {
    return await transporter.sendMail(message);
  } catch (err) {
    const reason = String(err.response || err.message || '');
    const denied = /SendAsDenied|5\.2\.252|5\.7\.60|not allowed to send as/i.test(reason);
    if (!denied || !cfg.user) throw err;
    console.warn(`⚠️ [Mailer] ${message.from} may not send; retrying as ${cfg.user}.`);
    return transporter.sendMail({
      ...message,
      from: `"MANEBZ" <${cfg.user}>`,
      replyTo: message.replyTo || message.from,
    });
  }
};

const maskUser = (user) => (user ? user.replace(/^(.{2}).*(@.*)$/, '$1***$2') : '');

/**
 * What the panel shows under "Email delivery": is SMTP configured, and where do
 * notifications go. Never returns the password.
 */
export const getMailStatus = async () => {
  const settings = await readSettings();
  const cfg = getSmtpConfig(settings);
  const fallback = settings.emailJsServiceId ? 'emailjs' : settings.webhookUrl ? 'webhook' : null;
  return {
    smtpConfigured: cfg.configured,
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    user: maskUser(cfg.user),
    from: cfg.configured ? resolveFrom(cfg) : null,
    notifyTo: resolveRecipient(settings),
    replyTo: resolveReplyTo(settings) || null,
    fallback,
    source: process.env.SMTP_USER ? 'env' : settings.smtpUser ? 'settings' : null,
  };
};

/**
 * Opens a connection and authenticates without sending anything — the quickest
 * way to tell whether freshly added credentials are right.
 */
export const verifySmtp = async () => {
  const settings = await readSettings();
  const transporter = getSmtpTransporter(settings);
  if (!transporter) return { ok: false, error: 'SMTP_USER / SMTP_PASS not set' };
  try {
    await transporter.verify();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
};

/**
 * Sends a real test message and reports exactly what happened, unlike sendMail()
 * which swallows errors so form submissions never fail because of email.
 */
export const sendTestMail = async ({ to, requestedBy } = {}) => {
  const settings = await readSettings();
  const cfg = getSmtpConfig(settings);
  const recipient = resolveRecipient(settings, to);
  const transporter = getSmtpTransporter(settings);
  if (!transporter) {
    return { ok: false, to: recipient, error: 'SMTP is not configured. Add SMTP_USER and SMTP_PASS to backend/.env and restart the app.' };
  }
  try {
    const info = await sendWithFromFallback(transporter, cfg, {
      from: resolveFrom(cfg),
      to: recipient,
      replyTo: resolveReplyTo(settings),
      subject: 'MANEBZ panel — test email',
      text: `This is a test email from the MANEBZ panel.

Sent by: ${requestedBy || 'admin'}
Time: ${new Date().toISOString()}
SMTP host: ${cfg.host}:${cfg.port}

If you can read this, outgoing email is working.`,
      html: buildHtmlTemplate({
        title: 'Test email',
        subtitle: 'Outgoing email is working',
        items: [
          { label: 'Sent by', value: requestedBy || 'admin' },
          { label: 'Time', value: new Date().toLocaleString('en-IN') },
          { label: 'SMTP host', value: `${cfg.host}:${cfg.port}` },
        ],
        notes: 'If you can read this, the MANEBZ backend can send email. Inquiry, application, hiring-request and password-reset notifications will use this same channel.',
      }),
    });
    console.log(`✉️ [Mailer] Test email sent to ${recipient}: ${info.messageId}`);
    return { ok: true, to: recipient, messageId: info.messageId };
  } catch (err) {
    console.warn('⚠️ [Mailer] Test email failed:', err.message);
    return { ok: false, to: recipient, error: err.message };
  }
};

const sendViaEmailJs = async (settings, { to, subject, body, html }) => {
  const { emailJsServiceId, emailJsTemplateId, emailJsPublicKey, emailJsPrivateKey } = settings;
  if (!emailJsServiceId || !emailJsTemplateId || !emailJsPublicKey) return false;

  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: emailJsServiceId,
      template_id: emailJsTemplateId,
      user_id: emailJsPublicKey,
      ...(emailJsPrivateKey ? { accessToken: emailJsPrivateKey } : {}),
      template_params: { to_email: to, subject, message: body || html },
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

/**
 * Generic email sender.
 * Tries SMTP transporter first, then EmailJS/Webhook.
 */
export const sendMail = async ({ to, subject, text, html, replyTo, meta = {} }) => {
  try {
    const settings = await readSettings();
    const recipient = resolveRecipient(settings, to);
    const cfg = getSmtpConfig(settings);
    const fromAddress = resolveFrom(cfg);

    // 1. Try SMTP transporter
    const transporter = getSmtpTransporter(settings);
    if (transporter) {
      try {
        const info = await sendWithFromFallback(transporter, cfg, {
          from: fromAddress,
          to: recipient,
          replyTo: resolveReplyTo(settings, replyTo),
          subject,
          text: text || '',
          html: html || undefined,
        });
        console.log(`✉️ [Mailer] Email sent successfully to ${recipient}: ${info.messageId}`);
        return true;
      } catch (smtpErr) {
        console.warn('⚠️ [Mailer] SMTP send failed:', smtpErr.message);
      }
    }

    // 2. Fallback to EmailJS / Webhook
    if (await sendViaEmailJs(settings, { to: recipient, subject, body: text, html })) return true;
    if (await sendViaWebhook(settings, { type: 'email', to: recipient, subject, body: text, ...meta })) return true;

    if (!transporter) {
      console.info('ℹ️ [Mailer] SMTP not configured. Set SMTP_USER and SMTP_PASS in backend/.env to send emails.');
    }
    return false;
  } catch (err) {
    console.warn('⚠️ [Mailer] Send failed:', err.message);
    return false;
  }
};

/**
 * Branded HTML email wrapper
 */
const buildHtmlTemplate = ({ title, subtitle, items = [], notes = '' }) => {
  const rows = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 14px; font-weight: 600; color: #475569; width: 35%; border-bottom: 1px solid #e2e8f0; font-size: 14px; vertical-align: top;">
          ${item.label}
        </td>
        <td style="padding: 10px 14px; color: #0f172a; border-bottom: 1px solid #e2e8f0; font-size: 14px; word-break: break-word;">
          ${item.value || '—'}
        </td>
      </tr>
    `
    )
    .join('');

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin: 0; padding: 24px 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      <!-- Header -->
      <tr>
        <td style="padding: 24px 30px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff;">
          <h1 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px;">MANEBZ</h1>
          <p style="margin: 6px 0 0 0; font-size: 13px; color: #94a3b8;">${subtitle || 'System Notification'}</p>
        </td>
      </tr>
      <!-- Title -->
      <tr>
        <td style="padding: 24px 30px 10px 30px;">
          <h2 style="margin: 0; font-size: 18px; color: #0f172a;">${title}</h2>
        </td>
      </tr>
      <!-- Details Table -->
      <tr>
        <td style="padding: 10px 30px 20px 30px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; background-color: #f8fafc; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
            ${rows}
          </table>
        </td>
      </tr>
      ${notes ? `
      <tr>
        <td style="padding: 0 30px 20px 30px;">
          <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px 16px; border-radius: 4px;">
            <p style="margin: 0; font-size: 13px; color: #1e40af; line-height: 1.5;">${notes}</p>
          </div>
        </td>
      </tr>
      ` : ''}
      <!-- Footer -->
      <tr>
        <td style="padding: 16px 30px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #64748b;">
            This is an automated notification from the MANEBZ Enterprise Portal.<br>
            <a href="https://manebz.com" style="color: #2563eb; text-decoration: none;">https://manebz.com</a>
          </p>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};

// ==========================================
// FORM NOTIFICATION HANDLERS
// ==========================================

/**
 * 1. Contact Form Notification
 */
export const notifyContactForm = async ({ name, email, phone, subject, message }) => {
  const title = `New Contact Message from ${name}`;
  const items = [
    { label: 'Sender Name', value: name },
    { label: 'Email', value: email ? `<a href="mailto:${email}">${email}</a>` : '—' },
    { label: 'Phone', value: phone ? `<a href="tel:${phone}">${phone}</a>` : '—' },
    { label: 'Subject', value: subject || 'General Inquiry' },
    { label: 'Message', value: message ? message.replace(/\n/g, '<br>') : '—' },
  ];

  const html = buildHtmlTemplate({
    title,
    subtitle: 'Public Website Contact Form',
    items,
  });

  const text = [
    `NEW CONTACT MESSAGE`,
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Subject: ${subject || 'General Inquiry'}`,
    `Message:`,
    message,
  ].join('\n');

  return sendMail({
    subject: `[Contact Form] ${subject || 'New Message'} - ${name}`,
    text,
    html,
    replyTo: email,
    meta: { event: 'contact_submission', email, name },
  });
};

/**
 * 2. Inquiry Form Notification
 */
export const notifyInquiryForm = async ({ inquiryId, name, phone, email, service, message, source }) => {
  const title = `New Inquiry: ${service || 'General Service'}`;
  const items = [
    { label: 'Inquiry ID', value: inquiryId || '—' },
    { label: 'Client Name', value: name },
    { label: 'Phone', value: phone ? `<a href="tel:${phone}">${phone}</a>` : '—' },
    { label: 'Email', value: email ? `<a href="mailto:${email}">${email}</a>` : '—' },
    { label: 'Service Interested', value: service || 'HR Staffing & Payroll Management' },
    { label: 'Source', value: source || 'Website Modal' },
    { label: 'Details / Message', value: message ? message.replace(/\n/g, '<br>') : '—' },
  ];

  const html = buildHtmlTemplate({
    title,
    subtitle: 'Website Service Inquiry / Lead',
    items,
  });

  const text = [
    `NEW SERVICE INQUIRY (${inquiryId || 'New'})`,
    `Client Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email || 'N/A'}`,
    `Service: ${service || 'HR Staffing & Payroll Management'}`,
    `Source: ${source || 'Website'}`,
    `Message: ${message || 'N/A'}`,
  ].join('\n');

  return sendMail({
    subject: `[New Inquiry] ${service || 'Service Request'} - ${name}`,
    text,
    html,
    replyTo: email || undefined,
    meta: { event: 'inquiry_submission', inquiryId, name, phone },
  });
};

/**
 * 3. Job Application Notification
 */
export const notifyJobApplication = async ({
  applicationId,
  fullName,
  email,
  phone,
  jobTitle,
  department,
  experience,
  location,
  qualification,
  currentCtc,
  expectedCtc,
  resumeUrl,
  notes,
}) => {
  const title = `New Job Application: ${jobTitle}`;
  const items = [
    { label: 'Application ID', value: applicationId || '—' },
    { label: 'Candidate Name', value: fullName },
    { label: 'Applied Role', value: `<strong>${jobTitle}</strong> (${department || 'General'})` },
    { label: 'Phone', value: phone ? `<a href="tel:${phone}">${phone}</a>` : '—' },
    { label: 'Email', value: email ? `<a href="mailto:${email}">${email}</a>` : '—' },
    { label: 'Experience', value: experience || '—' },
    { label: 'Location', value: location || '—' },
    { label: 'Qualification', value: qualification || '—' },
    { label: 'Current CTC', value: currentCtc || '—' },
    { label: 'Expected CTC', value: expectedCtc || '—' },
    { label: 'Resume', value: resumeUrl ? `<a href="${resumeUrl}" target="_blank" style="color: #2563eb; font-weight: 600;">View / Download Resume</a>` : 'Not Attached' },
    { label: 'Cover / Notes', value: notes ? notes.replace(/\n/g, '<br>') : '—' },
  ];

  const html = buildHtmlTemplate({
    title,
    subtitle: 'Careers Portal Application',
    items,
  });

  const text = [
    `NEW JOB APPLICATION`,
    `Candidate: ${fullName}`,
    `Role: ${jobTitle} (${department})`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    `Experience: ${experience}`,
    `Location: ${location}`,
    `Resume: ${resumeUrl || 'None'}`,
    `Notes: ${notes || 'None'}`,
  ].join('\n');

  return sendMail({
    subject: `[Job Application] ${jobTitle} - ${fullName}`,
    text,
    html,
    replyTo: email,
    meta: { event: 'job_application', applicationId, fullName, jobTitle },
  });
};

/**
 * 4. Hiring Request (Staffing Requirement) Notification
 */
export const notifyHiringRequest = async ({
  requestId,
  companyName,
  contactPerson,
  phone,
  email,
  roleTitle,
  headcount,
  location,
  experience,
  salaryRange,
  startDate,
  urgency,
  notes,
  source,
}) => {
  const title = `Staffing Request: ${roleTitle} (${headcount || 1} open)`;
  const items = [
    { label: 'Request ID', value: requestId || '—' },
    { label: 'Company Name', value: `<strong>${companyName}</strong>` },
    { label: 'Contact Person', value: contactPerson || '—' },
    { label: 'Phone', value: phone ? `<a href="tel:${phone}">${phone}</a>` : '—' },
    { label: 'Email', value: email ? `<a href="mailto:${email}">${email}</a>` : '—' },
    { label: 'Role Needed', value: roleTitle },
    { label: 'Headcount', value: String(headcount || 1) },
    { label: 'Urgency', value: `<span style="display:inline-block; padding: 2px 8px; border-radius: 4px; font-weight: 600; font-size: 12px; background-color: ${urgency === 'Immediate' ? '#fee2e2; color:#dc2626' : urgency === 'Urgent' ? '#fef3c7; color:#d97706' : '#f1f5f9; color:#475569'};">${urgency || 'Standard'}</span>` },
    { label: 'Location', value: location || '—' },
    { label: 'Experience Req.', value: experience || '—' },
    { label: 'Budget / Salary', value: salaryRange || '—' },
    { label: 'Target Start Date', value: startDate || '—' },
    { label: 'Source', value: source || 'website' },
    { label: 'Special Notes', value: notes ? notes.replace(/\n/g, '<br>') : '—' },
  ];

  const html = buildHtmlTemplate({
    title,
    subtitle: 'Client Staffing & Hiring Requirement',
    items,
  });

  const text = [
    `NEW HIRING / STAFFING REQUEST`,
    `Company: ${companyName}`,
    `Contact: ${contactPerson || 'N/A'} (${phone}, ${email || 'N/A'})`,
    `Role: ${roleTitle} (Quantity: ${headcount || 1})`,
    `Urgency: ${urgency || 'Standard'}`,
    `Location: ${location || 'N/A'}`,
    `Budget: ${salaryRange || 'N/A'}`,
    `Notes: ${notes || 'None'}`,
  ].join('\n');

  return sendMail({
    subject: `[Staffing Request] [${urgency || 'Standard'}] ${companyName} - ${roleTitle} (${headcount || 1} Openings)`,
    text,
    html,
    replyTo: email || undefined,
    meta: { event: 'hiring_request', requestId, companyName, roleTitle },
  });
};

/**
 * 5. Password Reset Email
 */
export const sendResetEmail = async ({ to, name, token, origin }) => {
  const link = `${String(origin).replace(/\/+$/, '')}/admin?reset=${encodeURIComponent(token)}`;
  const title = 'Reset your MANEBZ Panel Password';

  const items = [
    { label: 'Account Name', value: name || 'User' },
    { label: 'Account Email', value: to },
    { label: 'Validity', value: 'This link expires in 1 hour' },
  ];

  const notes = `
    <strong>Action Required:</strong> Click the button below to choose a new password.<br>
    <div style="text-align: center; margin: 16px 0;">
      <a href="${link}" target="_blank" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #ffffff; font-weight: 600; text-decoration: none; border-radius: 6px; font-size: 14px;">Reset Password Now</a>
    </div>
    <small style="color: #64748b;">Or copy this link to your browser: ${link}</small><br><br>
    If you did not request this reset, you can safely ignore this email — your account remains secure.
  `;

  const html = buildHtmlTemplate({
    title,
    subtitle: 'Security & Account Recovery',
    items,
    notes,
  });

  const text = [
    `Hello ${name || ''},`.trim(),
    '',
    'A password reset was requested for your MANEBZ panel account.',
    'Open the link below to set a new password. It expires in one hour.',
    '',
    link,
    '',
    'If you did not request this, you can ignore this email — nothing has changed.',
  ].join('\n');

  return sendMail({
    to,
    subject: 'Reset your MANEBZ panel password',
    text,
    html,
    meta: { event: 'password_reset', link },
  });
};

export default {
  sendMail,
  getMailStatus,
  verifySmtp,
  sendTestMail,
  notifyContactForm,
  notifyInquiryForm,
  notifyJobApplication,
  notifyHiringRequest,
  sendResetEmail,
};
