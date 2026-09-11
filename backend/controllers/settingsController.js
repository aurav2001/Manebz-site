import { getPool } from '../config/db.js';

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
