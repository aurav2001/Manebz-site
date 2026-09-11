import { getPool } from '../config/db.js';

// In-memory fallback if MySQL is offline during setup
let fallbackInquiries = [];

export const createInquiry = async (req, res) => {
  try {
    const { name, phone, email, service, message, source } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and Phone number are required' });
    }

    const inquiryId = `INQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const pool = getPool();

    if (pool) {
      const query = `
        INSERT INTO inquiries (inquiry_id, name, phone, email, service, message, source, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'New Lead')
      `;
      const [result] = await pool.execute(query, [
        inquiryId,
        name.trim(),
        phone.trim(),
        email ? email.trim() : null,
        service || 'HR STAFFING & PAYROLL MANAGEMENT',
        message ? message.trim() : null,
        source || 'Website Modal'
      ]);

      return res.status(201).json({
        success: true,
        message: 'Inquiry submitted successfully',
        data: {
          id: result.insertId,
          inquiry_id: inquiryId,
          name,
          phone,
          email,
          service,
          status: 'New Lead',
          created_at: new Date().toISOString()
        }
      });
    } else {
      // Fallback
      const record = {
        id: Date.now(),
        inquiry_id: inquiryId,
        name,
        phone,
        email,
        service: service || 'HR STAFFING & PAYROLL MANAGEMENT',
        message,
        source: source || 'Website Modal',
        status: 'New Lead',
        created_at: new Date().toISOString()
      };
      fallbackInquiries.unshift(record);
      return res.status(201).json({ success: true, message: 'Inquiry saved in memory fallback', data: record });
    }
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

export const getInquiries = async (req, res) => {
  try {
    const pool = getPool();
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM inquiries ORDER BY created_at DESC');
      return res.status(200).json({ success: true, count: rows.length, data: rows });
    } else {
      return res.status(200).json({ success: true, count: fallbackInquiries.length, data: fallbackInquiries });
    }
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const pool = getPool();
    if (pool) {
      await pool.execute('UPDATE inquiries SET status = ? WHERE id = ? OR inquiry_id = ?', [status, id, id]);
      return res.status(200).json({ success: true, message: 'Inquiry status updated' });
    } else {
      fallbackInquiries = fallbackInquiries.map(item => (item.id == id || item.inquiry_id === id) ? { ...item, status } : item);
      return res.status(200).json({ success: true, message: 'Status updated in fallback' });
    }
  } catch (error) {
    console.error('Error updating inquiry:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    if (pool) {
      await pool.execute('DELETE FROM inquiries WHERE id = ? OR inquiry_id = ?', [id, id]);
      return res.status(200).json({ success: true, message: 'Inquiry deleted' });
    } else {
      fallbackInquiries = fallbackInquiries.filter(item => item.id != id && item.inquiry_id !== id);
      return res.status(200).json({ success: true, message: 'Inquiry deleted from fallback' });
    }
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
