import { getPool } from '../config/db.js';
import { getMailStatus, verifySmtp, sendTestMail } from '../services/mailer.js';

let fallbackSettings = {};

export const getSettings = async (req, res) => {
  try {
    const pool = getPool();
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM admin_settings');
      const settings = {};
      rows.forEach(r => {
        try {
          settings[r.setting_key] = JSON.parse(r.setting_value);
        } catch {
          settings[r.setting_key] = r.setting_value;
        }
      });
      return res.status(200).json({ success: true, data: settings });
    } else {
      return res.status(200).json({ success: true, data: fallbackSettings });
    }
  } catch (error) {
    console.error('Error fetching settings:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const saveSettings = async (req, res) => {
  try {
    const settings = req.body;
    const pool = getPool();

    if (pool) {
      for (const [key, val] of Object.entries(settings)) {
        await pool.execute(`
          INSERT INTO admin_settings (setting_key, setting_value)
          VALUES (?, ?)
          ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)
        `, [key, typeof val === 'object' ? JSON.stringify(val) : String(val)]);
      }
      return res.status(200).json({ success: true, message: 'Settings saved successfully' });
    } else {
      fallbackSettings = { ...fallbackSettings, ...settings };
      return res.status(200).json({ success: true, message: 'Settings saved in fallback' });
    }
  } catch (error) {
    console.error('Error saving settings:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// GET /settings/mail-status — is SMTP configured, where do notifications go.
export const mailStatus = async (req, res) => {
  try {
    return res.status(200).json({ success: true, data: await getMailStatus() });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /settings/test-email { to?, verifyOnly? } — proves the credentials work.
export const testEmail = async (req, res) => {
  try {
    const { to, verifyOnly } = req.body || {};
    if (to && !/^[^s@]+@[^s@]+.[^s@]+$/.test(String(to))) {
      return res.status(400).json({ success: false, message: 'Enter a valid email address' });
    }
    const result = verifyOnly
      ? await verifySmtp()
      : await sendTestMail({ to, requestedBy: req.user?.email || req.user?.name });
    if (!result.ok) return res.status(502).json({ success: false, message: result.error, data: result });
    return res.status(200).json({
      success: true,
      message: verifyOnly ? 'SMTP login OK' : `Test email sent to ${result.to}`,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
