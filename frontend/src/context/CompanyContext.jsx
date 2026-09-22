import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  servicesData as defaultServices,
  jobOpenings as defaultJobs,
  companyStats as defaultStats,
  companyMilestones as defaultMilestones,
  coreValues as defaultValues,
  statutoryCompliances as defaultCompliances,
  qualityAssurancePoints as defaultQA,
  regionsServed as defaultRegions,
  employeePerks as defaultPerks,
  testimonialsData as defaultTestimonials
} from '../data/companyData';
import { initialBlogPosts } from '../data/blogData';
import { defaultHomeContent, mergeHomeContent } from '../data/homeContent';
import { defaultContactInfo, mergeContactInfo } from '../data/siteContact';
import { dispatchNotificationAlert } from '../services/notificationService';
import api from '../api/client';

const CompanyContext = createContext();

const STORAGE_KEYS = {
  SERVICES: 'manabs_dynamic_services',
  JOBS: 'manabs_dynamic_job_openings',
  STATS: 'manabs_dynamic_stats',
  MILESTONES: 'manabs_dynamic_milestones',
  VALUES: 'manabs_dynamic_values',
  COMPLIANCES: 'manabs_dynamic_compliances',
  QA_POINTS: 'manabs_dynamic_qa_points',
  REGIONS: 'manabs_dynamic_regions',
  PERKS: 'manabs_dynamic_perks',
  TESTIMONIALS: 'manabs_dynamic_testimonials',
  INQUIRIES: 'manabs_quote_inquiries',
  APPLICATIONS: 'manabs_direct_applications',
  TALENT_VAULT: 'manabs_future_talent_bank',
  PAGES: 'manabs_dynamic_custom_pages',
  NAV_ITEMS: 'manabs_dynamic_nav_items',
  BLOGS: 'manabs_dynamic_blogs',
  NOTIFICATIONS: 'manabs_notifications_log',
  EMAIL_SETTINGS: 'manabs_email_settings'
};

const defaultCustomPages = [
  {
    id: 'page-1',
    title: 'Statutory Compliance & Standards',
    slug: 'statutory-compliance',
    badge: 'Statutory Governance',
    heroTagline: '100% Statutory Compliant Facility Management & Workforce Operations',
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
    content: 'MANEBZ operates on strict compliance pillars ensuring every deployed team member is covered by mandatory PF, ESI, Group Medical Insurance, and national labor laws. We provide automated challans, monthly compliance dockets, and verified biometric logs.',
    sections: [
      {
        heading: '100% PF & ESI Statutory Governance',
        text: 'Zero-liability guarantee for client enterprises. Verified challan proofs are submitted before the 15th of every operational month.'
      },
      {
        heading: 'ISO & Bio-Friendly Facility Upkeep',
        text: 'State-of-the-art machinery and eco-certified chemicals ensuring top tier hygiene without environmental degradation.'
      },
      {
        heading: '24/7 Rapid Escalation Desk',
        text: 'Dedicated site operational managers and 24x7 control center hotline for immediate emergency mobilization across Delhi NCR, UP, Haryana & Uttarakhand.'
      }
    ],
    showInNavbar: true,
    isPublished: true,
    createdAt: '2026-09-08T10:00:00.000Z'
  }
];

const defaultNavItems = [
  { id: 'nav-1', label: 'HOME', path: 'home', type: 'internal', isVisible: true, isHot: false, order: 1 },
  { id: 'nav-2', label: 'ABOUT', path: 'about', type: 'internal', isVisible: true, isHot: false, order: 2 },
  { id: 'nav-3', label: 'SERVICES', path: 'services', type: 'services-dropdown', isVisible: true, isHot: false, order: 3 },
  { id: 'nav-4', label: 'PAYROLL', path: 'payroll', type: 'internal', isVisible: true, isHot: true, order: 4 },
  { id: 'nav-5', label: 'CAREERS', path: 'careers', type: 'internal', isVisible: true, isHot: false, order: 5 },
  { id: 'nav-6', label: 'CONTACT', path: 'contact', type: 'internal', isVisible: true, isHot: false, order: 6 },
];

const defaultEmailSettings = {
  adminEmail: 'info@manebz.com',
  enableInstantAlerts: true,
  enableBrowserPush: true,
  enableSoundChime: true,
  webhookUrl: '',
  emailJsServiceId: '',
  emailJsTemplateId: '',
  emailJsPublicKey: ''
};

