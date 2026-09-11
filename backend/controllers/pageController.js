import { getPool } from '../config/db.js';

let fallbackPages = [];

export const getPages = async (req, res) => {
  try {
    const pool = getPool();
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM custom_pages ORDER BY created_at DESC');
      const pages = rows.map(r => ({
        id: r.page_id,
        title: r.title,
        slug: r.slug,
        subtitle: r.subtitle,
        badge: r.badge,
        sections: r.content_json ? JSON.parse(r.content_json) : [],
        showInNavbar: Boolean(r.show_in_navbar),
        isPublished: Boolean(r.is_published),
        createdAt: r.created_at
      }));
      return res.status(200).json({ success: true, count: pages.length, data: pages });
    } else {
      return res.status(200).json({ success: true, count: fallbackPages.length, data: fallbackPages });
    }
  } catch (error) {
    console.error('Error fetching pages:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const savePage = async (req, res) => {
  try {
    const { id, title, slug, subtitle, badge, sections, showInNavbar, isPublished } = req.body;

    if (!title || !slug) {
      return res.status(400).json({ success: false, message: 'Title and URL Slug are required' });
    }

    const pageId = id || `page-${Date.now()}`;
    const pool = getPool();

    if (pool) {
      const query = `
        INSERT INTO custom_pages (page_id, title, slug, subtitle, badge, content_json, show_in_navbar, is_published)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          title = VALUES(title),
          slug = VALUES(slug),
          subtitle = VALUES(subtitle),
          badge = VALUES(badge),
          content_json = VALUES(content_json),
          show_in_navbar = VALUES(show_in_navbar),
          is_published = VALUES(is_published)
      `;

      await pool.execute(query, [
        pageId,
        title.trim(),
        slug.trim().toLowerCase(),
        subtitle || null,
        badge || null,
        JSON.stringify(sections || []),
        showInNavbar !== false,
        isPublished !== false
      ]);

      return res.status(200).json({
        success: true,
        message: 'Page saved successfully',
        data: { id: pageId, title, slug, subtitle, badge, sections, showInNavbar, isPublished }
      });
    } else {
      const existingIdx = fallbackPages.findIndex(p => p.id === pageId || p.slug === slug);
      const pageObj = { id: pageId, title, slug, subtitle, badge, sections, showInNavbar, isPublished };
      if (existingIdx >= 0) {
        fallbackPages[existingIdx] = pageObj;
      } else {
        fallbackPages.push(pageObj);
      }
      return res.status(200).json({ success: true, message: 'Page saved in fallback', data: pageObj });
    }
  } catch (error) {
    console.error('Error saving custom page:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

export const deletePage = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    if (pool) {
      await pool.execute('DELETE FROM custom_pages WHERE page_id = ? OR slug = ?', [id, id]);
      return res.status(200).json({ success: true, message: 'Page deleted' });
    } else {
      fallbackPages = fallbackPages.filter(p => p.id !== id && p.slug !== id);
      return res.status(200).json({ success: true, message: 'Page deleted from fallback' });
    }
  } catch (error) {
    console.error('Error deleting page:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
