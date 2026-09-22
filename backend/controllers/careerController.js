import { getPool } from '../config/db.js';
import { notifyJobApplication } from '../services/mailer.js';

let fallbackApplications = [];

export const submitApplication = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      jobId,
      jobTitle,
      department,
      experience,
      location,
      qualification,
      currentCtc,
      expectedCtc,
      resumeUrl,
      notes
    } = req.body;

    if (!fullName || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Full name and phone number are required'
      });
    }

    const safeEmail = (email && email.trim()) ? email.trim() : `${phone.trim().replace(/\D/g, '') || Date.now()}@candidate.manebz.com`;
    const safeJobTitle = (jobTitle && jobTitle.trim()) ? jobTitle.trim() : 'General Candidate';

    const applicationId = `APP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Trigger async email notification in background
    notifyJobApplication({
      applicationId,
      fullName: fullName.trim(),
      email: safeEmail,
      phone: phone.trim(),
      jobId,
      jobTitle: safeJobTitle,
      department,
      experience,
      location,
      qualification,
      currentCtc,
      expectedCtc,
      resumeUrl,
      notes
    }).catch(err => {
      console.warn('⚠️ [Career] Email notification error:', err.message);
    });
    const pool = getPool();

    if (pool) {
      const query = `
        INSERT INTO job_applications (
          application_id, full_name, email, phone, job_id, job_title,
          department, experience, location, qualification, current_ctc,
          expected_ctc, resume_url, notes, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Under Review')
      `;

      const [result] = await pool.execute(query, [
        applicationId,
        fullName.trim(),
        safeEmail,
        phone.trim(),
        jobId || null,
        safeJobTitle,
        department || 'Operations',
        experience || 'Fresher / Entry',
        location || 'Delhi NCR',
        qualification || 'Graduate',
        currentCtc || null,
        expectedCtc || null,
        resumeUrl || null,
        notes || null
      ]);

      return res.status(201).json({
        success: true,
        message: 'Job application submitted successfully',
        data: {
          id: result.insertId,
          application_id: applicationId,
          full_name: fullName.trim(),
          email: safeEmail,
          phone: phone.trim(),
          job_title: safeJobTitle,
          status: 'Under Review',
          created_at: new Date().toISOString()
        }
      });
    } else {
      const record = {
        id: Date.now(),
        application_id: applicationId,
        full_name: fullName.trim(),
        email: safeEmail,
        phone: phone.trim(),
        job_id: jobId,
        job_title: safeJobTitle,
        department,
        experience,
        location,
        qualification,
        current_ctc: currentCtc,
        expected_ctc: expectedCtc,
        resume_url: resumeUrl,
        notes,
        status: 'Under Review',
        created_at: new Date().toISOString()
      };
      fallbackApplications.unshift(record);
      return res.status(201).json({ success: true, message: 'Application saved in memory', data: record });
    }
  } catch (error) {
    console.error('Error submitting application:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

export const getApplications = async (req, res) => {
  try {
    const pool = getPool();
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM job_applications ORDER BY created_at DESC');
      return res.status(200).json({ success: true, count: rows.length, data: rows });
    } else {
      return res.status(200).json({ success: true, count: fallbackApplications.length, data: fallbackApplications });
    }
  } catch (error) {
    console.error('Error fetching applications:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const pool = getPool();

    if (pool) {
      await pool.execute('UPDATE job_applications SET status = ? WHERE id = ? OR application_id = ?', [status, id, id]);
      return res.status(200).json({ success: true, message: 'Application status updated' });
    } else {
      fallbackApplications = fallbackApplications.map(item => (item.id == id || item.application_id === id) ? { ...item, status } : item);
      return res.status(200).json({ success: true, message: 'Status updated' });
    }
  } catch (error) {
    console.error('Error updating application status:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    if (pool) {
      await pool.execute('DELETE FROM job_applications WHERE id = ? OR application_id = ?', [id, id]);
      return res.status(200).json({ success: true, message: 'Application deleted' });
    } else {
      fallbackApplications = fallbackApplications.filter(item => item.id != id && item.application_id !== id);
      return res.status(200).json({ success: true, message: 'Application deleted' });
    }
  } catch (error) {
    console.error('Error deleting application:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
