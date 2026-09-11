/**
 * Unified API Client for MANABS Enterprise Frontend
 * Seamlessly connects to Node.js / Express / MySQL Backend with intelligent fallback
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || (
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : '/api'
);

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }
    return data;
  } catch (error) {
    console.warn(`[API CLIENT] Call failed on ${endpoint}:`, error.message);
    throw error;
  }
}

export const api = {
  // System Health
  health: () => request('/health'),

  // Services CMS
  services: {
    getAll: () => request('/content/services'),
    save: (service) => request('/content/services', { method: 'POST', body: service }),
    delete: (id) => request(`/content/services/${id}`, { method: 'DELETE' }),
  },

  // Jobs / Openings CMS
  jobs: {
    getAll: () => request('/content/jobs'),
    save: (job) => request('/content/jobs', { method: 'POST', body: job }),
    delete: (id) => request(`/content/jobs/${id}`, { method: 'DELETE' }),
  },

  // Company Stats
  stats: {
    getAll: () => request('/content/stats'),
    saveAll: (stats) => request('/content/stats', { method: 'POST', body: stats }),
  },

  // Statutory Compliances
  compliances: {
    getAll: () => request('/content/compliances'),
    saveAll: (compliances) => request('/content/compliances', { method: 'POST', body: compliances }),
  },

  // Testimonials
  testimonials: {
    getAll: () => request('/content/testimonials'),
    saveAll: (list) => request('/content/testimonials', { method: 'POST', body: list }),
  },

  // Blogs & Insights
  blogs: {
    getAll: () => request('/content/blogs'),
    save: (blog) => request('/content/blogs', { method: 'POST', body: blog }),
    delete: (id) => request(`/content/blogs/${id}`, { method: 'DELETE' }),
  },

  // Navbar Menu Items
  navItems: {
    getAll: () => request('/content/nav'),
    saveAll: (nav) => request('/content/nav', { method: 'POST', body: nav }),
  },

  // Proposal Inquiries
  inquiries: {
    create: (data) => request('/inquiries', { method: 'POST', body: data }),
    getAll: () => request('/inquiries'),
    updateStatus: (id, status) => request(`/inquiries/${id}`, { method: 'PATCH', body: { status } }),
    delete: (id) => request(`/inquiries/${id}`, { method: 'DELETE' }),
  },

  // Career Job Applications
  careers: {
    submit: (data) => request('/careers', { method: 'POST', body: data }),
    getAll: () => request('/careers'),
    updateStatus: (id, status) => request(`/careers/${id}`, { method: 'PATCH', body: { status } }),
    delete: (id) => request(`/careers/${id}`, { method: 'DELETE' }),
  },

  // Contact Form Messages
  contact: {
    submit: (data) => request('/contact', { method: 'POST', body: data }),
    getAll: () => request('/contact'),
  },

  // Custom CMS Pages
  pages: {
    getAll: () => request('/pages'),
    save: (page) => request('/pages', { method: 'POST', body: page }),
    delete: (id) => request(`/pages/${id}`, { method: 'DELETE' }),
  },

  // Admin Settings
  settings: {
    get: () => request('/settings'),
    save: (settings) => request('/settings', { method: 'POST', body: settings }),
  }
};

export default api;
