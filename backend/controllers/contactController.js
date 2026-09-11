import { getPool } from '../config/db.js';

let fallbackMessages = [];

export const submitContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone, and message are required'
      });
    }

    const pool = getPool();
    if (pool) {
      const query = `
        INSERT INTO contact_messages (name, email, phone, subject, message)
        VALUES (?, ?, ?, ?, ?)
      `;
      const [result] = await pool.execute(query, [
        name.trim(),
        email.trim(),
        phone.trim(),
        subject ? subject.trim() : 'General Inquiry',
        message.trim()
      ]);

      return res.status(201).json({
        success: true,
        message: 'Your message has been sent successfully',
        data: {
          id: result.insertId,
          name,
          email,
          phone,
          subject,
          created_at: new Date().toISOString()
        }
      });
    } else {
      const record = {
        id: Date.now(),
        name,
        email,
        phone,
        subject: subject || 'General Inquiry',
        message,
        is_read: false,
        created_at: new Date().toISOString()
      };
      fallbackMessages.unshift(record);
      return res.status(201).json({ success: true, message: 'Message saved in fallback', data: record });
    }
  } catch (error) {
    console.error('Error submitting contact message:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

export const getContactMessages = async (req, res) => {
  try {
    const pool = getPool();
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
      return res.status(200).json({ success: true, count: rows.length, data: rows });
    } else {
      return res.status(200).json({ success: true, count: fallbackMessages.length, data: fallbackMessages });
    }
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
