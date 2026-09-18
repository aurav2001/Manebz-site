/**
 * Unified API Client for MANEBZ Enterprise Frontend
 * Seamlessly connects to Node.js / Express / MySQL Backend with intelligent fallback
 */

// In production the API is served from the same origin under /api, so a relative
// base works for every domain the site is reachable on. Override with VITE_API_URL
// only when the API genuinely lives somewhere else.
const isLocalhost = typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname);

const API_BASE_URL = import.meta.env.VITE_API_URL || (isLocalhost ? 'http://localhost:5000/api' : '/api');

// --- Admin token ---------------------------------------------------------------
// Kept in sessionStorage so it dies with the tab; the server is the real gate either way.
const TOKEN_KEY = 'manabs_admin_token';

export const getToken = () => {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
};

export const setToken = (token) => {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // Private mode / blocked storage: the session simply won't survive a reload.
  }
};

// Lets the admin page react to an expired or revoked token without every call site
// having to inspect the error.
let onAuthExpired = null;
export const setAuthExpiredHandler = (fn) => { onAuthExpired = fn; };

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
      if (response.status === 401) {
        // Token gone stale — drop it so the panel stops pretending to be logged in.
        setToken('');
        if (onAuthExpired) onAuthExpired();
      }
      const error = new Error(data.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      throw error;
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

  // Panel Authentication (admin / hr / recruiter)
  auth: {
    login: async (email, password) => {
      const res = await request('/auth/login', { method: 'POST', body: { email, password } });
      setToken(res.token);
      return res;
    },
    logout: () => setToken(''),
    // Resolves only if the stored token is still valid on the server.
    verify: () => request('/auth/me'),
    hasToken: () => Boolean(getToken()),
    changePassword: (currentPassword, newPassword) =>
      request('/auth/change-password', { method: 'POST', body: { currentPassword, newPassword } }),
    forgot: (email) => request('/auth/forgot', { method: 'POST', body: { email } }),
    resetWithToken: (token, newPassword) =>
      request('/auth/reset', { method: 'POST', body: { token, newPassword } }),
  },

  // Panel user accounts — admin manages everyone, HR manages recruiters
  users: {
    getAll: () => request('/users'),
    create: (user) => request('/users', { method: 'POST', body: user }),
    update: (id, patch) => request(`/users/${id}`, { method: 'PATCH', body: patch }),
    delete: (id) => request(`/users/${id}`, { method: 'DELETE' }),
    resetPassword: (id, password) =>
      request(`/users/${id}/reset-password`, { method: 'POST', body: password ? { password } : {} }),
    resetRequests: () => request('/users/reset-requests'),
    dismissRequest: (id) => request(`/users/reset-requests/${id}`, { method: 'DELETE' }),
  },

  // Staffing requirements raised by client companies
  hiringRequests: {
    // Public — the website form posts here without a login.
    create: (data) => request('/hiring-requests', { method: 'POST', body: data }),
    getAll: () => request('/hiring-requests'),
    update: (id, patch) => request(`/hiring-requests/${id}`, { method: 'PATCH', body: patch }),
    delete: (id) => request(`/hiring-requests/${id}`, { method: 'DELETE' }),
    stats: () => request('/hiring-requests/stats'),
  },

  // Client companies recruiters source staff for
  companies: {
    getAll: () => request('/companies'),
    save: (company) => request('/companies', { method: 'POST', body: company }),
    delete: (id) => request(`/companies/${id}`, { method: 'DELETE' }),
    breakdown: () => request('/companies/breakdown'),
  },

  // Placement records logged by recruiters
  employees: {
    getAll: () => request('/employees'),
    save: (record) => request('/employees', { method: 'POST', body: record }),
    delete: (id) => request(`/employees/${id}`, { method: 'DELETE' }),
    stats: () => request('/employees/stats'),
  },

  // Media Library
  uploads: {
    // `dataUrl` is a base64 data URL; the admin panel shrinks the file before sending.
    create: (dataUrl) => request('/uploads', { method: 'POST', body: { data: dataUrl } }),
    getAll: () => request('/uploads'),
    delete: (name) => request(`/uploads/${encodeURIComponent(name)}`, { method: 'DELETE' }),
  },

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

  // Company Milestones
  milestones: {
    getAll: () => request('/content/milestones'),
    saveAll: (list) => request('/content/milestones', { method: 'POST', body: list }),
  },

  // Core Values
  coreValues: {
    getAll: () => request('/content/values'),
    saveAll: (list) => request('/content/values', { method: 'POST', body: list }),
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

  // Editable page sections (hero slides, headings, banner copy) keyed by page
  sections: {
    get: (key) => request(`/content/sections/${encodeURIComponent(key)}`),
    save: (key, data) => request(`/content/sections/${encodeURIComponent(key)}`, {
      method: 'POST',
      body: data,
    }),
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
