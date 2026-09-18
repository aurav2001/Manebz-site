/**
 * MANABS / MANEBZ — Content Seeder
 *
 * Pushes the site's default content into MySQL through the running API, so the admin
 * panel opens with every box populated instead of falling back to the values compiled
 * into the frontend bundle.
 *
 * Usage:
 *   node seed.js                          # seeds http://localhost:5000/api
 *   node seed.js https://manebz.com/api   # seeds a deployed server
 *
 * Safe to re-run: single-record endpoints upsert by id, list endpoints replace the list.
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });
const API_BASE = (process.argv[2] || 'http://localhost:5000/api').replace(/\/+$/, '');

// The defaults live with the frontend, which is the single source of truth for them.
const DATA_DIR = path.resolve(__dirname, '../frontend/src/data');

const loadData = async () => {
  const company = await import(pathToFileURL(path.join(DATA_DIR, 'companyData.js')).href);
  const blog = await import(pathToFileURL(path.join(DATA_DIR, 'blogData.js')).href);
  return { company, blog };
};

// Content writes are admin-only, so the seeder logs in first.
let authToken = '';

const login = async (password) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.token) {
    throw new Error(body.message || `login failed with status ${res.status}`);
  }
  authToken = body.token;
};

const send = async (endpoint, body) => {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
    },
    body: JSON.stringify(body)
  });
  const text = await res.text();
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = { raw: text.slice(0, 200) };
  }
  if (!res.ok || parsed.success === false) {
    throw new Error(`${res.status} ${parsed.message || parsed.raw || 'unknown error'}`);
  }
  return parsed;
};

const step = async (label, fn) => {
  process.stdout.write(`  ${label.padEnd(24)} `);
  try {
    const n = await fn();
    console.log(`✅ ${n}`);
    return true;
  } catch (err) {
    console.log(`❌ ${err.message}`);
    return false;
  }
};

const run = async () => {
  console.log(`\n🌱 Seeding MANABS content → ${API_BASE}\n`);

  const health = await fetch(`${API_BASE}/health`).then(r => r.json()).catch(() => null);
  if (!health) {
    console.error(`❌ Cannot reach ${API_BASE}/health — is the server running?\n`);
    process.exit(1);
  }
  console.log(`   Server: ${health.status} | DB: ${health.database}\n`);
  if (!/Connected/i.test(health.database || '')) {
    if (process.env.SEED_ALLOW_FALLBACK !== '1') {
      console.error('❌ MySQL is not connected. Seeding would only fill in-memory fallback.');
      console.error('   Set SEED_ALLOW_FALLBACK=1 to seed anyway (useful for a dry run).\n');
      process.exit(1);
    }
    console.warn('⚠️  MySQL is down — seeding in-memory fallback only (dry run).\n');
  }

  // Password comes from ADMIN_PASSWORD in backend/.env, or SEED_ADMIN_PASSWORD when
  // seeding a server whose password differs from the local one.
  const password = process.env.SEED_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;
  if (!password) {
    console.error('❌ No admin password found. Set ADMIN_PASSWORD in backend/.env');
    console.error('   or run with SEED_ADMIN_PASSWORD=... node seed.js <api-url>\n');
    process.exit(1);
  }

  try {
    await login(password);
    console.log('   Authenticated as admin ✅\n');
  } catch (err) {
    console.error(`❌ Admin login failed: ${err.message}`);
    console.error('   Check that ADMIN_PASSWORD here matches the server\'s .env\n');
    process.exit(1);
  }

  const { company, blog } = await loadData();
  const results = [];

  // --- Services (one upsert per record) ---
  results.push(await step('Services', async () => {
    for (const s of company.servicesData) {
      await send('/content/services', {
        ...s,
        desc: s.shortDesc,
        fullDesc: s.description,
        deliverables: s.features || [],
        technicalSpecs: s.rolesCovered || [],
        tags: [s.category].filter(Boolean),
        isActive: true
      });
    }
    return `${company.servicesData.length} records`;
  }));

  // --- Jobs (one upsert per record) ---
  results.push(await step('Job openings', async () => {
    for (const j of company.jobOpenings) {
      await send('/content/jobs', {
        ...j,
        ctc: j.salary,
        vacancies: String(j.openingsCount ?? '2'),
        requirements: [...(j.qualifications || []), ...(j.skills || [])],
        isActive: true
      });
    }
    return `${company.jobOpenings.length} records`;
  }));

  // --- Blogs (one upsert per record) ---
  results.push(await step('Blog posts', async () => {
    for (const b of blog.initialBlogPosts) {
      await send('/content/blogs', { ...b, date: b.publishedDate });
    }
    return `${blog.initialBlogPosts.length} records`;
  }));

  // --- List endpoints (whole list replaced in one transaction) ---
  results.push(await step('Company stats', async () => {
    await send('/content/stats', company.companyStats.map((s, i) => ({ ...s, id: `stat-${i + 1}` })));
    return `${company.companyStats.length} records`;
  }));

  results.push(await step('Milestones', async () => {
    await send('/content/milestones', company.companyMilestones.map((m, i) => ({ ...m, id: `ms-${i + 1}` })));
    return `${company.companyMilestones.length} records`;
  }));

  results.push(await step('Core values', async () => {
    await send('/content/values', company.coreValues);
    return `${company.coreValues.length} records`;
  }));

  results.push(await step('Compliances', async () => {
    await send('/content/compliances', company.statutoryCompliances.map((c, i) => ({ ...c, id: `cmp-${i + 1}` })));
    return `${company.statutoryCompliances.length} records`;
  }));

  results.push(await step('Testimonials', async () => {
    await send('/content/testimonials', company.testimonialsData);
    return `${company.testimonialsData.length} records`;
  }));

  results.push(await step('Navbar items', async () => {
    const nav = [
      { id: 'nav-1', label: 'HOME', path: 'home', type: 'internal', isVisible: true, isHot: false },
      { id: 'nav-2', label: 'ABOUT', path: 'about', type: 'internal', isVisible: true, isHot: false },
      { id: 'nav-3', label: 'SERVICES', path: 'services', type: 'services-dropdown', isVisible: true, isHot: false },
      { id: 'nav-4', label: 'PAYROLL', path: 'payroll', type: 'internal', isVisible: true, isHot: true },
      { id: 'nav-5', label: 'CAREERS', path: 'careers', type: 'internal', isVisible: true, isHot: false },
      { id: 'nav-6', label: 'CONTACT', path: 'contact', type: 'internal', isVisible: true, isHot: false }
    ];
    await send('/content/nav', nav);
    return `${nav.length} records`;
  }));

  // --- Custom page ---
  results.push(await step('Custom pages', async () => {
    const page = JSON.parse(await readFile(path.join(__dirname, 'seed-pages.json'), 'utf-8'));
    for (const p of page) await send('/pages', p);
    return `${page.length} records`;
  }));

  const failed = results.filter(ok => !ok).length;
  console.log(
    failed === 0
      ? '\n✅ Seed complete — every content section now has data in MySQL.\n'
      : `\n⚠️  Seed finished with ${failed} failed section(s). See the ❌ lines above.\n`
  );
  process.exit(failed === 0 ? 0 : 1);
};

run().catch(err => {
  console.error('\n❌ Seeder crashed:', err.message, '\n');
  process.exit(1);
});