const getStored = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed.length > 0 ? parsed : fallback;
      if (typeof parsed === 'object' && parsed !== null) return parsed;
    }
  } catch (e) {
    console.error(e);
  }
  return fallback;
};

export const CompanyProvider = ({ children }) => {
  // 1. Data States
  const [services, setServices] = useState(() => getStored(STORAGE_KEYS.SERVICES, defaultServices));
  const [jobs, setJobs] = useState(() => getStored(STORAGE_KEYS.JOBS, defaultJobs));
  const [companyStats, setCompanyStats] = useState(() => getStored(STORAGE_KEYS.STATS, defaultStats));
  const [milestones, setMilestones] = useState(() => getStored(STORAGE_KEYS.MILESTONES, defaultMilestones));
  const [coreValues, setCoreValues] = useState(() => getStored(STORAGE_KEYS.VALUES, defaultValues));
  const [statutoryCompliances, setStatutoryCompliances] = useState(() => getStored(STORAGE_KEYS.COMPLIANCES, defaultCompliances));
  const [qualityAssurancePoints, setQualityAssurancePoints] = useState(() => getStored(STORAGE_KEYS.QA_POINTS, defaultQA));
  const [regionsServed, setRegionsServed] = useState(() => getStored(STORAGE_KEYS.REGIONS, defaultRegions));
  const [employeePerks, setEmployeePerks] = useState(() => getStored(STORAGE_KEYS.PERKS, defaultPerks));
  const [testimonials, setTestimonials] = useState(() => getStored(STORAGE_KEYS.TESTIMONIALS, defaultTestimonials));
  const [customPages, setCustomPages] = useState(() => getStored(STORAGE_KEYS.PAGES, defaultCustomPages));
  const [navItems, setNavItems] = useState(() => defaultNavItems);
  // Editable home page copy, merged over the shipped defaults.
  const [homeContent, setHomeContent] = useState(defaultHomeContent);
  // Contact details, shared by the footer, contact page and chat widget.
  const [contactInfo, setContactInfo] = useState(defaultContactInfo);
  const [blogs, setBlogs] = useState(() => getStored(STORAGE_KEYS.BLOGS, initialBlogPosts));
  
  // 2. Email / Webhook Settings
  const [emailSettings, setEmailSettings] = useState(() => getStored(STORAGE_KEYS.EMAIL_SETTINGS, defaultEmailSettings));

  // 3. Notification Log
  const [notifications, setNotifications] = useState(() => getStored(STORAGE_KEYS.NOTIFICATIONS, [
    {
      id: 'notif-init-1',
      type: 'inquiry',
      title: 'New Quote Inquiry',
      message: 'Apex Business Park requested quote for Integrated Facility Management',
      time: new Date(Date.now() - 3600000).toISOString(),
      read: false
    },
    {
      id: 'notif-init-2',
      type: 'application',
      title: 'New Candidate Applied',
      message: 'Vikram Singh applied for Facility Operations Manager',
      time: new Date(Date.now() - 7200000).toISOString(),
      read: false
    }
  ]));

  // 4. Backend Sync Status
  // Every save used to swallow its rejection, so a write that never reached MySQL
  // looked exactly like a successful one — the change survived in localStorage on this
  // browser and was invisible to everyone else. Record the failure instead.
  const [syncError, setSyncError] = useState(null);
  // Flips once the first backend fetch settles. A page that only exists in MySQL is
  // absent on the very first render, so "not found" must wait for this.
  const [contentLoaded, setContentLoaded] = useState(false);

  const trackSyncError = (err) => {
    console.error('[MANEBZ SYNC] Backend save failed:', err);
    setSyncError({
      message: err?.message || 'Backend sync failed',
      time: new Date().toISOString()
    });
  };

  const clearSyncError = () => setSyncError(null);

  // Home page copy. Saved whole so a partial edit never drops the other sections.
  const updateHomeContent = (patch) => {
    setHomeContent((prev) => {
      const next = mergeHomeContent({ ...prev, ...patch });
      api.sections.save('home', next).catch(trackSyncError);
      return next;
    });
  };

  const resetHomeContent = () => {
    setHomeContent(defaultHomeContent);
    api.sections.save('home', defaultHomeContent).catch(trackSyncError);
  };

  // Core values already have their own table and endpoint; the About page's QA points
  // and regions have neither, so they ride in the generic "about" section instead of
  // needing two more tables.
  const updateCoreValues = (list) => {
    setCoreValues(list);
    api.coreValues.saveAll(list).catch(trackSyncError);
  };

  const updateAboutContent = (patch) => {
    const next = {
      qaPoints: patch.qaPoints ?? qualityAssurancePoints,
      regions: patch.regions ?? regionsServed,
    };
    setQualityAssurancePoints(next.qaPoints);
    setRegionsServed(next.regions);
    api.sections.save('about', next).catch(trackSyncError);
  };

  const updateContactInfo = (patch) => {
    setContactInfo((prev) => {
      const next = mergeContactInfo({ ...prev, ...patch });
      api.sections.save('contact', next).catch(trackSyncError);
      return next;
    });
  };

  const resetContactInfo = () => {
    setContactInfo(defaultContactInfo);
    api.sections.save('contact', defaultContactInfo).catch(trackSyncError);
  };

  // Auto-persist settings & data
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(customPages)); }, [customPages]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.NAV_ITEMS, JSON.stringify(navItems)); }, [navItems]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(blogs)); }, [blogs]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.EMAIL_SETTINGS, JSON.stringify(emailSettings)); }, [emailSettings]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications)); }, [notifications]);

  // Hydrate Data from MySQL Backend on Initial Load
  useEffect(() => {
    const hydrateFromBackend = async () => {
      try {
        const [srvRes, jobRes, statRes, msRes, valRes, cmpRes, tstRes, blogRes, navRes, homeRes, contactRes, aboutRes, pageRes, inqRes, appRes, setRes] = await Promise.allSettled([
          api.services.getAll(),
          api.jobs.getAll(),
          api.stats.getAll(),
          api.milestones.getAll(),
          api.coreValues.getAll(),
          api.compliances.getAll(),
          api.testimonials.getAll(),
          api.blogs.getAll(),
          api.navItems.getAll(),
          api.sections.get('home'),
          api.sections.get('contact'),
          api.sections.get('about'),
          api.pages.getAll(),
          api.inquiries.getAll(),
          api.careers.getAll(),
          api.settings.get()
        ]);

        if (srvRes.status === 'fulfilled' && srvRes.value?.data?.length > 0) setServices(srvRes.value.data);
        if (jobRes.status === 'fulfilled' && jobRes.value?.data?.length > 0) setJobs(jobRes.value.data);
        if (statRes.status === 'fulfilled' && statRes.value?.data?.length > 0) setCompanyStats(statRes.value.data);
        if (msRes.status === 'fulfilled' && msRes.value?.data?.length > 0) setMilestones(msRes.value.data);
        if (valRes.status === 'fulfilled' && valRes.value?.data?.length > 0) setCoreValues(valRes.value.data);
        if (cmpRes.status === 'fulfilled' && cmpRes.value?.data?.length > 0) setStatutoryCompliances(cmpRes.value.data);
        if (tstRes.status === 'fulfilled' && tstRes.value?.data?.length > 0) setTestimonials(tstRes.value.data);
        if (blogRes.status === 'fulfilled' && blogRes.value?.data?.length > 0) setBlogs(blogRes.value.data);
        if (navRes.status === 'fulfilled' && navRes.value?.data?.length > 0) setNavItems(navRes.value.data);
        if (homeRes.status === 'fulfilled' && homeRes.value?.data) {
          setHomeContent(mergeHomeContent(homeRes.value.data));
        }
        if (contactRes.status === 'fulfilled' && contactRes.value?.data) {
          setContactInfo(mergeContactInfo(contactRes.value.data));
        }
        if (aboutRes.status === 'fulfilled' && aboutRes.value?.data) {
          const a = aboutRes.value.data;
          if (a.qaPoints?.length > 0) setQualityAssurancePoints(a.qaPoints);
          if (a.regions?.length > 0) setRegionsServed(a.regions);
        }
        if (pageRes.status === 'fulfilled' && pageRes.value?.data?.length > 0) setCustomPages(pageRes.value.data);
        if (inqRes.status === 'fulfilled' && inqRes.value?.data?.length > 0) {
          setInquiries(inqRes.value.data.map(i => ({
            id: i.inquiry_id || `INQ-${i.id}`,
            name: i.name,
            phone: i.phone,
            email: i.email,
            service: i.service,
            status: i.status,
            message: i.message,
            source: i.source,
            date: i.created_at
          })));
        }
        if (appRes.status === 'fulfilled' && appRes.value?.data?.length > 0) {
          setJobApplications(appRes.value.data.map(a => ({
            refId: a.application_id || `MNB-APP-${a.id}`,
            fullName: a.full_name,
            email: a.email,
            phone: a.phone,
            jobTitle: a.job_title,
            department: a.department,
            status: a.status,
            stage: a.status,
            experience: a.experience,
            location: a.location,
            qualification: a.qualification,
            currentCtc: a.current_ctc,
            expectedCtc: a.expected_ctc,
            resumeUrl: a.resume_url,
            notes: a.notes,
            date: a.created_at
          })));
        }
        if (setRes.status === 'fulfilled' && Object.keys(setRes.value?.data || {}).length > 0) {
          setEmailSettings(prev => ({ ...prev, ...setRes.value.data }));
        }
      } catch (err) {
        console.debug('Backend hydration skipped/offline:', err.message);
      } finally {
        setContentLoaded(true);
      }
    };

    hydrateFromBackend();
  }, []);

  // Leads, applications and settings are admin-only reads, so the load above gets a 401
  // for them on a normal visit. The panel calls this once the admin actually logs in.
  const refreshAdminData = async () => {
    const [inqRes, appRes, setRes] = await Promise.allSettled([
      api.inquiries.getAll(),
      api.careers.getAll(),
      api.settings.get()
    ]);

    if (inqRes.status === 'fulfilled' && inqRes.value?.data?.length > 0) {
      setInquiries(inqRes.value.data.map(i => ({
        id: i.inquiry_id || `INQ-${i.id}`,
        name: i.name,
        phone: i.phone,
        email: i.email,
        service: i.service,
        status: i.status,
        message: i.message,
        source: i.source,
        date: i.created_at
      })));
    }
    if (appRes.status === 'fulfilled' && appRes.value?.data?.length > 0) {
      setJobApplications(appRes.value.data.map(a => ({
        refId: a.application_id || `MNB-APP-${a.id}`,
        fullName: a.full_name,
        email: a.email,
        phone: a.phone,
        jobTitle: a.job_title,
        department: a.department,
        status: a.status,
        stage: a.status,
        experience: a.experience,
        location: a.location,
        qualification: a.qualification,
        currentCtc: a.current_ctc,
        expectedCtc: a.expected_ctc,
        resumeUrl: a.resume_url,
        notes: a.notes,
        date: a.created_at
      })));
    }
    if (setRes.status === 'fulfilled' && Object.keys(setRes.value?.data || {}).length > 0) {
      setEmailSettings(prev => ({ ...prev, ...setRes.value.data }));
    }
  };

  // Notifications Helpers
  const addNotification = (notif) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      time: new Date().toISOString(),
      read: false,
      ...notif
    };
    setNotifications(prev => [newNotif, ...prev.slice(0, 49)]); // Keep last 50
  };

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const updateEmailSettings = (updated) => {
    setEmailSettings(prev => {
      const merged = { ...prev, ...updated };
      api.settings.save(merged).catch(trackSyncError);
      return merged;
    });
  };

  // Dynamic Custom Pages Actions with MySQL Sync
  const addCustomPage = (page) => {
    const newPage = {
      id: `page-${Date.now()}`,
      slug: (page.slug || page.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')),
      createdAt: new Date().toISOString(),
      isPublished: true,
      ...page
    };
    setCustomPages(prev => [newPage, ...prev]);
    api.pages.save(newPage).catch(trackSyncError);

    if (page.showInNavbar) {
      setNavItems(prev => {
        const exists = prev.some(item => item.path === `p/${newPage.slug}` || item.label.toLowerCase() === page.title.toLowerCase());
        if (exists) return prev;
        const updatedNav = [
          ...prev,
          {
            id: `nav-${Date.now()}`,
            label: page.title.toUpperCase(),
            path: `p/${newPage.slug}`,
            type: 'page',
            isVisible: true,
            isHot: false,
            order: prev.length + 1
          }
        ];
        api.navItems.saveAll(updatedNav).catch(trackSyncError);
        return updatedNav;
      });
    }

    return newPage;
  };

  const updateCustomPage = (id, updated) => {
    setCustomPages(prev => {
      const updatedList = prev.map(p => p.id === id ? { ...p, ...updated } : p);
      const target = updatedList.find(p => p.id === id);
      if (target) api.pages.save(target).catch(trackSyncError);
      return updatedList;
    });
  };

  const deleteCustomPage = (id) => {
    const target = customPages.find(p => p.id === id);
    if (target) {
      setNavItems(prev => {
        const filtered = prev.filter(item => item.path !== `p/${target.slug}`);
        api.navItems.saveAll(filtered).catch(trackSyncError);
        return filtered;
      });
    }
    setCustomPages(prev => prev.filter(p => p.id !== id));
    api.pages.delete(id).catch(trackSyncError);
  };

  // Dynamic Navigation Actions with MySQL Sync
  const addNavItem = (item) => {
    const newItem = {
      id: `nav-${Date.now()}`,
      order: navItems.length + 1,
      isVisible: true,
      isHot: false,
      ...item
    };
    setNavItems(prev => {
      const updated = [...prev, newItem];
      api.navItems.saveAll(updated).catch(trackSyncError);
      return updated;
    });
    return newItem;
  };

  const updateNavItem = (id, updated) => {
    setNavItems(prev => {
      const updatedList = prev.map(item => item.id === id ? { ...item, ...updated } : item);
      api.navItems.saveAll(updatedList).catch(trackSyncError);
      return updatedList;
    });
  };

  const deleteNavItem = (id) => {
    setNavItems(prev => {
      const filtered = prev.filter(item => item.id !== id);
      api.navItems.saveAll(filtered).catch(trackSyncError);
      return filtered;
    });
  };

  const toggleNavItemVisibility = (id) => {
    setNavItems(prev => {
      const toggled = prev.map(item => item.id === id ? { ...item, isVisible: !item.isVisible } : item);
      api.navItems.saveAll(toggled).catch(trackSyncError);
      return toggled;
    });
  };

  const moveNavItem = (index, direction) => {
    const newItems = [...navItems];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    const ordered = newItems.map((item, idx) => ({ ...item, order: idx + 1 }));
    setNavItems(ordered);
    api.navItems.saveAll(ordered).catch(trackSyncError);
  };

  // Dynamic Blog CMS Actions with MySQL Sync
  const addBlogPost = (post) => {
    const newPost = {
      id: `post-${Date.now()}`,
      slug: (post.slug || post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')),
      publishedDate: new Date().toISOString().split('T')[0],
      readTime: post.readTime || '5 min read',
      author: post.author || 'MANEBZ Editorial Board',
      authorRole: post.authorRole || 'Compliance & Strategy Lead',
      authorAvatar: post.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      coverImage: post.coverImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
      tags: post.tags || ['Enterprise', 'Compliance'],
      ...post
    };
    setBlogs(prev => [newPost, ...prev]);
    api.blogs.save(newPost).catch(trackSyncError);
    return newPost;
  };

  const updateBlogPost = (id, updated) => {
    setBlogs(prev => {
      const updatedList = prev.map(b => b.id === id ? { ...b, ...updated } : b);
      const target = updatedList.find(b => b.id === id);
      if (target) api.blogs.save(target).catch(trackSyncError);
      return updatedList;
    });
  };

  const deleteBlogPost = (id) => {
    setBlogs(prev => prev.filter(b => b.id !== id));
    api.blogs.delete(id).catch(trackSyncError);
  };

  // Inquiries / Leads States
  const [inquiries, setInquiries] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
      return saved ? JSON.parse(saved) : [
        {
          id: 'INQ-101',
          name: 'Apex Business Park (Sanjay Verma)',
          phone: '+91 98110 44321',
          email: 'admin@apextowers.com',
          service: 'INTEGRATED FACILITIES MANAGEMENT',
          location: 'Cyber City, Gurugram',
          date: '2026-09-08T10:30:00.000Z',
          status: 'New Lead',
          scope: '450,000 sq.ft commercial tech park full IFM and 24/7 MEP upkeep.',
          budgetEstimate: '₹ 4,85,000 / month'
        },
        {
          id: 'INQ-102',
          name: 'NexGen Logistics Hub (Sunita Rao)',
          phone: '+91 98992 11029',
          email: 'operations@nexgenlogistics.in',
          service: 'LOGISTICS & WAREHOUSE MANAGEMENT',
          location: 'Noida Sector 62',
          date: '2026-09-07T14:15:00.000Z',
          status: 'Proposal Sent',
          scope: 'JIT inventory floor handling and 25 certified forklift operators.',
          budgetEstimate: '₹ 3,40,000 / month'
        }
      ];
    } catch (e) {
      return [];
    }
  });

  const [jobApplications, setJobApplications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      return saved ? JSON.parse(saved) : [
        {
          refId: 'MNB-APP-891024',
          jobId: 'job-1',
          jobTitle: 'Facility Operations Manager (IFM)',
          fullName: 'Vikram Singh Chauhan',
          phone: '+91 98712 34567',
          email: 'vikram.chauhan@email.com',
          experience: '6 - 10 Years',
          currentLocation: 'Gurugram, Haryana',
          resumeFileName: 'Vikram_Chauhan_IFM_Resume.pdf',
          message: '10+ years experience in multi-tenant commercial park MEP & soft services governance.',
          date: '2026-09-08T11:45:00.000Z',
          status: 'Shortlisted',
          stage: 'Shortlisted'
        },
        {
          refId: 'MNB-APP-891025',
          jobId: 'job-2',
          jobTitle: 'Corporate Security Lead / CSO',
          fullName: 'Capt. Rakesh Sharma',
          phone: '+91 98100 22345',
          email: 'rakesh.sharma@email.com',
          experience: '10+ Years',
          currentLocation: 'New Delhi',
          resumeFileName: 'Capt_Rakesh_Security_Profile.pdf',
          message: 'Ex-defense officer with comprehensive industrial asset protection credentials.',
          date: '2026-09-09T09:15:00.000Z',
          status: 'Interview Scheduled',
          stage: 'Interview Scheduled'
        }
      ];
    } catch (e) {
      return [];
    }
  });

  const [talentVaultApplications, setTalentVaultApplications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TALENT_VAULT);
      return saved ? JSON.parse(saved) : [
        {
          id: 'MNB-TALENT-741298',
          fullName: 'Pooja Bhattacharya',
          phone: '+91 97118 99201',
          email: 'pooja.b@email.com',
          targetDepartment: 'HR Staffing & Statutory Payroll',
          preferredLocation: 'Delhi NCR (Delhi, Gurugram, Noida)',
          experience: '3 - 6 Years',
          noticePeriod: 'Immediate / < 15 Days',
          resumeFileName: 'Pooja_HR_Payroll_Specialist.pdf',
          keySkills: 'EPFO ECR, ESIC returns, Labour laws, 3000+ associate payroll processing',
          date: '2026-09-08T16:20:00.000Z',
          status: 'Resource Cell Indexed'
        }
      ];
    } catch (e) {
      return [];
    }
  });

  // Auto-persist to localStorage
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services)); }, [services]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs)); }, [jobs]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(companyStats)); }, [companyStats]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.MILESTONES, JSON.stringify(milestones)); }, [milestones]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.VALUES, JSON.stringify(coreValues)); }, [coreValues]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.COMPLIANCES, JSON.stringify(statutoryCompliances)); }, [statutoryCompliances]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.QA_POINTS, JSON.stringify(qualityAssurancePoints)); }, [qualityAssurancePoints]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.REGIONS, JSON.stringify(regionsServed)); }, [regionsServed]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PERKS, JSON.stringify(employeePerks)); }, [employeePerks]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(testimonials)); }, [testimonials]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries)); }, [inquiries]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(jobApplications)); }, [jobApplications]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.TALENT_VAULT, JSON.stringify(talentVaultApplications)); }, [talentVaultApplications]);

  // Actions: Services Management with MySQL Sync
  const addService = (newService) => {
    const s = {
      id: `srv-${Date.now()}`,
      slug: newService.slug || newService.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'),
      ...newService
    };
    setServices(prev => {
      const updated = [...prev, s];
      api.services.save(s).catch(trackSyncError);
      return updated;
    });
    return s;
  };

  const updateService = (id, updatedFields) => {
    setServices(prev => {
      const updatedList = prev.map(s => s.id === id ? { ...s, ...updatedFields } : s);
      const target = updatedList.find(s => s.id === id);
      if (target) api.services.save(target).catch(trackSyncError);
      return updatedList;
    });
  };

  const deleteService = (id) => {
    setServices(prev => prev.filter(s => s.id !== id));
    api.services.delete(id).catch(trackSyncError);
  };

  // Actions: Jobs Management with MySQL Sync
  const addJob = (newJob) => {
    const j = {
      id: `job-custom-${Date.now()}`,
      ...newJob
    };
    setJobs(prev => {
      const updated = [j, ...prev];
      api.jobs.save(j).catch(trackSyncError);
      return updated;
    });
    return j;
  };

  const updateJob = (id, updatedFields) => {
    setJobs(prev => {
      const updatedList = prev.map(j => j.id === id ? { ...j, ...updatedFields } : j);
      const target = updatedList.find(j => j.id === id);
      if (target) api.jobs.save(target).catch(trackSyncError);
      return updatedList;
    });
  };

  const deleteJob = (id) => {
    setJobs(prev => prev.filter(j => j.id !== id));
    api.jobs.delete(id).catch(trackSyncError);
  };

  // Actions: Stats, Milestones & Values with MySQL Sync
  const updateStat = (id, updatedFields) => {
    setCompanyStats(prev => {
      const updated = prev.map(st => st.id === id ? { ...st, ...updatedFields } : st);
      api.stats.saveAll(updated).catch(trackSyncError);
      return updated;
    });
  };

  const addStat = (stat) => {
    setCompanyStats(prev => {
      // String id: the backend stores stat_id as VARCHAR and returns it as a string,
      // so a numeric id here stops matching its own row after the next page load.
      const updated = [...prev, { id: `stat-${Date.now()}`, ...stat }];
      api.stats.saveAll(updated).catch(trackSyncError);
      return updated;
    });
  };

  const deleteStat = (id) => {
    setCompanyStats(prev => {
      const updated = prev.filter(st => st.id !== id);
      api.stats.saveAll(updated).catch(trackSyncError);
      return updated;
    });
  };

  const updateMilestone = (index, updatedFields) => {
    setMilestones(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updatedFields };
      api.milestones.saveAll(copy).catch(trackSyncError);
      return copy;
    });
  };

  const addMilestone = (milestone) => {
    setMilestones(prev => {
      const updated = [...prev, milestone];
      api.milestones.saveAll(updated).catch(trackSyncError);
      return updated;
    });
  };

  const deleteMilestone = (index) => {
    setMilestones(prev => {
      const updated = prev.filter((_, i) => i !== index);
      api.milestones.saveAll(updated).catch(trackSyncError);
      return updated;
    });
  };

  const updateCompliance = (index, updatedFields) => {
    setStatutoryCompliances(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updatedFields };
      api.compliances.saveAll(copy).catch(trackSyncError);
      return copy;
    });
  };

  const addCompliance = (compliance) => {
    setStatutoryCompliances(prev => {
      const updated = [...prev, compliance];
      api.compliances.saveAll(updated).catch(trackSyncError);
      return updated;
    });
  };

  const deleteCompliance = (index) => {
    setStatutoryCompliances(prev => {
      const updated = prev.filter((_, i) => i !== index);
      api.compliances.saveAll(updated).catch(trackSyncError);
      return updated;
    });
  };

  // Actions: Testimonials with MySQL Sync
  const addTestimonial = (testimonial) => {
    const t = { id: `t-${Date.now()}`, ...testimonial };
    setTestimonials(prev => {
      const updated = [t, ...prev];
      api.testimonials.saveAll(updated).catch(trackSyncError);
      return updated;
    });
    return t;
  };

  const updateTestimonial = (id, updatedFields) => {
    setTestimonials(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, ...updatedFields } : t);
      api.testimonials.saveAll(updated).catch(trackSyncError);
      return updated;
    });
  };

  const deleteTestimonial = (id) => {
    setTestimonials(prev => {
      const updated = prev.filter(t => t.id !== id);
      api.testimonials.saveAll(updated).catch(trackSyncError);
      return updated;
    });
  };

  // Actions: Inquiries & Inboxes with Notification Dispatching and MySQL Backend Sync
  const addInquiry = async (inquiry) => {
    const inq = {
      id: `INQ-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString(),
      status: 'New Lead',
      ...inquiry
    };
    setInquiries(prev => [inq, ...prev]);

    // Dispatch notification
    dispatchNotificationAlert('inquiry', inq, emailSettings);
    addNotification({
      type: 'inquiry',
      title: 'New Quotation Request',
      message: `${inq.name || 'Client'} requested a quote for ${inq.service || 'Facility Management'}`,
      data: inq
    });

    // Asynchronously sync with MySQL Backend
    try {
      await api.inquiries.create(inquiry);
    } catch (e) {
      console.debug('Backend API offline or queued locally:', e.message);
    }

    return inq;
  };

  const updateInquiryStatus = (id, status) => {
    setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status } : inq));
    api.inquiries.updateStatus(id, status).catch(trackSyncError);
  };

  const deleteInquiry = (id) => {
    setInquiries(prev => prev.filter(inq => inq.id !== id));
    api.inquiries.delete(id).catch(trackSyncError);
  };

  // Actions: Job Applications & Kanban Stage Manager with MySQL Sync
  const addJobApplication = async (app) => {
    const a = {
      refId: `MNB-APP-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString(),
      status: 'Applied',
      stage: 'Applied',
      ...app
    };
    setJobApplications(prev => [a, ...prev]);

    // Dispatch notification
    dispatchNotificationAlert('application', a, emailSettings);
    addNotification({
      type: 'application',
      title: 'New Candidate Application',
      message: `${a.fullName} applied for ${a.jobTitle}`,
      data: a
    });

    // Asynchronously sync with MySQL Backend
    try {
      await api.careers.submit({
        fullName: a.fullName,
        email: a.email,
        phone: a.phone,
        jobId: a.jobId || a.refId,
        jobTitle: a.jobTitle,
        department: a.department,
        experience: a.experience,
        location: a.location,
        qualification: a.qualification,
        currentCtc: a.currentCtc,
        expectedCtc: a.expectedCtc,
        resumeUrl: a.resumeUrl,
        notes: a.notes
      });
    } catch (e) {
      console.debug('Backend API offline or queued locally:', e.message);
    }

    return a;
  };

  const updateJobApplicationStatus = (refId, status) => {
    setJobApplications(prev => prev.map(a => a.refId === refId ? { ...a, status, stage: status } : a));
    api.careers.updateStatus(refId, status).catch(trackSyncError);
  };

  const updateApplicationStage = (refId, newStage) => {
    setJobApplications(prev => prev.map(a => a.refId === refId ? { ...a, stage: newStage, status: newStage } : a));
    api.careers.updateStatus(refId, newStage).catch(trackSyncError);
  };

  const deleteJobApplication = (refId) => {
    setJobApplications(prev => prev.filter(a => a.refId !== refId));
    api.careers.delete(refId).catch(trackSyncError);
  };

  const addTalentVaultApplication = (app) => {
    const t = {
      id: `MNB-TALENT-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString(),
      status: 'Resource Cell Indexed',
      ...app
    };
    setTalentVaultApplications(prev => [t, ...prev]);

    dispatchNotificationAlert('talent_vault', t, emailSettings);
    addNotification({
      type: 'talent_vault',
      title: 'New Talent Pool Candidate',
      message: `${t.fullName} registered in ${t.targetDepartment}`,
      data: t
    });

    return t;
  };

  const updateTalentVaultStatus = (id, status) => {
    setTalentVaultApplications(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const deleteTalentVaultApplication = (id) => {
    setTalentVaultApplications(prev => prev.filter(t => t.id !== id));
  };

  // Restore System Defaults
  const resetAllToDefaults = () => {
    setServices(defaultServices);
    setJobs(defaultJobs);
    setCompanyStats(defaultStats);
    setMilestones(defaultMilestones);
    setCoreValues(defaultValues);
    setStatutoryCompliances(defaultCompliances);
    setQualityAssurancePoints(defaultQA);
    setRegionsServed(defaultRegions);
    setEmployeePerks(defaultPerks);
    setTestimonials(defaultTestimonials);
    setBlogs(initialBlogPosts);
    setEmailSettings(defaultEmailSettings);
    Object.values(STORAGE_KEYS).forEach(k => localStorage.getItem(k) && localStorage.removeItem(k));
  };

  return (
    <CompanyContext.Provider
      value={{
        services,
        addService,
        updateService,
        deleteService,

        jobs,
        addJob,
        updateJob,
        deleteJob,

        companyStats,
        updateStat,
        addStat,
        deleteStat,

        milestones,
        updateMilestone,
        addMilestone,
        deleteMilestone,

        coreValues,
        setCoreValues,

        statutoryCompliances,
        updateCompliance,
        addCompliance,
        deleteCompliance,

        qualityAssurancePoints,
        setQualityAssurancePoints,

        regionsServed,
        setRegionsServed,

        employeePerks,
        setEmployeePerks,

        testimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,

        inquiries,
        addInquiry,
        updateInquiryStatus,
        deleteInquiry,

        jobApplications,
        addJobApplication,
        updateJobApplicationStatus,
        updateApplicationStage,
        deleteJobApplication,

        talentVaultApplications,
        addTalentVaultApplication,
        updateTalentVaultStatus,
        deleteTalentVaultApplication,

        customPages,
        addCustomPage,
        updateCustomPage,
        deleteCustomPage,

        navItems,
        addNavItem,
        updateNavItem,
        deleteNavItem,
        toggleNavItemVisibility,
        moveNavItem,

        blogs,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,

        notifications,
        addNotification,
        markNotificationsRead,
        clearNotifications,

        emailSettings,
        updateEmailSettings,

        homeContent,
        updateHomeContent,
        resetHomeContent,

        updateCoreValues,
        updateAboutContent,

        contactInfo,
        updateContactInfo,
        resetContactInfo,

        contentLoaded,

        syncError,
        clearSyncError,
        refreshAdminData,

        resetAllToDefaults
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};
