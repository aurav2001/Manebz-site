/**
 * Editable home page content.
 *
 * These are the defaults the site ships with. Whatever the admin panel saves is merged
 * over them, so a half-filled section still renders and adding a field here later does
 * not break pages that were saved before it existed.
 */

export const defaultHomeContent = {
  hero: {
    slides: [
      {
        id: 'slide-1',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
        title: 'Integrated Facilities Management',
        tagline: 'Modern Corporate Infrastructure & Soft Services Governance',
        badge: 'Integrated Facilities',
      },
      {
        id: 'slide-2',
        image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2074&auto=format&fit=crop',
        title: 'Corporate Staffing & Payroll',
        tagline: '100% Statutory Compliant Workforce & Resource Cell',
        badge: 'Staffing & Payroll',
      },
      {
        id: 'slide-3',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop',
        title: 'Logistics & Warehousing',
        tagline: 'JIT Supply Chain & Certified Operations Crew',
        badge: 'Logistics Operations',
      },
      {
        id: 'slide-4',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=2070&auto=format&fit=crop',
        title: 'Engineering & Maintenance (MEP)',
        tagline: '24/7/365 HVAC, Electrical & Facility Uptime Governance',
        badge: 'Engineering & MEP',
      },
    ],
    eyebrow: 'Founded Feb 27, 2014 • Delhi NCR • North India',
    headingLine1: 'Strategic Facilities Management &',
    headingHighlight: 'Skilled Workforce Solutions',
    subtext:
      'Delivering state-of-the-art machines, bio-friendly consumables, trained personnel, and 100% statutory compliance (PF, ESI, PAN) 24/7/365.',
  },

  servicesIntro: {
    eyebrow: 'Corporate Solutions',
    headingBefore: 'Comprehensive',
    headingHighlight: 'Facilities & Staffing',
    headingAfter: 'Ecosystem',
    subtext:
      'Tailored corporate services designed to accelerate business productivity, guarantee 100% statutory compliance, and ensure robust operational security.',
  },

  workflow: {
    eyebrow: 'Operational Rigor',
    heading: 'How MANEBZ Operates',
    subtext: 'A systematic 4-step framework guaranteeing zero time-lag and 100% compliance.',
    steps: [
      {
        id: 'step-1',
        step: 'Step 01',
        title: 'Consultation & Site Audit',
        desc: 'Understanding your corporate facilities, workforce volume, logistics flow, and statutory compliance needs.',
      },
      {
        id: 'step-2',
        step: 'Step 02',
        title: 'Resource Cell Screening',
        desc: 'Rigorous selection and mandatory 2-week training including 6-8 days induction for all personnel.',
      },
      {
        id: 'step-3',
        step: 'Step 03',
        title: 'Bio-Friendly Deployment',
        desc: 'Mobilization of state-of-the-art machines, eco-friendly consumables, and manager-level supervisors.',
      },
      {
        id: 'step-4',
        step: 'Step 04',
        title: '24/7 Operations & QA Audits',
        desc: 'Round-the-clock facility uptime, ISO/EMS checklists, JIT replenishment, and unannounced surprise visits.',
      },
    ],
  },

  qaBanner: {
    eyebrow: '100% Statutory Adherence & Quality Assurance',
    heading: 'PF, ESI, PAN & Service Tax Registered with ISO & EMS Quality Management',
    text:
      'We implement structured location checklists, Suggestion Registers, JIT replenishment, and surprise field audits by senior leadership to ensure flawless 24/7 operations.',
    chips: [
      'P.F. Registration',
      'E.S.I. Registration',
      'PAN Compliant',
      'GST / Tax Adherence',
      'ISO & EMS Audits',
      'JIT System',
    ],
  },
};

/**
 * Merges saved content over the defaults one level deep, so a section the admin has
 * never touched keeps its default copy instead of rendering blank.
 */
export const mergeHomeContent = (saved) => {
  if (!saved || typeof saved !== 'object') return defaultHomeContent;

  const merged = { ...defaultHomeContent };
  for (const key of Object.keys(defaultHomeContent)) {
    merged[key] = { ...defaultHomeContent[key], ...(saved[key] || {}) };
  }
  return merged;
};

export default defaultHomeContent;
