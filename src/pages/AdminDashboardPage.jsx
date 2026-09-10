import React, { useState } from 'react';
import logoImg from '../assets/logo.jpg';
import {
  LayoutDashboard,
  Layers,
  Briefcase,
  Users,
  Database,
  MessageSquare,
  Award,
  Star,
  Settings,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ArrowRight,
  X,
  Save,
  RotateCcw,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Download,
  FileText,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Check,
  Sparkles,
  ExternalLink,
  ChevronRight,
  IndianRupee,
  Calendar,
  Zap,
  CheckSquare,
  Paperclip,
  AlertCircle,
  Table,
  LogOut,
  Menu,
  Globe,
  ArrowUp,
  ArrowDown,
  PlusCircle,
  Link,
  Layers as LayersIcon,
  BookOpen,
  Bell,
  Columns,
  Kanban,
  Send,
  FileSpreadsheet,
  CheckCircle
} from 'lucide-react';
import { useCompany } from '../context/CompanyContext';

const AdminDashboardPage = ({ onNavigate }) => {
  const {
    services, addService, updateService, deleteService,
    jobs, addJob, updateJob, deleteJob,
    companyStats, updateStat, addStat, deleteStat,
    milestones, updateMilestone, addMilestone, deleteMilestone,
    statutoryCompliances, updateCompliance, addCompliance, deleteCompliance,
    testimonials, addTestimonial, updateTestimonial, deleteTestimonial,
    inquiries, updateInquiryStatus, deleteInquiry,
    jobApplications, updateJobApplicationStatus, updateApplicationStage, deleteJobApplication,
    talentVaultApplications, updateTalentVaultStatus, deleteTalentVaultApplication,
    customPages, addCustomPage, updateCustomPage, deleteCustomPage,
    navItems, addNavItem, updateNavItem, deleteNavItem, toggleNavItemVisibility, moveNavItem,
    blogs, addBlogPost, updateBlogPost, deleteBlogPost,
    notifications, addNotification, markNotificationsRead, clearNotifications,
    emailSettings, updateEmailSettings,
    resetAllToDefaults
  } = useCompany();

  // Authentication State with 'Admin123' Password Protection
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('manabs_admin_authenticated') === 'true';
    } catch {
      return false;
    }
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === 'Admin12345') {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem('manabs_admin_authenticated', 'true');
      } catch (err) {
        console.error(err);
      }
      setPasswordError('');
      setPasswordInput('');
    } else {
      setPasswordError('Invalid Admin Password. Please enter Admin123');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem('manabs_admin_authenticated');
    } catch (err) {
      console.error(err);
    }
    setPasswordInput('');
    setPasswordError('');
  };

  // Active Sidebar Section
  const [activeSection, setActiveSection] = useState('overview'); // overview, services, jobs, inquiries, applications, talent-vault, blogs, notifications, company-info, testimonials, settings

  // Search & Filter in Sub-sections
  const [subSearch, setSubSearch] = useState('');

  // Applications View Mode: 'list' or 'kanban'
  const [applicationsViewMode, setApplicationsViewMode] = useState('kanban');
  const [selectedJobFilter, setSelectedJobFilter] = useState('all');

  // Blog CMS Studio State
  const [isEditingBlog, setIsEditingBlog] = useState(false);
  const [editingBlogItem, setEditingBlogItem] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    slug: '',
    category: 'Statutory Compliance',
    excerpt: '',
    author: 'MANABS Editorial Board',
    authorRole: 'Compliance & Strategy Lead',
    coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1200&auto=format&fit=crop',
    readTime: '5 min read',
    tagsText: 'Compliance, Labour Law, Facility',
    contentSectionsText: 'Why Compliance Matters|Principal employers are held jointly liable for defaults by their contractors.\nAudit Checklist|Ensure 100% verified ECR challans for PF and ESI every month.',
    featured: false
  });

  // Email / Webhook Config State
  const [emailConfig, setEmailConfig] = useState(() => emailSettings || {
    adminEmail: 'operations@manabs.com',
    enableInstantAlerts: true,
    enableBrowserPush: true,
    enableSoundChime: true,
    webhookUrl: '',
    emailJsServiceId: '',
    emailJsTemplateId: '',
    emailJsPublicKey: ''
  });

  // Modals State
  const [modalType, setModalType] = useState(null); // 'service', 'job', 'stat', 'milestone', 'compliance', 'testimonial'
  const [editingItem, setEditingItem] = useState(null);
  const [previewResumeModal, setPreviewResumeModal] = useState(null);
  const [expandedResumeId, setExpandedResumeId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // CSV Export Helper
  const downloadCSV = (data, filename, columns) => {
    if (!data || data.length === 0) {
      showToast('No data available to export.');
      return;
    }
    const header = columns.map(c => `"${c.label}"`).join(',');
    const rows = data.map(item =>
      columns.map(c => {
        const val = typeof c.accessor === 'function' ? c.accessor(item) : item[c.accessor];
        return `"${(val ?? '').toString().replace(/"/g, '""')}"`;
      }).join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [header, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${data.length} records to ${filename}.csv`);
  };

  const handleExportInquiriesCSV = () => {
    downloadCSV(inquiries, 'MANABS_Quotation_Leads', [
      { label: 'Inquiry ID', accessor: 'id' },
      { label: 'Date', accessor: inq => inq.date ? new Date(inq.date).toLocaleString() : '' },
      { label: 'Client / Company Name', accessor: 'name' },
      { label: 'Phone', accessor: 'phone' },
      { label: 'Email', accessor: 'email' },
      { label: 'Service Vertical', accessor: 'service' },
      { label: 'Location', accessor: 'location' },
      { label: 'Status', accessor: 'status' },
      { label: 'Estimated Budget', accessor: 'budgetEstimate' },
      { label: 'Scope Details', accessor: inq => inq.scope || inq.message || '' }
    ]);
  };

  const handleExportApplicationsCSV = () => {
    downloadCSV(jobApplications, 'MANABS_Candidate_Pipeline', [
      { label: 'Application ID', accessor: 'refId' },
      { label: 'Applied Date', accessor: app => app.date ? new Date(app.date).toLocaleString() : '' },
      { label: 'Candidate Full Name', accessor: 'fullName' },
      { label: 'Job Title', accessor: 'jobTitle' },
      { label: 'Pipeline Stage', accessor: app => app.stage || app.status || 'Applied' },
      { label: 'Phone', accessor: 'phone' },
      { label: 'Email', accessor: 'email' },
      { label: 'Experience Level', accessor: 'experience' },
      { label: 'Location', accessor: 'currentLocation' },
      { label: 'Resume File', accessor: 'resumeFileName' },
      { label: 'Cover Note', accessor: 'message' }
    ]);
  };

  const handleExportTalentVaultCSV = () => {
    downloadCSV(talentVaultApplications, 'MANABS_Talent_Pool_Bank', [
      { label: 'Vault ID', accessor: 'id' },
      { label: 'Registration Date', accessor: t => t.date ? new Date(t.date).toLocaleString() : '' },
      { label: 'Candidate Full Name', accessor: 'fullName' },
      { label: 'Target Domain', accessor: 'targetDepartment' },
      { label: 'Phone', accessor: 'phone' },
      { label: 'Email', accessor: 'email' },
      { label: 'Experience Level', accessor: 'experience' },
      { label: 'Notice Period', accessor: 'noticePeriod' },
      { label: 'Key Skills', accessor: 'keySkills' },
      { label: 'Status', accessor: 'status' }
    ]);
  };

  const getBlobUrlFromDataUrl = (dataUrl) => {
    if (!dataUrl) return null;
    if (dataUrl.startsWith('blob:') || dataUrl.startsWith('http')) return dataUrl;
    try {
      const parts = dataUrl.split(',');
      const mime = parts[0].match(/:(.*?);/)?.[1] || 'application/pdf';
      const bstr = atob(parts[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: mime });
      return URL.createObjectURL(blob);
    } catch (e) {
      console.error('Error creating blob url:', e);
      return dataUrl;
    }
  };

  const handleOpenFileInNewTab = (dataUrl, fileName = 'document.pdf') => {
    if (!dataUrl) return;
    const blobUrl = getBlobUrlFromDataUrl(dataUrl);
    if (blobUrl) {
      const win = window.open(blobUrl, '_blank');
      if (win) {
        win.focus();
      }
    }
  };

  const handleDownloadResume = (applicant) => {
    const candidateName = applicant.fullName || applicant.applicantName || 'Candidate';
    const roleTitle = applicant.jobTitle || applicant.role || applicant.targetDepartment || 'Applicant';
    const fileName = applicant.fileName || applicant.resumeFileName || `${candidateName.replace(/\s+/g, '_')}_Resume.pdf`;

    const dataUri = applicant.dataUrl || applicant.resumeDataUrl;
    if (dataUri) {
      try {
        const blobUrl = getBlobUrlFromDataUrl(dataUri);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast(`Downloaded: ${fileName}`);
        return;
      } catch (err) {
        console.error(err);
      }
    } else {
      // Generate a formatted printable HTML resume dossier
      const docHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Resume - ${candidateName}</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #0f172a; max-width: 820px; margin: 0 auto; line-height: 1.6; }
    .header { border-bottom: 3px solid #dc2626; padding-bottom: 16px; margin-bottom: 24px; }
    h1 { margin: 0 0 6px 0; font-size: 26px; text-transform: uppercase; color: #0f172a; letter-spacing: -0.5px; }
    .applied-badge { color: #dc2626; font-weight: bold; font-size: 15px; }
    .meta-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; background: #f8fafc; padding: 14px; border: 1px solid #e2e8f0; border-radius: 10px; margin: 20px 0; font-size: 13px; }
    .meta-grid div span { color: #64748b; font-weight: bold; font-size: 11px; text-transform: uppercase; display: block; }
    .meta-grid div strong { color: #0f172a; font-size: 14px; }
    .section-title { font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #dc2626; font-weight: bold; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-top: 24px; margin-bottom: 12px; }
    .content-box { background: #ffffff; border: 1px solid #cbd5e1; padding: 18px; border-radius: 10px; white-space: pre-wrap; font-size: 13.5px; line-height: 1.7; font-family: inherit; }
    .footer { margin-top: 40px; padding-top: 14px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${candidateName}</h1>
    <div class="applied-badge">Applied for: ${roleTitle}</div>
    <div style="font-size: 13px; color: #475569; margin-top: 6px;">
      📞 ${applicant.phone || 'N/A'} • ✉️ ${applicant.email || 'N/A'} • 📍 ${applicant.currentLocation || applicant.preferredLocation || 'Delhi NCR, India'} • 💼 ${applicant.experience || '1 - 3 Years'}
    </div>
  </div>

  <div class="meta-grid">
    <div><span>Application Ref ID</span><strong>${applicant.refId || applicant.id || 'MNB-APP'}</strong></div>
    <div><span>Attached File Name</span><strong>${fileName}</strong></div>
    <div><span>Submission Date</span><strong>${applicant.date ? new Date(applicant.date).toLocaleDateString() : new Date().toLocaleDateString()}</strong></div>
    <div><span>Hiring Status</span><strong>${applicant.status || 'Under Review'}</strong></div>
  </div>

  <div class="section-title">Candidate Statement & Cover Experience</div>
  <div class="content-box">${applicant.message || applicant.keySkills || 'Candidate profile registered in MANABS Central Resource Cell.'}</div>

  <div class="footer">
    <span>MANABS INTEGRATED FACILITY & STAFFING MANAGEMENT</span>
    <span>CONFIDENTIAL CANDIDATE DOSSIER</span>
  </div>
</body>
</html>`;
      const blob = new Blob([docHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${candidateName.replace(/\s+/g, '_')}_Resume_Dossier.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(`Generated and downloaded: ${candidateName}'s Resume`);
    }
  };

  // Service Form State
  const [serviceForm, setServiceForm] = useState({
    title: '',
    category: 'Workforce Solutions',
    tagline: '',
    shortDesc: '',
    description: '',
    accentColor: 'sky',
    icon: 'Building2',
    featuresText: '',
    faqsText: '',
  });

  // Job Form State
  const [jobForm, setJobForm] = useState({
    title: '',
    department: 'Integrated Facilities',
    location: 'Delhi NCR',
    type: 'Full-Time',
    experience: '2 - 5 Years',
    salary: '₹3.5L - ₹5.5L / Annum',
    description: '',
    responsibilitiesText: '',
    qualificationsText: '',
    skillsText: '',
    workingHours: 'General Shift (9:30 AM - 6:30 PM)',
    openingsCount: 2,
    isHot: true,
  });

  // Stat Form State
  const [statForm, setStatForm] = useState({ label: '', value: '', subtext: '', icon: 'Award' });

  // Milestone Form State
  const [milestoneForm, setMilestoneForm] = useState({ year: '', title: '', description: '', badge: 'Scale' });

  // Compliance Form State
  const [complianceForm, setComplianceForm] = useState({ title: '', desc: '', code: '' });

  // Testimonial Form State
  const [testimonialForm, setTestimonialForm] = useState({
    clientName: '',
    designation: '',
    company: '',
    location: 'Delhi NCR',
    rating: 5,
    quote: '',
    metric: '99.9% Uptime',
    serviceUsed: 'Integrated Facilities Management'
  });

  // Custom Dynamic Page Form State
  const [pageForm, setPageForm] = useState({
    title: '',
    slug: '',
    badge: 'Enterprise Standards',
    heroTagline: '',
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
    content: '',
    sectionsText: '100% PF & ESI Statutory Governance | Zero-liability guarantee for client enterprises.\nISO & Bio-Friendly Facility Upkeep | Eco-certified chemicals and modern equipment.',
    showInNavbar: true,
  });

  // Navigation Menu Item Form State
  const [navForm, setNavForm] = useState({
    label: '',
    path: 'home',
    type: 'internal',
    isHot: false,
  });

  const [isEditingPage, setIsEditingPage] = useState(false);
  const [isEditingService, setIsEditingService] = useState(false);
  const [isEditingJob, setIsEditingJob] = useState(false);

  const openPageEditor = (p = null) => {
    if (p) {
      setEditingItem(p);
      setPageForm({
        title: p.title || '',
        slug: p.slug || '',
        badge: p.badge || 'Official Company Document',
        heroTagline: p.heroTagline || '',
        heroImage: p.heroImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
        content: p.content || '',
        sectionsText: Array.isArray(p.sections) ? p.sections.map(s => `${s.heading} | ${s.text}`).join('\n') : '',
        showInNavbar: !!p.showInNavbar,
      });
    } else {
      setEditingItem(null);
      setPageForm({
        title: '',
        slug: '',
        badge: 'Enterprise Governance',
        heroTagline: 'Professional Corporate Infrastructure & Workforce Operations',
        heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
        content: 'Overview description of this custom policy, service standard, or company page.',
        sectionsText: 'Key Focus Area 1 | Detailed description of the operational protocols and standards.\nKey Focus Area 2 | Complete transparency and round-the-clock adherence to statutory regulations.',
        showInNavbar: true,
      });
    }
    setIsEditingPage(true);
  };

  const handleSavePage = (e) => {
    e.preventDefault();
    if (!pageForm.title.trim()) return;

    const sections = pageForm.sectionsText.split('\n').map(line => {
      const parts = line.split('|');
      if (parts.length >= 2) {
        return { heading: parts[0].trim(), text: parts.slice(1).join('|').trim() };
      }
      return { heading: 'Key Highlight', text: line.trim() };
    }).filter(s => s.heading && s.text);

    const generatedSlug = pageForm.slug.trim() || pageForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const pageData = {
      title: pageForm.title.trim(),
      slug: generatedSlug,
      badge: pageForm.badge.trim(),
      heroTagline: pageForm.heroTagline.trim(),
      heroImage: pageForm.heroImage.trim(),
      content: pageForm.content.trim(),
      sections,
      showInNavbar: pageForm.showInNavbar,
    };

    if (editingItem) {
      updateCustomPage(editingItem.id, pageData);
      showToast(`Page "${pageData.title}" updated successfully!`);
    } else {
      addCustomPage(pageData);
      showToast(`New page "${pageData.title}" created & published!`);
    }
    setIsEditingPage(false);
  };

  const openNavModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setNavForm({
        label: item.label || '',
        path: item.path || 'home',
        type: item.type || 'internal',
        isHot: !!item.isHot,
      });
    } else {
      setEditingItem(null);
      setNavForm({
        label: '',
        path: 'home',
        type: 'internal',
        isHot: false,
      });
    }
    setModalType('navItem');
  };

  const handleSaveNav = (e) => {
    e.preventDefault();
    if (!navForm.label.trim()) return;

    const navData = {
      label: navForm.label.trim().toUpperCase(),
      path: navForm.path.trim(),
      type: navForm.type,
      isHot: navForm.isHot,
    };

    if (editingItem) {
      updateNavItem(editingItem.id, navData);
      showToast(`Navbar item "${navData.label}" updated!`);
    } else {
      addNavItem(navData);
      showToast(`New item "${navData.label}" added to navbar!`);
    }
    setModalType(null);
  };

  // 1. Service Studio Handlers
  const openServiceModal = (s = null) => {
    if (s) {
      setEditingItem(s);
      setServiceForm({
        title: s.title || '',
        category: s.category || 'Workforce Solutions',
        tagline: s.tagline || '',
        shortDesc: s.shortDesc || '',
        description: s.description || '',
        accentColor: s.accentColor || 'sky',
        icon: s.icon || 'Building2',
        featuresText: Array.isArray(s.features) ? s.features.join('\n') : '',
        faqsText: Array.isArray(s.faqs) ? s.faqs.map(f => `${f.q} | ${f.a}`).join('\n') : '',
      });
    } else {
      setEditingItem(null);
      setServiceForm({
        title: '',
        category: 'Workforce Solutions',
        tagline: 'Delivering Next-Gen Corporate Operations',
        shortDesc: 'Comprehensive enterprise workforce & facility support.',
        description: 'Dedicated management system with SOP-compliant execution and 100% statutory adherence.',
        accentColor: 'sky',
        icon: 'Building2',
        featuresText: 'Dedicated on-site operations manager\n24/7 emergency rapid response roster\n100% statutory PF & ESI adherence',
        faqsText: 'How soon can deployment occur? | Deployment starts within 24 to 48 business hours.\nAre personnel insured? | Yes, 100% ESI, PF, and statutory insurance compliance.',
      });
    }
    setIsEditingService(true);
  };

  const handleSaveService = (e) => {
    if (e) e.preventDefault();
    if (!serviceForm.title.trim()) return;

    const features = serviceForm.featuresText.split('\n').map(f => f.trim()).filter(Boolean);
    const faqs = serviceForm.faqsText.split('\n').map(line => {
      const parts = line.split('|');
      if (parts.length >= 2) {
        return { q: parts[0].trim(), a: parts.slice(1).join('|').trim() };
      }
      return { q: line.trim(), a: 'Contact MANABS helpdesk for specifics.' };
    }).filter(f => f.q.length > 0);

    const slug = serviceForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (editingItem) {
      updateService(editingItem.id, {
        ...serviceForm,
        slug: editingItem.slug || slug,
        features,
        faqs
      });
      showToast(`Service "${serviceForm.title}" updated successfully!`);
    } else {
      addService({
        ...serviceForm,
        slug,
        features,
        faqs
      });
      showToast(`New service "${serviceForm.title}" created successfully!`);
    }
    setIsEditingService(false);
    setEditingItem(null);
  };

  // 2. Job Studio Handlers
  const openJobModal = (job = null) => {
    if (job) {
      setEditingItem(job);
      setJobForm({
        title: job.title || '',
        department: job.department || 'Integrated Facilities',
        location: job.location || 'Delhi NCR',
        type: job.type || 'Full-Time',
        experience: job.experience || '2 - 5 Years',
        salary: job.salary || '₹3.5L - ₹5.5L / Annum',
        description: job.description || '',
        responsibilitiesText: Array.isArray(job.responsibilities) ? job.responsibilities.join('\n') : '',
        qualificationsText: Array.isArray(job.qualifications) ? job.qualifications.join('\n') : '',
        skillsText: Array.isArray(job.skills) ? job.skills.join(', ') : '',
        workingHours: job.workingHours || 'General Shift (9:30 AM - 6:30 PM)',
        openingsCount: job.openingsCount || 2,
        isHot: !!job.isHot,
      });
    } else {
      setEditingItem(null);
      setJobForm({
        title: '',
        department: 'Integrated Facilities',
        location: 'Delhi NCR',
        type: 'Full-Time',
        experience: '2 - 5 Years',
        salary: '₹3.5L - ₹5.5L / Annum',
        description: 'Overseeing daily operations, resource coordination, and statutory compliance across corporate client sites.',
        responsibilitiesText: 'Oversee daily operational standards.\nCoordinate with client supervisors.\nEnsure 100% statutory compliance.',
        qualificationsText: 'Graduate / Diploma in relevant domain.\nStrong field leadership and communication.',
        skillsText: 'Operations Management, SLA Tracking, Vendor Coordination',
        workingHours: 'General Shift (9:30 AM - 6:30 PM)',
        openingsCount: 2,
        isHot: true,
      });
    }
    setIsEditingJob(true);
  };

  const handleSaveJob = (e) => {
    if (e) e.preventDefault();
    if (!jobForm.title.trim()) return;

    const responsibilities = jobForm.responsibilitiesText.split('\n').map(r => r.trim()).filter(Boolean);
    const qualifications = jobForm.qualificationsText.split('\n').map(q => q.trim()).filter(Boolean);
    const skills = jobForm.skillsText.split(',').map(s => s.trim()).filter(Boolean);

    if (editingItem) {
      updateJob(editingItem.id, { ...jobForm, responsibilities, qualifications, skills });
      showToast(`Job opening "${jobForm.title}" updated!`);
    } else {
      addJob({ ...jobForm, responsibilities, qualifications, skills });
      showToast(`New job opening "${jobForm.title}" published!`);
    }
    setIsEditingJob(false);
    setEditingItem(null);
  };

  // 3. Testimonial Modals
  const openTestimonialModal = (t = null) => {
    if (t) {
      setEditingItem(t);
      setTestimonialForm({ ...t });
    } else {
      setEditingItem(null);
      setTestimonialForm({
        clientName: '',
        designation: 'Head of Administration',
        company: '',
        location: 'Delhi NCR',
        rating: 5,
        quote: '',
        metric: '99.9% Uptime',
        serviceUsed: 'Integrated Facilities Management'
      });
    }
    setModalType('testimonial');
  };

  const handleSaveTestimonial = (e) => {
    e.preventDefault();
    if (!testimonialForm.clientName.trim()) return;

    if (editingItem) {
      updateTestimonial(editingItem.id, testimonialForm);
      showToast(`Testimonial from "${testimonialForm.clientName}" updated!`);
    } else {
      addTestimonial(testimonialForm);
      showToast(`New testimonial added!`);
    }
    setModalType(null);
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const backupData = {
      services,
      jobs,
      companyStats,
      milestones,
      statutoryCompliances,
      testimonials,
      inquiries,
      jobApplications,
      talentVaultApplications,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `manabs-website-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('Data backup downloaded successfully!');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a192f] flex items-center justify-center p-4 text-white relative overflow-hidden">
        {/* Glowing Background Orbs */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-red-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full bg-white/10 backdrop-blur-2xl border border-white/20 p-8 sm:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-center space-y-6 relative z-10">

          {/* Main Logo & Security Shield */}
          <div className="flex flex-col items-center gap-3">
            <div className="p-2.5 bg-white rounded-2xl shadow-xl border border-white/30">
              <img
                src={logoImg}
                alt="MANABS / MANEBZ Logo"
                className="h-12 w-auto object-contain"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-sky-400 bg-sky-950/70 px-3.5 py-1 rounded-full border border-sky-500/30 inline-block">
              MANABS / MANEBZ Admin Portal
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Control Center Login
            </h2>
            <p className="text-sm text-gray-300 font-medium">
              Enter admin security password to access live website management.
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-200 mb-2">
                Admin Security Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter Admin Password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  className="w-full px-4 py-3.5 pr-12 rounded-xl bg-white/10 border border-white/25 text-base text-white placeholder-gray-400 focus:outline-none focus:border-sky-400 focus:bg-white/15 transition-all font-semibold"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {passwordError && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/60 text-red-300 text-sm font-semibold flex items-center gap-2">
                <X className="w-4 h-4 text-red-400 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-red-600 to-sky-600 hover:from-red-500 hover:to-sky-500 font-extrabold text-sm uppercase tracking-wider text-white rounded-xl transition-all shadow-lg shadow-red-500/25 active:scale-98 flex items-center justify-center gap-2"
            >
              <Unlock className="w-5 h-5" />
              <span>Unlock Dashboard</span>
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="text-sm font-semibold text-gray-400 hover:text-sky-300 transition-colors inline-flex items-center gap-1.5"
              >
                <span>← Return to Public Website</span>
              </button>
            </div>
          </form>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-gray-900 font-sans">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-gray-950 text-white px-6 py-3.5 rounded-2xl shadow-2xl border border-sky-400 flex items-center gap-3 animate-in slide-in-from-top-3 text-sm font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* LEFT SIDEBAR (Matching User's Reference Screenshot) */}
      <aside className="w-full md:w-64 lg:w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 md:sticky md:top-0 md:h-screen z-30 shadow-xs">

        {/* Admin Panel Branding Header */}
        <div className="p-5 border-b border-slate-100 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#0f172a] text-white flex items-center justify-center shadow-md shrink-0">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 leading-tight">Admin Panel</h2>
            <p className="text-xs text-slate-400 font-semibold">Manabz CMS</p>
          </div>
        </div>

        {/* Vertical Navigation Menu */}
        <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto">
          {[
            { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, badge: null },
            { id: 'inquiries', label: 'Requests', icon: MessageSquare, badge: inquiries.length, badgeColor: 'bg-red-100 text-red-700' },
            { id: 'applications', label: 'Candidate Pipeline', icon: Kanban, badge: jobApplications.length, badgeColor: 'bg-sky-100 text-sky-700' },
            { id: 'services', label: 'Client Accounts', icon: Users, badge: services.length },
            { id: 'jobs', label: 'Careers', icon: Briefcase, badge: jobs.length },
            { id: 'talent-vault', label: 'Talent Bank', icon: Database, badge: talentVaultApplications.length, badgeColor: 'bg-purple-100 text-purple-700' },
            { id: 'blogs', label: 'Blog & News CMS', icon: BookOpen, badge: blogs?.length || 0, badgeColor: 'bg-rose-100 text-rose-700' },
            { id: 'navigation', label: 'Navigation', icon: Menu, badge: navItems?.length || 0, badgeColor: 'bg-emerald-100 text-emerald-700' },
            { id: 'pages', label: 'Pages', icon: Globe, badge: customPages?.length || 0, badgeColor: 'bg-amber-100 text-amber-700' },
            { id: 'notifications', label: 'Alerts & Webhooks', icon: Bell, badge: notifications?.filter(n => !n.read).length || null, badgeColor: 'bg-red-600 text-white animate-pulse' },
            { id: 'company-info', label: 'Content & Heritage', icon: Edit3, badge: null },
            { id: 'testimonials', label: 'Testimonials', icon: Star, badge: testimonials.length },
            { id: 'settings', label: 'System Settings', icon: Settings, badge: null },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveSection(tab.id);
                  setSubSearch('');
                }}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-between transition-all cursor-pointer ${isActive
                    ? 'bg-[#0f172a] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                </div>
                {tab.badge !== null && (
                  <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : tab.badgeColor || 'bg-slate-100 text-slate-700'
                    }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer with Logout Button */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:text-red-600 hover:bg-red-50 font-bold transition-all text-sm cursor-pointer"
          >
            <LogOut className="w-5 h-5 text-slate-500" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN VIEW AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">

        {/* Top Header Bar across main area */}
        <header className="bg-white border-b border-slate-200 px-6 sm:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 z-20 shadow-2xs">
          <div>
            <h1 className="text-2xl font-black text-slate-900 capitalize">
              {activeSection === 'overview' ? 'Dashboard' :
                activeSection === 'inquiries' ? 'Requests & RFQs' :
                  activeSection === 'services' ? 'Client Accounts / Services' :
                    activeSection === 'jobs' ? 'Careers & Vacancies' :
                      activeSection === 'applications' ? 'Job Applications' :
                        activeSection === 'talent-vault' ? 'Future Talent Bank' :
                          activeSection === 'navigation' ? 'Navigation Menu Manager' :
                            activeSection === 'pages' ? 'Custom Pages & CMS' :
                              activeSection === 'company-info' ? 'Company Heritage & Content' :
                                activeSection === 'testimonials' ? 'Client Testimonials' : 'System Settings'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex text-xs bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1 rounded-full border border-emerald-200">
              ● LIVE DYNAMIC
            </span>
            <button
              onClick={() => onNavigate('home')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
              title="Preview public website"
            >
              <Eye className="w-4 h-4 text-sky-600" />
              <span>Live Site</span>
            </button>
            <button
              onClick={handleExportBackup}
              className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors border border-sky-200 cursor-pointer"
              title="Export database backup"
            >
              <Download className="w-4 h-4" />
              <span>Backup</span>
            </button>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="p-4 sm:p-8 space-y-6 max-w-6xl w-full flex-1">

          {/* SECTION 1: OVERVIEW & METRICS */}
          {activeSection === 'overview' && (
            <div className="space-y-6">

              {/* Welcome Banner Card (matching reference design) */}
              <div className="bg-[#0f172a] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Welcome back, Administrator 👋
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 font-medium">
                    Manage your website content, candidate inquiries, job applications, and workforce operations in real-time.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('home')}
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <span>Preview Site</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* 6 Quick Metric Cards with Large Numbers and Clear Labels */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div
                  onClick={() => setActiveSection('services')}
                  className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm cursor-pointer hover:border-sky-500 hover:shadow-md transition-all group"
                >
                  <span className="text-xs sm:text-sm font-extrabold text-gray-500 uppercase tracking-wider block">Active Services</span>
                  <span className="text-4xl sm:text-5xl font-black text-sky-600 mt-2 block">{services.length}</span>
                  <span className="text-xs sm:text-sm font-bold text-gray-600 mt-2 flex items-center gap-1.5 group-hover:text-sky-600">
                    <span>5 Core Pillars</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>

                <div
                  onClick={() => setActiveSection('jobs')}
                  className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm cursor-pointer hover:border-red-500 hover:shadow-md transition-all group"
                >
                  <span className="text-xs sm:text-sm font-extrabold text-gray-500 uppercase tracking-wider block">Open Vacancies</span>
                  <span className="text-4xl sm:text-5xl font-black text-red-600 mt-2 block">{jobs.length}</span>
                  <span className="text-xs sm:text-sm font-bold text-gray-600 mt-2 flex items-center gap-1.5 group-hover:text-red-600">
                    <span>Live in Delhi NCR/UP</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>

                <div
                  onClick={() => setActiveSection('inquiries')}
                  className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm cursor-pointer hover:border-emerald-500 hover:shadow-md transition-all group"
                >
                  <span className="text-xs sm:text-sm font-extrabold text-gray-500 uppercase tracking-wider block">Client RFQ Leads</span>
                  <span className="text-4xl sm:text-5xl font-black text-emerald-600 mt-2 block">{inquiries.length}</span>
                  <span className="text-xs sm:text-sm font-bold text-gray-600 mt-2 flex items-center gap-1.5 group-hover:text-emerald-600">
                    <span>Pending Proposals</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>

                <div
                  onClick={() => setActiveSection('applications')}
                  className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm cursor-pointer hover:border-purple-500 hover:shadow-md transition-all group"
                >
                  <span className="text-xs sm:text-sm font-extrabold text-gray-500 uppercase tracking-wider block">Job Applications</span>
                  <span className="text-4xl sm:text-5xl font-black text-purple-600 mt-2 block">{jobApplications.length}</span>
                  <span className="text-xs sm:text-sm font-bold text-gray-600 mt-2 flex items-center gap-1.5 group-hover:text-purple-600">
                    <span>Direct Candidate CVs</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>

                <div
                  onClick={() => setActiveSection('talent-vault')}
                  className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm cursor-pointer hover:border-amber-500 hover:shadow-md transition-all group"
                >
                  <span className="text-xs sm:text-sm font-extrabold text-gray-500 uppercase tracking-wider block">Future Talent Pool</span>
                  <span className="text-4xl sm:text-5xl font-black text-amber-600 mt-2 block">{talentVaultApplications.length}</span>
                  <span className="text-xs sm:text-sm font-bold text-gray-600 mt-2 flex items-center gap-1.5 group-hover:text-amber-600">
                    <span>Resource Cell Bank</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>

                <div
                  onClick={() => setActiveSection('testimonials')}
                  className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm cursor-pointer hover:border-sky-500 hover:shadow-md transition-all group"
                >
                  <span className="text-xs sm:text-sm font-extrabold text-gray-500 uppercase tracking-wider block">Client Reviews</span>
                  <span className="text-4xl sm:text-5xl font-black text-sky-600 mt-2 block">{testimonials.length}</span>
                  <span className="text-xs sm:text-sm font-bold text-gray-600 mt-2 flex items-center gap-1.5 group-hover:text-sky-600">
                    <span>5-Star Verified</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Recent Leads & Talent Feed with Enhanced Typography */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Recent Inquiries */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <h3 className="text-base sm:text-lg font-black text-gray-900 uppercase tracking-wide">
                      Recent Client Proposals
                    </h3>
                    <button onClick={() => setActiveSection('inquiries')} className="text-sm text-sky-600 font-bold hover:underline">
                      View All ({inquiries.length})
                    </button>
                  </div>

                  <div className="space-y-3">
                    {inquiries.slice(0, 3).map((inq) => (
                      <div key={inq.id} className="p-4 rounded-2xl bg-slate-50 border border-gray-200 space-y-1.5 hover:border-sky-300 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-base font-bold text-gray-950">{inq.name}</span>
                          <span className="text-xs font-black px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">{inq.status}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 font-medium">{inq.service} • <span className="font-bold text-gray-800">{inq.phone}</span></p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Talent Bank Registrations */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <h3 className="text-base sm:text-lg font-black text-gray-900 uppercase tracking-wide">
                      Future Talent Bank Additions
                    </h3>
                    <button onClick={() => setActiveSection('talent-vault')} className="text-sm text-sky-600 font-bold hover:underline">
                      View All ({talentVaultApplications.length})
                    </button>
                  </div>

                  <div className="space-y-3">
                    {talentVaultApplications.slice(0, 3).map((t) => (
                      <div key={t.id} className="p-4 rounded-2xl bg-slate-50 border border-gray-200 space-y-1.5 hover:border-purple-300 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-base font-bold text-gray-950">{t.fullName}</span>
                          <span className="text-xs font-mono font-bold text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">{t.id}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 font-medium">{t.targetDepartment} • {t.experience} • <span className="font-bold text-gray-800">{t.phone}</span></p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* SECTION 2: SERVICES SPECTRUM MANAGER */}
          {activeSection === 'services' && (
            <div className="space-y-6">
              {!isEditingService ? (
                <>
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-gray-950">Services Spectrum ({services.length} Verticals)</h3>
                      <p className="text-sm text-gray-600 mt-1 font-medium">Edit descriptions, capabilities, FAQs, and SLA metrics for each corporate vertical.</p>
                    </div>
                    <button
                      onClick={() => openServiceModal(null)}
                      className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 shrink-0 transition-transform active:scale-95 cursor-pointer"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Add New Service</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {services.map((srv) => (
                      <div
                        key={srv.id}
                        className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-sky-400 hover:shadow-md transition-all"
                      >
                        <div className="space-y-2.5 max-w-2xl">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black uppercase px-3 py-1 rounded-lg bg-gray-100 text-gray-700 border border-gray-200">
                              {srv.category}
                            </span>
                            <span className={`text-xs font-bold px-3 py-1 rounded-lg border ${srv.accentColor === 'red' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-sky-50 text-sky-700 border-sky-200'
                              }`}>
                              Accent: {srv.accentColor === 'red' ? 'Coral Red' : 'Sky Blue'}
                            </span>
                          </div>
                          <h4 className="text-lg sm:text-xl font-black text-gray-950">{srv.title}</h4>
                          <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-normal">{srv.shortDesc}</p>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {srv.features?.slice(0, 3).map((f, i) => (
                              <span key={i} className="text-xs font-semibold bg-slate-50 text-gray-700 px-3 py-1 rounded-lg border border-gray-200">
                                ✓ {f}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          <button
                            onClick={() => openServiceModal(srv)}
                            className="px-4 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-sm rounded-xl flex items-center gap-2 transition-colors border border-sky-200 cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4 text-sky-600" />
                            <span>Edit Service</span>
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete service vertical "${srv.title}"?`)) {
                                deleteService(srv.id);
                                showToast(`Deleted ${srv.title}`);
                              }
                            }}
                            className="p-2.5 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-xl transition-colors border border-gray-200 cursor-pointer"
                            title="Delete Service"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                /* FULL WIDTH SERVICE STUDIO / CREATOR */
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* Top Action Header */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => { setIsEditingService(false); setEditingItem(null); }}
                        className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        title="Back to Services List"
                      >
                        <ArrowRight className="w-5 h-5 rotate-180" />
                      </button>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-black text-gray-950">
                          {editingItem ? `Edit Service: ${editingItem.title}` : 'Service Studio: Add New Vertical'}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">
                          Full-width service architect with real-time card & capability preview.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                      <button
                        type="button"
                        onClick={() => { setIsEditingService(false); setEditingItem(null); }}
                        className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveService}
                        className="px-7 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-red-600/20 flex items-center gap-2 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Service</span>
                      </button>
                    </div>
                  </div>

                  {/* Two-Column Studio Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Workspace Form (7 cols) */}
                    <form onSubmit={handleSaveService} className="lg:col-span-7 space-y-6">
                      
                      {/* Card 1: Title, Category & Accent */}
                      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                        <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 pb-2 border-b border-gray-100">
                          1. Service Identity & Theming
                        </h4>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Service Title *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Integrated Facilities Management"
                            value={serviceForm.title}
                            onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 font-bold text-base focus:border-red-500 focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Category / Domain</label>
                            <input
                              type="text"
                              placeholder="e.g. Facility Management (IFM)"
                              value={serviceForm.category}
                              onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold focus:border-red-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Accent Theme Color</label>
                            <select
                              value={serviceForm.accentColor}
                              onChange={(e) => setServiceForm({ ...serviceForm, accentColor: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white font-bold text-sm focus:border-red-500 focus:outline-none cursor-pointer"
                            >
                              <option value="sky">Sky Blue (Primary Pillar)</option>
                              <option value="red">Coral Red (Highlight Vertical)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Tagline / Headline</label>
                          <input
                            type="text"
                            placeholder="e.g. 24/7 Corporate Facility Maintenance & Bio-Friendly Consumables"
                            value={serviceForm.tagline}
                            onChange={(e) => setServiceForm({ ...serviceForm, tagline: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-medium focus:border-red-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Card 2: Short Description & Detailed Scope */}
                      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                        <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 pb-2 border-b border-gray-100">
                          2. Scope & Descriptions
                        </h4>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Short Card Description (1-2 lines)</label>
                          <input
                            type="text"
                            placeholder="Summary shown on overview cards..."
                            value={serviceForm.shortDesc}
                            onChange={(e) => setServiceForm({ ...serviceForm, shortDesc: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-medium focus:border-red-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Full Detailed Overview Description</label>
                          <textarea
                            rows={4}
                            placeholder="Comprehensive description of equipment, standard operating procedures, personnel training..."
                            value={serviceForm.description}
                            onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm leading-relaxed font-medium focus:border-red-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Card 3: Features & FAQs */}
                      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                        <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 pb-2 border-b border-gray-100">
                          3. Features & FAQs
                        </h4>
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-bold text-gray-700 uppercase">Key Features (1 per line)</label>
                            <span className="text-[11px] text-gray-400 font-bold">1 feature per row</span>
                          </div>
                          <textarea
                            rows={4}
                            placeholder="State-of-the-art scrubbers and mechanized equipment&#10;100% Bio-friendly eco-safe chemicals&#10;Dedicated on-site facility managers and QA leads"
                            value={serviceForm.featuresText}
                            onChange={(e) => setServiceForm({ ...serviceForm, featuresText: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 font-mono text-xs leading-relaxed focus:border-red-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-bold text-gray-700 uppercase">Frequently Asked Questions</label>
                            <span className="text-[11px] text-gray-400 font-mono">Question | Answer</span>
                          </div>
                          <textarea
                            rows={4}
                            placeholder="How soon can deployment begin? | Deployment starts within 24 to 48 business hours.&#10;Are personnel covered by insurance? | Yes, 100% PF, ESI, and statutory insurance compliance."
                            value={serviceForm.faqsText}
                            onChange={(e) => setServiceForm({ ...serviceForm, faqsText: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 font-mono text-xs leading-relaxed focus:border-red-500 focus:outline-none"
                          />
                        </div>
                      </div>

                    </form>

                    {/* Right Sticky Preview (5 cols) */}
                    <div className="lg:col-span-5 sticky top-24 space-y-4">
                      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                          <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Live Service Card Preview
                          </span>
                          <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                            serviceForm.accentColor === 'red' ? 'bg-red-100 text-red-700' : 'bg-sky-100 text-sky-700'
                          }`}>
                            {serviceForm.accentColor === 'red' ? 'Coral Red' : 'Sky Blue'}
                          </span>
                        </div>

                        <div className="space-y-3">
                          <span className="text-xs font-black uppercase px-3 py-1 rounded-lg bg-gray-100 text-gray-700 inline-block">
                            {serviceForm.category || 'Category'}
                          </span>

                          <h3 className="text-xl font-black text-gray-950 leading-tight">
                            {serviceForm.title || 'Untitled Service'}
                          </h3>

                          {serviceForm.tagline && (
                            <p className="text-xs font-bold text-red-600">
                              {serviceForm.tagline}
                            </p>
                          )}

                          <p className="text-xs text-gray-600 leading-relaxed font-normal">
                            {serviceForm.shortDesc || serviceForm.description || 'Service description preview...'}
                          </p>

                          <div className="pt-2 border-t border-gray-100 space-y-1.5">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Key Highlights</span>
                            {(serviceForm.featuresText ? serviceForm.featuresText.split('\n').filter(Boolean) : ['Dedicated On-Site Supervisor', '100% Statutory Adherence']).slice(0, 4).map((f, i) => (
                              <div key={i} className="text-xs text-gray-700 flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="truncate">{f}</span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-xs font-bold text-sky-600">Explore Deep-Dive Specs →</span>
                            <button
                              type="button"
                              onClick={handleSaveService}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                            >
                              Save & Apply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION 3: CAREERS & VACANCIES MANAGER */}
          {activeSection === 'jobs' && (
            <div className="space-y-6">
              {!isEditingJob ? (
                <>
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-gray-950">Job Vacancies ({jobs.length} Active Positions)</h3>
                      <p className="text-sm text-gray-600 mt-1 font-medium">Manage all job openings, salaries, experience requirements, and urgent hiring badges.</p>
                    </div>
                    <button
                      onClick={() => openJobModal(null)}
                      className="px-5 py-3 bg-gradient-to-r from-red-600 to-sky-600 hover:from-red-700 hover:to-sky-700 text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 shrink-0 transition-transform active:scale-95 cursor-pointer"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Post New Vacancy</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <div
                        key={job.id}
                        className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-red-400 hover:shadow-md transition-all"
                      >
                        <div className="space-y-2.5 max-w-2xl">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black uppercase px-3 py-1 rounded-lg bg-gray-100 text-gray-700 border border-gray-200">
                              {job.department}
                            </span>
                            {job.isHot && (
                              <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-red-100 text-red-700 border border-red-200">
                                🔥 Urgent Hiring
                              </span>
                            )}
                            <span className="text-xs sm:text-sm font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">{job.salary}</span>
                          </div>
                          <h4 className="text-lg sm:text-xl font-black text-gray-950">{job.title}</h4>
                          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-bold text-gray-600">
                            <span>📍 {job.location}</span>
                            <span>⏳ {job.experience}</span>
                            <span>🕒 {job.workingHours || 'Rotational'}</span>
                          </div>
                          <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed font-normal">{job.description}</p>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          <button
                            onClick={() => openJobModal(job)}
                            className="px-4 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-sm rounded-xl flex items-center gap-2 transition-colors border border-sky-200 cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4 text-sky-600" />
                            <span>Edit Vacancy</span>
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete job opening "${job.title}"?`)) {
                                deleteJob(job.id);
                                showToast(`Deleted ${job.title}`);
                              }
                            }}
                            className="p-2.5 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-xl transition-colors border border-gray-200 cursor-pointer"
                            title="Delete Job"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                /* FULL WIDTH JOB / VACANCY STUDIO */
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* Top Action Header */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => { setIsEditingJob(false); setEditingItem(null); }}
                        className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        title="Back to Vacancies List"
                      >
                        <ArrowRight className="w-5 h-5 rotate-180" />
                      </button>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-black text-gray-950">
                          {editingItem ? `Edit Vacancy: ${editingItem.title}` : 'Vacancy Studio: Post New Job'}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">
                          Full-width job architect with live career card preview.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                      <button
                        type="button"
                        onClick={() => { setIsEditingJob(false); setEditingItem(null); }}
                        className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveJob}
                        className="px-7 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-red-600/20 flex items-center gap-2 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Publish Vacancy</span>
                      </button>
                    </div>
                  </div>

                  {/* Two-Column Studio Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Workspace Form (7 cols) */}
                    <form onSubmit={handleSaveJob} className="lg:col-span-7 space-y-6">
                      
                      {/* Card 1: Job Info */}
                      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                        <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 pb-2 border-b border-gray-100">
                          1. Position Details & Package
                        </h4>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Job Title *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Corporate Account Executive (B2B Staffing)"
                            value={jobForm.title}
                            onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 font-bold text-base focus:border-red-500 focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Department</label>
                            <select
                              value={jobForm.department}
                              onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white font-semibold text-sm focus:border-red-500 focus:outline-none cursor-pointer"
                            >
                              <option value="Integrated Facilities">Integrated Facilities</option>
                              <option value="HR & Payroll">HR & Payroll</option>
                              <option value="Engineering & Maintenance">Engineering & Maintenance</option>
                              <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
                              <option value="Quality & Compliance">Quality & Compliance</option>
                              <option value="Sales & Client Relations">Sales & Client Relations</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Location</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Delhi NCR / Gurugram"
                              value={jobForm.location}
                              onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-medium focus:border-red-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Experience Required</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. 2 - 5 Years"
                              value={jobForm.experience}
                              onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-medium focus:border-red-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Salary Range (CTC)</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. ₹4.5L - ₹7.0L / Annum"
                              value={jobForm.salary}
                              onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-bold text-emerald-800 focus:border-red-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Working Hours / Shift</label>
                            <input
                              type="text"
                              placeholder="e.g. General Shift (9:30 AM - 6:30 PM)"
                              value={jobForm.workingHours}
                              onChange={(e) => setJobForm({ ...jobForm, workingHours: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-medium focus:border-red-500 focus:outline-none"
                            />
                          </div>

                          <div className="flex items-center gap-3 pt-6">
                            <input
                              type="checkbox"
                              id="full-studio-hot-job"
                              checked={jobForm.isHot}
                              onChange={(e) => setJobForm({ ...jobForm, isHot: e.target.checked })}
                              className="w-5 h-5 text-red-600 rounded cursor-pointer"
                            />
                            <label htmlFor="full-studio-hot-job" className="font-bold text-gray-800 cursor-pointer text-sm flex items-center gap-1.5">
                              <span>🔥 Mark as Urgent Hiring (Hot Badge)</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Card 2: Description, Responsibilities & Qualifications */}
                      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                        <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 pb-2 border-b border-gray-100">
                          2. Role Specs & Requirements
                        </h4>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Job Description Summary</label>
                          <textarea
                            rows={3}
                            placeholder="Drive B2B enterprise client acquisition for facilities management and workforce staffing..."
                            value={jobForm.description}
                            onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm leading-relaxed font-medium focus:border-red-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-bold text-gray-700 uppercase">Key Responsibilities (1 per line)</label>
                            <span className="text-[11px] text-gray-400 font-bold">1 per line</span>
                          </div>
                          <textarea
                            rows={3}
                            placeholder="Oversee daily operational standards.&#10;Coordinate with client supervisors.&#10;Ensure 100% statutory compliance."
                            value={jobForm.responsibilitiesText}
                            onChange={(e) => setJobForm({ ...jobForm, responsibilitiesText: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 font-mono text-xs leading-relaxed focus:border-red-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-bold text-gray-700 uppercase">Qualifications (1 per line)</label>
                            <span className="text-[11px] text-gray-400 font-bold">1 per line</span>
                          </div>
                          <textarea
                            rows={3}
                            placeholder="Graduate / Diploma in relevant discipline.&#10;Strong communication and client handling."
                            value={jobForm.qualificationsText}
                            onChange={(e) => setJobForm({ ...jobForm, qualificationsText: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 font-mono text-xs leading-relaxed focus:border-red-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Required Skills (Comma separated)</label>
                          <input
                            type="text"
                            placeholder="e.g. B2B Sales, Staffing Deals, Client Relationship, Proposal Negotiation"
                            value={jobForm.skillsText}
                            onChange={(e) => setJobForm({ ...jobForm, skillsText: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-medium focus:border-red-500 focus:outline-none"
                          />
                        </div>
                      </div>

                    </form>

                    {/* Right Sticky Preview (5 cols) */}
                    <div className="lg:col-span-5 sticky top-24 space-y-4">
                      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                          <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                            Live Vacancy Card Preview
                          </span>
                          {jobForm.isHot && (
                            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-red-100 text-red-700">
                              🔥 Urgent Hiring
                            </span>
                          )}
                        </div>

                        <div className="space-y-3">
                          <span className="text-xs font-black uppercase px-3 py-1 rounded-lg bg-gray-100 text-gray-700 inline-block">
                            {jobForm.department || 'Department'}
                          </span>

                          <h3 className="text-xl font-black text-gray-950 leading-tight">
                            {jobForm.title || 'Untitled Vacancy'}
                          </h3>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 font-semibold">
                            <span>📍 {jobForm.location || 'Delhi NCR'}</span>
                            <span>⏳ {jobForm.experience || 'Experience'}</span>
                            <span className="font-black text-emerald-700">{jobForm.salary || 'Salary'}</span>
                          </div>

                          <p className="text-xs text-gray-600 leading-relaxed font-normal line-clamp-3">
                            {jobForm.description || 'Job role summary preview will appear here...'}
                          </p>

                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {(jobForm.skillsText ? jobForm.skillsText.split(',').filter(Boolean) : ['Leadership', 'Operations', 'Client Relations']).map((s, idx) => (
                              <span key={idx} className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                                {s.trim()}
                              </span>
                            ))}
                          </div>

                          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500">Preview Mode</span>
                            <button
                              type="button"
                              onClick={handleSaveJob}
                              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                            >
                              Publish Vacancy
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION 4: RFQ QUOTE LEADS INBOX */}
          {activeSection === 'inquiries' && (
            <div className="space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-950">Client Quotation Inquiries ({inquiries.length})</h3>
                  <p className="text-sm text-gray-600 mt-1 font-medium">Live proposal requests submitted from website quote buttons & cost calculator.</p>
                </div>
                <button
                  type="button"
                  onClick={handleExportInquiriesCSV}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all shrink-0"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Export Leads (CSV)</span>
                </button>
              </div>

              <div className="space-y-4">
                {inquiries.length > 0 ? (
                  inquiries.map((inq) => (
                    <div key={inq.id} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4 hover:border-sky-300 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                        <div>
                          <span className="text-xs font-mono font-bold text-gray-400 block">{inq.id} • {new Date(inq.date).toLocaleDateString()}</span>
                          <h4 className="text-lg font-black text-gray-950 mt-0.5">{inq.name}</h4>
                          {inq.company && <span className="text-xs font-bold text-slate-500">{inq.company}</span>}
                        </div>

                        {/* Status Switcher */}
                        <select
                          value={inq.status}
                          onChange={(e) => updateInquiryStatus(inq.id, e.target.value)}
                          className="px-3.5 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm font-bold bg-white focus:outline-none shadow-xs"
                        >
                          <option value="New Lead">🟢 New Lead</option>
                          <option value="Contacted">🟡 Contacted</option>
                          <option value="Proposal Sent">🔵 Proposal Sent</option>
                          <option value="Contract Signed">⭐ Contract Signed</option>
                          <option value="Closed / Archived">⚪ Closed / Archived</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-gray-700 font-medium">
                        <div><span className="font-bold text-gray-400">Phone:</span> <span className="text-emerald-700 font-bold ml-1">{inq.phone}</span></div>
                        <div><span className="font-bold text-gray-400">Email:</span> <span className="ml-1 font-semibold">{inq.email || 'N/A'}</span></div>
                        <div><span className="font-bold text-gray-400">Location:</span> <span className="ml-1 font-semibold">{inq.location || inq.city || 'Delhi NCR'}</span></div>
                      </div>

                      <div className="text-xs sm:text-sm text-gray-800 bg-slate-50 p-4 rounded-2xl border border-gray-200">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-black text-sky-800">Service Requested: {inq.service}</span>
                          {inq.budgetEstimate && (
                            <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-lg border border-red-200">
                              Budget: {inq.budgetEstimate}
                            </span>
                          )}
                        </div>
                        <p className="leading-relaxed">{inq.scope || inq.requirements || inq.message || 'Standard quote proposal requested.'}</p>
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this inquiry?')) {
                              deleteInquiry(inq.id);
                              showToast('Inquiry deleted.');
                            }
                          }}
                          className="text-xs sm:text-sm text-red-600 hover:text-red-700 hover:underline flex items-center gap-1.5 font-bold cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Remove Lead</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 bg-white rounded-3xl border border-gray-200">
                    <p className="text-sm text-gray-500 font-medium">No client quotation inquiries logged yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION 5: JOB APPLICATIONS INBOX WITH KANBAN & EXCEL EXPORT */}
          {activeSection === 'applications' && (
            <div className="space-y-6">
              {/* Header Bar */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-black text-gray-950">Candidate Recruitment Pipeline</h3>
                    <span className="text-xs font-black bg-sky-100 text-sky-800 px-3 py-1 rounded-full">
                      {jobApplications.length} Applicants
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 font-medium">
                    Manage applicant stages across hiring workflows from Applied to Hired.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
                  {/* View Mode Toggle */}
                  <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setApplicationsViewMode('kanban')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        applicationsViewMode === 'kanban'
                          ? 'bg-white text-slate-950 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <Kanban className="w-3.5 h-3.5 text-sky-600" />
                      <span>Kanban Board</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setApplicationsViewMode('list')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        applicationsViewMode === 'list'
                          ? 'bg-white text-slate-950 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <Table className="w-3.5 h-3.5 text-red-600" />
                      <span>List View</span>
                    </button>
                  </div>

                  {/* CSV Export */}
                  <button
                    type="button"
                    onClick={handleExportApplicationsCSV}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* KANBAN PIPELINE VIEW */}
              {applicationsViewMode === 'kanban' ? (
                <div className="overflow-x-auto pb-4">
                  <div className="flex gap-4 min-w-[1100px] items-start">
                    {[
                      { id: 'Applied', label: 'Applied', color: 'bg-slate-100 text-slate-800 border-slate-300', dot: 'bg-slate-500' },
                      { id: 'Under Review', label: 'Under Review', color: 'bg-amber-50 text-amber-800 border-amber-300', dot: 'bg-amber-500' },
                      { id: 'Shortlisted', label: 'Shortlisted', color: 'bg-sky-50 text-sky-800 border-sky-300', dot: 'bg-sky-500' },
                      { id: 'Interview Scheduled', label: 'Interview Scheduled', color: 'bg-purple-50 text-purple-800 border-purple-300', dot: 'bg-purple-500' },
                      { id: 'Hired', label: 'Hired / Selected', color: 'bg-emerald-50 text-emerald-800 border-emerald-300', dot: 'bg-emerald-500' },
                      { id: 'Rejected', label: 'Archived / Rejected', color: 'bg-red-50 text-red-800 border-red-300', dot: 'bg-red-500' }
                    ].map((stageCol) => {
                      const stageApps = jobApplications.filter(a => (a.stage || a.status || 'Applied').toLowerCase() === stageCol.id.toLowerCase() || ((stageCol.id === 'Applied' || stageCol.id === 'Submitted') && (a.status === 'Submitted' || a.stage === 'Applied')));
                      return (
                        <div key={stageCol.id} className="flex-1 bg-slate-100/90 rounded-2xl p-3.5 border border-slate-200 min-w-[210px] space-y-3">
                          {/* Column Header */}
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                            <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                              <span className={`w-2 h-2 rounded-full ${stageCol.dot}`} />
                              <span>{stageCol.label}</span>
                            </div>
                            <span className="text-xs font-black bg-white px-2 py-0.5 rounded-full text-slate-700 shadow-2xs">
                              {stageApps.length}
                            </span>
                          </div>

                          {/* Candidate Cards in this Stage */}
                          <div className="space-y-3 min-h-[140px]">
                            {stageApps.length > 0 ? (
                              stageApps.map((app) => (
                                <div
                                  key={app.refId}
                                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:border-sky-400 transition-all space-y-2.5"
                                >
                                  <div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-mono text-slate-400">{app.refId}</span>
                                      <span className="text-[10px] font-semibold text-slate-500">
                                        {app.date ? new Date(app.date).toLocaleDateString() : 'Recent'}
                                      </span>
                                    </div>
                                    <h5 className="text-sm font-extrabold text-slate-900 mt-0.5">{app.fullName}</h5>
                                    <p className="text-[11px] font-bold text-red-600 line-clamp-1">{app.jobTitle}</p>
                                  </div>

                                  <div className="text-[11px] text-slate-600 space-y-0.5">
                                    <div>📞 <span className="font-semibold">{app.phone}</span></div>
                                    {app.experience && <div>⏳ {app.experience}</div>}
                                    {app.currentLocation && <div>📍 {app.currentLocation}</div>}
                                  </div>

                                  {/* Quick Stage Mover Selector */}
                                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                                    <select
                                      value={app.stage || app.status || 'Applied'}
                                      onChange={(e) => updateJobApplicationStatus(app.refId, e.target.value)}
                                      className="text-[10px] font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none text-slate-700 w-full cursor-pointer"
                                    >
                                      <option value="Applied">Applied</option>
                                      <option value="Under Review">Under Review</option>
                                      <option value="Shortlisted">Shortlisted</option>
                                      <option value="Interview Scheduled">Interview Scheduled</option>
                                      <option value="Hired">Hired</option>
                                      <option value="Rejected">Rejected</option>
                                    </select>

                                    <button
                                      type="button"
                                      onClick={() => handleDownloadResume(app)}
                                      className="p-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 shrink-0 cursor-pointer"
                                      title="Download CV"
                                    >
                                      <Download className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-8 text-[11px] text-slate-400 font-medium">
                                No candidates in this stage
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* LIST VIEW OF APPLICATIONS */
                <div className="space-y-4">
                  {jobApplications.length > 0 ? (
                    jobApplications.map((app) => (
                      <div key={app.refId} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                          <div>
                            <span className="text-xs font-mono font-bold text-gray-400 block">{app.refId} • {new Date(app.date).toLocaleDateString()}</span>
                            <h4 className="text-lg font-black text-gray-950 mt-0.5">{app.fullName}</h4>
                            <span className="text-xs sm:text-sm font-bold text-red-600">Applied for: {app.jobTitle}</span>
                          </div>

                          <select
                            value={app.stage || app.status || 'Applied'}
                            onChange={(e) => updateJobApplicationStatus(app.refId, e.target.value)}
                            className="px-3.5 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm font-bold bg-white focus:outline-none shadow-xs"
                          >
                            <option value="Applied">🟢 Applied</option>
                            <option value="Under Review">🟡 Under Review</option>
                            <option value="Shortlisted">🔵 Shortlisted</option>
                            <option value="Interview Scheduled">🟣 Interview Scheduled</option>
                            <option value="Hired">⭐ Hired / Onboarded</option>
                            <option value="Rejected">🔴 Rejected</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-gray-700 font-medium">
                          <div><span className="font-bold text-gray-400">Phone:</span> <span className="text-emerald-700 font-bold ml-1">{app.phone}</span></div>
                          <div><span className="font-bold text-gray-400">Email:</span> <span className="ml-1 font-semibold">{app.email || 'N/A'}</span></div>
                          <div><span className="font-bold text-gray-400">Experience:</span> <span className="ml-1 font-semibold">{app.experience}</span></div>
                        </div>

                        {app.resumeFileName && (
                          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-sky-50 border border-sky-200">
                            <div className="flex items-center gap-2 text-xs font-bold text-sky-900">
                              <FileText className="w-4 h-4 text-sky-600" />
                              <span>{app.resumeFileName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleDownloadResume(app)}
                                className="px-3 py-1.5 bg-white hover:bg-sky-100 text-sky-800 rounded-lg text-xs font-bold border border-sky-300 flex items-center gap-1 cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Download</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {app.message && (
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-800">
                            <span className="font-bold text-slate-500 block mb-1">Candidate Statement:</span>
                            {app.message}
                          </div>
                        )}

                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => {
                              if (window.confirm('Delete this application?')) {
                                deleteJobApplication(app.refId);
                                showToast('Application removed.');
                              }
                            }}
                            className="text-xs sm:text-sm text-red-600 hover:text-red-700 hover:underline flex items-center gap-1.5 font-bold cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Remove Application</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16 bg-white rounded-3xl border border-gray-200">
                      <p className="text-sm text-gray-500 font-medium">No candidate applications logged yet.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* SECTION 6: FUTURE TALENT BANK VAULT */}
          {activeSection === 'talent-vault' && (
            <div className="space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-950">National Resource Cell Future Talent Bank ({talentVaultApplications.length})</h3>
                  <p className="text-sm text-gray-600 mt-1 font-medium">Central resume registry for upcoming corporate facilities and logistics staff scout calls.</p>
                </div>
                <button
                  type="button"
                  onClick={handleExportTalentVaultCSV}
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all shrink-0"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Export Talent Pool (CSV)</span>
                </button>
              </div>

              <div className="space-y-4">
                {talentVaultApplications.length > 0 ? (
                  talentVaultApplications.map((t) => (
                    <div key={t.id} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                        <div>
                          <span className="text-xs font-mono font-bold text-gray-400 block">{t.id} • {new Date(t.date).toLocaleDateString()}</span>
                          <h4 className="text-lg font-black text-gray-950 mt-0.5">{t.fullName}</h4>
                          <span className="text-xs sm:text-sm font-bold text-sky-800">Domain: {t.targetDepartment}</span>
                        </div>

                        <select
                          value={t.status}
                          onChange={(e) => updateTalentVaultStatus(t.id, e.target.value)}
                          className="px-3.5 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm font-bold bg-white focus:outline-none shadow-xs"
                        >
                          <option value="Resource Cell Indexed">🟣 Resource Cell Indexed</option>
                          <option value="Contacted for Project">🟢 Contacted for Project</option>
                          <option value="Under Training">🟡 Under Training</option>
                          <option value="Deployed on Site">⭐ Deployed on Site</option>
                          <option value="Archived">⚪ Archived</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-gray-700 font-medium">
                        <div><span className="font-bold text-gray-400">Phone:</span> <span className="text-emerald-700 font-bold ml-1">{t.phone}</span></div>
                        <div><span className="font-bold text-gray-400">Location:</span> <span className="ml-1 font-semibold">{t.preferredLocation}</span></div>
                        <div><span className="font-bold text-gray-400">Notice:</span> <span className="ml-1 font-semibold">{t.noticePeriod || 'Immediate'}</span></div>
                      </div>

                      {t.keySkills && (
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-800">
                          <span className="font-bold text-slate-500 block mb-1">Key Skills & Experience:</span>
                          {t.keySkills}
                        </div>
                      )}

                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this profile from talent vault?')) {
                              deleteTalentVaultApplication(t.id);
                              showToast('Profile removed from vault.');
                            }
                          }}
                          className="text-xs sm:text-sm text-red-600 hover:text-red-700 hover:underline flex items-center gap-1.5 font-bold cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Remove Profile</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 bg-white rounded-3xl border border-gray-200">
                    <p className="text-sm text-gray-500 font-medium">No talent pool profiles registered yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION: BLOG & INSIGHTS CMS */}
          {activeSection === 'blogs' && (
            <div className="space-y-6">
              {!isEditingBlog ? (
                <>
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-gray-950">Blog & Knowledge Hub CMS ({blogs?.length || 0} Articles)</h3>
                      <p className="text-sm text-gray-600 mt-1 font-medium">Publish labour law advisories, mechanized facility management guides, and industry news.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingBlogItem(null);
                        setBlogForm({
                          title: '',
                          slug: '',
                          category: 'Statutory Compliance',
                          excerpt: '',
                          author: 'MANABS Editorial Board',
                          authorRole: 'Compliance & Strategy Lead',
                          coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1200&auto=format&fit=crop',
                          readTime: '5 min read',
                          tagsText: 'Compliance, Labour Law, Facility',
                          contentSectionsText: 'Why Compliance Matters|Principal employers are held jointly liable for defaults by their contractors.\nAudit Checklist|Ensure 100% verified ECR challans for PF and ESI every month.',
                          featured: false
                        });
                        setIsEditingBlog(true);
                      }}
                      className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Write New Article</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {blogs && blogs.map((post) => (
                      <div
                        key={post.id}
                        className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between hover:border-red-400 hover:shadow-md transition-all"
                      >
                        <div>
                          <div className="h-44 overflow-hidden relative">
                            <img
                              src={post.coverImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop'}
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-black/70 text-red-300 text-[10px] font-bold uppercase tracking-wider border border-white/10">
                              {post.category}
                            </span>
                            {post.featured && (
                              <span className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider">
                                Featured
                              </span>
                            )}
                          </div>

                          <div className="p-6 space-y-2.5">
                            <div className="text-[11px] text-gray-400 flex items-center gap-2">
                              <span>{post.publishedDate}</span>
                              <span>•</span>
                              <span>{post.readTime}</span>
                            </div>
                            <h4 className="text-base sm:text-lg font-black text-gray-950 line-clamp-2">
                              {post.title}
                            </h4>
                            <p className="text-xs text-gray-500 line-clamp-2">
                              {post.excerpt}
                            </p>
                          </div>
                        </div>

                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                          <button
                            onClick={() => onNavigate('blog')}
                            className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5 text-red-600" />
                            <span>Preview</span>
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingBlogItem(post);
                                setBlogForm({
                                  title: post.title,
                                  slug: post.slug,
                                  category: post.category || 'Statutory Compliance',
                                  excerpt: post.excerpt || '',
                                  author: post.author || 'MANABS Editorial Board',
                                  authorRole: post.authorRole || 'Compliance & Strategy Lead',
                                  coverImage: post.coverImage || '',
                                  readTime: post.readTime || '5 min read',
                                  tagsText: post.tags ? post.tags.join(', ') : '',
                                  contentSectionsText: Array.isArray(post.content)
                                    ? post.content.map(c => `${c.heading}|${c.text}`).join('\n')
                                    : (post.content || ''),
                                  featured: !!post.featured
                                });
                                setIsEditingBlog(true);
                              }}
                              className="p-2 bg-white hover:bg-sky-50 text-sky-700 rounded-xl transition-colors border border-gray-200 cursor-pointer"
                              title="Edit Post"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete article "${post.title}"?`)) {
                                  deleteBlogPost(post.id);
                                  showToast(`Article "${post.title}" deleted.`);
                                }
                              }}
                              className="p-2 bg-white hover:bg-red-50 text-red-600 rounded-xl transition-colors border border-gray-200 cursor-pointer"
                              title="Delete Post"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                /* BLOG EDITOR STUDIO */
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="bg-white p-6 rounded-3xl border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsEditingBlog(false)}
                        className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                      >
                        <ArrowRight className="w-5 h-5 rotate-180" />
                      </button>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-black text-gray-950">
                          {editingBlogItem ? `Edit: ${editingBlogItem.title}` : 'Article Studio: Create New Guide'}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium">Publish rich corporate thought leadership guides.</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                      <button
                        type="button"
                        onClick={() => setIsEditingBlog(false)}
                        className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!blogForm.title.trim()) return;
                          const tags = blogForm.tagsText.split(',').map(t => t.trim()).filter(Boolean);
                          const content = blogForm.contentSectionsText.split('\n').filter(Boolean).map(line => {
                            const [h, ...rest] = line.split('|');
                            return { heading: h.trim(), text: rest.join('|').trim() };
                          });

                          if (editingBlogItem) {
                            updateBlogPost(editingBlogItem.id, {
                              ...blogForm,
                              tags,
                              content
                            });
                            showToast(`Article "${blogForm.title}" updated!`);
                          } else {
                            addBlogPost({
                              ...blogForm,
                              tags,
                              content
                            });
                            showToast(`New article "${blogForm.title}" published!`);
                          }
                          setIsEditingBlog(false);
                        }}
                        className="px-7 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Publish Article</span>
                      </button>
                    </div>
                  </div>

                  {/* FULL-WIDTH BLOG STUDIO EDITOR */}
                  <div className="space-y-6">
                    {/* Card 1: Article Metadata */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-5">
                      <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 pb-2 border-b border-gray-100 flex items-center justify-between">
                        <span>1. Article Metadata & Headline</span>
                        <span className="text-xs text-red-600 font-semibold uppercase tracking-wider">Required *</span>
                      </h4>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Article Title *</label>
                        <input
                          type="text"
                          required
                          value={blogForm.title}
                          onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                          placeholder="e.g. Statutory Labour Law Compliance in India: 2026 Checklist"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 font-bold text-base focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Category</label>
                          <select
                            value={blogForm.category}
                            onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold bg-white focus:border-red-500 focus:outline-none"
                          >
                            <option value="Statutory Compliance">Statutory Compliance</option>
                            <option value="Facility Management">Facility Management</option>
                            <option value="Staffing & Payroll">Staffing & Payroll</option>
                            <option value="Tech & Automation">Tech & Automation</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Estimated Read Time</label>
                          <input
                            type="text"
                            value={blogForm.readTime}
                            onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                            placeholder="e.g. 6 min read"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-medium focus:border-red-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Author Byline</label>
                          <input
                            type="text"
                            value={blogForm.author}
                            onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                            placeholder="e.g. MANABS Statutory Advisory"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-medium focus:border-red-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Cover Image URL</label>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                          <input
                            type="url"
                            value={blogForm.coverImage}
                            onChange={(e) => setBlogForm({ ...blogForm, coverImage: e.target.value })}
                            placeholder="https://images.unsplash.com/photo-..."
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-xs font-mono focus:border-red-500 focus:outline-none"
                          />
                          {blogForm.coverImage && (
                            <div className="w-20 h-12 rounded-xl overflow-hidden border border-gray-200 shrink-0 bg-slate-100">
                              <img src={blogForm.coverImage} alt="Thumbnail" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card 2: Summary & Excerpt */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                      <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 pb-2 border-b border-gray-100">
                        2. Summary & SEO Snippet
                      </h4>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Summary / Excerpt *</label>
                        <textarea
                          rows={3}
                          required
                          value={blogForm.excerpt}
                          onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                          placeholder="Short 2-3 sentence executive overview for cards, meta descriptions and search preview..."
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm leading-relaxed font-medium focus:border-red-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Card 3: Body & Content Sections */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-gray-100 gap-2">
                        <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                          3. Article Body & Structured Sections
                        </h4>
                        <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-lg font-mono font-semibold">
                          Format: Heading | Detailed Paragraph per line
                        </span>
                      </div>

                      <div>
                        <textarea
                          rows={10}
                          value={blogForm.contentSectionsText}
                          onChange={(e) => setBlogForm({ ...blogForm, contentSectionsText: e.target.value })}
                          placeholder="Understanding EPF & ESI Guidelines | Managing payroll for contract workers requires dedicated compliance with the Employees' Provident Fund and ESI Act...&#10;Zero-Liability Audit Checkpoints | Implement quarterly third-party audits and verify challans before vendor invoice disbursement."
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 text-xs font-mono leading-relaxed focus:border-red-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Keywords & Tags (Comma separated)</label>
                        <input
                          type="text"
                          value={blogForm.tagsText}
                          onChange={(e) => setBlogForm({ ...blogForm, tagsText: e.target.value })}
                          placeholder="EPF, ESI, Minimum Wages, Staffing, Facility Management"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 text-xs font-medium focus:border-red-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION: ALERTS & NOTIFICATIONS SETTINGS */}
          {activeSection === 'notifications' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-950">Real-time Alerts & Webhooks</h3>
                  <p className="text-sm text-gray-600 mt-1 font-medium">
                    Configure automated notifications for quote requests, candidate applications, and audio chimes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    addNotification({
                      type: 'test',
                      title: '🔔 Test Notification Alert',
                      message: 'System sound chime & webhook test dispatched successfully!'
                    });
                    showToast('Dispatched test alert with audio chime!');
                  }}
                  className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all shrink-0"
                >
                  <Bell className="w-4 h-4" />
                  <span>Send Test Alert Chime</span>
                </button>
              </div>

              {/* Webhook & Notification Settings Form */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
                <h4 className="text-sm font-black uppercase tracking-wider text-slate-900 pb-3 border-b border-gray-100">
                  Notification Dispatch Channels
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Admin Notification Email</label>
                    <input
                      type="email"
                      value={emailConfig.adminEmail}
                      onChange={(e) => setEmailConfig({ ...emailConfig, adminEmail: e.target.value })}
                      placeholder="operations@manabs.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Custom Webhook Endpoint URL (Slack / Zapier / Make)</label>
                    <input
                      type="url"
                      value={emailConfig.webhookUrl}
                      onChange={(e) => setEmailConfig({ ...emailConfig, webhookUrl: e.target.value })}
                      placeholder="https://hooks.slack.com/services/..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 text-xs font-mono focus:border-red-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">In-App Audio Chime</span>
                    <input
                      type="checkbox"
                      checked={emailConfig.enableSoundChime}
                      onChange={(e) => setEmailConfig({ ...emailConfig, enableSoundChime: e.target.checked })}
                      className="w-4 h-4 accent-red-600 cursor-pointer"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Browser Push Alerts</span>
                    <button
                      type="button"
                      onClick={() => {
                        if ('Notification' in window) {
                          Notification.requestPermission().then(permission => {
                            showToast(`Browser permission status: ${permission}`);
                          });
                        }
                      }}
                      className="text-[11px] font-bold text-sky-600 underline cursor-pointer"
                    >
                      Request Permission
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Live Status Banner</span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Active</span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      updateEmailSettings(emailConfig);
                      showToast('Notification settings saved successfully!');
                    }}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm cursor-pointer"
                  >
                    Save Settings
                  </button>
                </div>
              </div>

              {/* Notification Activity Feed */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h4 className="text-sm font-black uppercase tracking-wider text-slate-900">
                    Recent In-App Notifications Feed ({notifications.length})
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => { markNotificationsRead(); showToast('Marked all as read'); }}
                      className="text-xs text-sky-600 font-bold hover:underline cursor-pointer"
                    >
                      Mark all as read
                    </button>
                    <button
                      type="button"
                      onClick={() => { clearNotifications(); showToast('Cleared notification log'); }}
                      className="text-xs text-red-600 font-bold hover:underline cursor-pointer"
                    >
                      Clear Log
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 rounded-2xl border flex items-start justify-between gap-4 transition-all ${
                          notif.read ? 'bg-slate-50 border-slate-200' : 'bg-red-50/60 border-red-200 ring-1 ring-red-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-xl mt-0.5 ${notif.read ? 'bg-slate-200 text-slate-600' : 'bg-red-600 text-white'}`}>
                            <Bell className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-extrabold text-slate-900">{notif.title}</div>
                            <p className="text-xs text-slate-600 mt-0.5">{notif.message}</p>
                            <span className="text-[10px] text-slate-400 font-medium block mt-1">
                              {notif.time ? new Date(notif.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                            </span>
                          </div>
                        </div>

                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-red-600 mt-2 shrink-0 animate-ping" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-xs text-slate-400 font-medium">
                      No notifications in the log.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 7: COMPANY HERITAGE, STATS & STATUTORY COMPLIANCES */}
          {activeSection === 'company-info' && (
            <div className="space-y-6">

              {/* Stats Grid */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                <div>
                  <h3 className="text-xl font-black text-gray-950">Hero & Heritage Statistics</h3>
                  <p className="text-sm text-gray-600 mt-1 font-medium">Key proof points displayed on Home & About pages.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  {companyStats.map((st) => (
                    <div key={st.id} className="p-5 rounded-2xl bg-slate-50 border border-gray-200 space-y-2.5">
                      <span className="text-2xl font-black text-sky-700 block">{st.value}</span>
                      <label className="block text-xs font-bold text-gray-500 uppercase">Metric Label</label>
                      <input
                        type="text"
                        value={st.label}
                        onChange={(e) => updateStat(st.id, { label: e.target.value })}
                        className="w-full px-3 py-2 text-sm font-bold rounded-xl border border-gray-300 bg-white shadow-2xs"
                      />
                      <label className="block text-xs font-bold text-gray-500 uppercase">Subtext</label>
                      <input
                        type="text"
                        value={st.subtext}
                        onChange={(e) => updateStat(st.id, { subtext: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm text-gray-600 font-medium rounded-xl border border-gray-300 bg-white shadow-2xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Statutory Compliances */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                <div>
                  <h3 className="text-xl font-black text-gray-950">Statutory Compliance Registrations</h3>
                  <p className="text-sm text-gray-600 mt-1 font-medium">PF, ESI, PAN, and GST regulatory declarations.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {statutoryCompliances.map((c, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-gray-200 space-y-2.5">
                      <label className="block text-xs font-bold text-gray-500 uppercase">Compliance Title</label>
                      <input
                        type="text"
                        value={c.title}
                        onChange={(e) => updateCompliance(i, { title: e.target.value })}
                        className="w-full px-3 py-2 text-sm font-bold rounded-xl border border-gray-300 bg-white"
                      />
                      <label className="block text-xs font-bold text-gray-500 uppercase">Details</label>
                      <textarea
                        rows={2}
                        value={c.desc}
                        onChange={(e) => updateCompliance(i, { desc: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm text-gray-700 font-medium rounded-xl border border-gray-300 bg-white"
                      />
                      <label className="block text-xs font-bold text-gray-500 uppercase">Registration Code / Standard</label>
                      <input
                        type="text"
                        value={c.code}
                        onChange={(e) => updateCompliance(i, { code: e.target.value })}
                        className="w-full px-3 py-2 text-xs font-mono font-bold text-sky-800 bg-sky-50 rounded-xl border border-sky-200"
                      />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* SECTION 8: CLIENT TESTIMONIALS */}
          {activeSection === 'testimonials' && (
            <div className="space-y-6">

              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-950">Client Reviews & Testimonials ({testimonials.length})</h3>
                  <p className="text-sm text-gray-600 mt-1 font-medium">Manage client quotes, star ratings, and facility satisfaction metrics.</p>
                </div>
                <button
                  onClick={() => openTestimonialModal(null)}
                  className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 shrink-0 transition-transform active:scale-95"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Testimonial</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {testimonials.map((t) => (
                  <div key={t.id} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-sky-300 transition-colors">
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase px-3 py-1 rounded-md bg-sky-50 text-sky-800 border border-sky-200">
                          {t.serviceUsed}
                        </span>
                        <span className="text-amber-500 font-black text-base">{'★'.repeat(t.rating)}</span>
                      </div>
                      <h4 className="text-base sm:text-lg font-black text-gray-950">{t.clientName}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 font-semibold">{t.designation} • {t.company} ({t.location})</p>
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic bg-slate-50 p-3 rounded-xl border border-gray-100">"{t.quote}"</p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">Metric: {t.metric}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openTestimonialModal(t)}
                          className="p-2 bg-slate-100 hover:bg-sky-100 text-sky-700 rounded-xl transition-colors border border-gray-200"
                          title="Edit Review"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete review from "${t.clientName}"?`)) {
                              deleteTestimonial(t.id);
                              showToast('Testimonial deleted.');
                            }
                          }}
                          className="p-2 bg-slate-100 hover:bg-red-50 text-red-600 rounded-xl transition-colors border border-gray-200"
                          title="Delete Review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* SECTION: NAVIGATION MENU MANAGER */}
          {activeSection === 'navigation' && (
            <div className="space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-950">Navbar Navigation Menu ({navItems?.length || 0} Items)</h3>
                  <p className="text-sm text-gray-600 mt-1 font-medium">Manage top header and mobile navigation links, order, live hot badges, and visibility.</p>
                </div>
                <button
                  onClick={() => openNavModal()}
                  className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Menu Item</span>
                </button>
              </div>

              {/* Navigation Items List */}
              <div className="space-y-3">
                {navItems && navItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-emerald-400 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => moveNavItem(idx, -1)}
                          className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5 text-slate-700" />
                        </button>
                        <button
                          disabled={idx === navItems.length - 1}
                          onClick={() => moveNavItem(idx, 1)}
                          className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5 text-slate-700" />
                        </button>
                      </div>

                      <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shrink-0">
                        #{idx + 1}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-base font-extrabold text-slate-950">{item.label}</h4>
                          {item.isHot && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                              HOT PIN
                            </span>
                          )}
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${item.isVisible ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                            }`}>
                            {item.isVisible ? 'Visible in Navbar' : 'Hidden'}
                          </span>
                        </div>
                        <p className="text-xs font-mono text-slate-500 mt-1">
                          Target Route: <span className="text-sky-600 font-bold">{item.path}</span> ({item.type || 'internal'})
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-auto sm:ml-0">
                      <button
                        onClick={() => toggleNavItemVisibility(item.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${item.isVisible ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                      >
                        {item.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{item.isVisible ? 'Hide' : 'Show'}</span>
                      </button>
                      <button
                        onClick={() => openNavModal(item)}
                        className="p-2 bg-slate-100 hover:bg-sky-50 text-sky-700 rounded-xl transition-colors border border-gray-200 cursor-pointer"
                        title="Edit Menu Item"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete navigation item "${item.label}"?`)) {
                            deleteNavItem(item.id);
                            showToast(`Deleted "${item.label}" from navbar`);
                          }
                        }}
                        className="p-2 bg-slate-100 hover:bg-red-50 text-red-600 rounded-xl transition-colors border border-gray-200 cursor-pointer"
                        title="Delete Menu Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: CUSTOM PAGES & DYNAMIC CMS */}
          {activeSection === 'pages' && (
            <div className="space-y-6">
              {!isEditingPage ? (
                <>
                  {/* Header Bar */}
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-gray-950">Dynamic Custom Pages ({customPages?.length || 0} Pages)</h3>
                      <p className="text-sm text-gray-600 mt-1 font-medium">Create and publish custom pages with rich content sections, hero banners, and direct links.</p>
                    </div>
                    <button
                      onClick={() => openPageEditor()}
                      className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create New Page</span>
                    </button>
                  </div>

                  {/* Custom Pages Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {customPages && customPages.map((page) => (
                      <div
                        key={page.id}
                        className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between hover:border-sky-400 hover:shadow-md transition-all"
                      >
                        <div className="p-6 sm:p-7 space-y-4">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                              {page.badge || 'Custom Page'}
                            </span>
                            <span className="text-xs font-mono font-bold text-slate-400">
                              #/p/{page.slug}
                            </span>
                          </div>

                          <div>
                            <h4 className="text-lg sm:text-xl font-black text-slate-950">{page.title}</h4>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                              {page.heroTagline || page.content}
                            </p>
                          </div>

                          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between font-medium">
                            <span>{page.sections?.length || 0} Content Blocks</span>
                            <span className="text-emerald-700 font-bold">● Published Live</span>
                          </div>
                        </div>

                        <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            onClick={() => onNavigate(`p/${page.slug}`)}
                            className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5 text-sky-600" />
                            <span>View Live Page</span>
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openPageEditor(page)}
                              className="p-2 bg-white hover:bg-sky-50 text-sky-700 rounded-xl transition-colors border border-gray-200 cursor-pointer"
                              title="Edit Page"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete custom page "${page.title}"?`)) {
                                  deleteCustomPage(page.id);
                                  showToast(`Page "${page.title}" deleted`);
                                }
                              }}
                              className="p-2 bg-white hover:bg-red-50 text-red-600 rounded-xl transition-colors border border-gray-200 cursor-pointer"
                              title="Delete Page"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                /* FULL WIDTH DEDICATED PAGE STUDIO / CREATOR */
                <div className="space-y-6 animate-in fade-in duration-150">

                  {/* Top Action Header */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsEditingPage(false)}
                        className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        title="Back to Pages List"
                      >
                        <ArrowRight className="w-5 h-5 rotate-180" />
                      </button>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-black text-gray-950">
                          {editingItem ? `Edit Page: ${editingItem.title}` : 'Page Studio: Create New Page'}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">
                          Full-width page architect with live interactive preview.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                      <button
                        type="button"
                        onClick={() => setIsEditingPage(false)}
                        className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSavePage}
                        className="px-7 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-red-600/20 flex items-center gap-2 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save & Publish</span>
                      </button>
                    </div>
                  </div>

                  {/* Full Width Studio: Two Column Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* Left Form Workspace (7 Cols) */}
                    <form onSubmit={handleSavePage} className="lg:col-span-7 space-y-6">

                      {/* 1. Basic Metadata Card */}
                      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                        <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 pb-2 border-b border-gray-100">
                          1. Page Title & URL Routing
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Page Title *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Quality & Environmental Policy"
                              value={pageForm.title}
                              onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl border border-gray-300 font-bold text-sm focus:border-red-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">URL Slug</label>
                            <div className="flex items-center">
                              <span className="px-3 py-3 rounded-l-xl bg-slate-100 border border-r-0 border-gray-300 text-xs font-mono text-slate-500">
                                #/p/
                              </span>
                              <input
                                type="text"
                                placeholder="quality-policy"
                                value={pageForm.slug}
                                onChange={(e) => setPageForm({ ...pageForm, slug: e.target.value })}
                                className="w-full px-3.5 py-3 rounded-r-xl border border-gray-300 font-mono text-xs focus:border-red-500 focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Header Badge Pill</label>
                            <input
                              type="text"
                              placeholder="e.g. Statutory Assurance"
                              value={pageForm.badge}
                              onChange={(e) => setPageForm({ ...pageForm, badge: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-medium focus:border-red-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Hero Background Image</label>
                            <input
                              type="url"
                              placeholder="https://images.unsplash.com/..."
                              value={pageForm.heroImage}
                              onChange={(e) => setPageForm({ ...pageForm, heroImage: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-xs font-mono focus:border-red-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Hero Headline Tagline</label>
                          <input
                            type="text"
                            placeholder="e.g. 100% Statutory Compliant Facility & Manpower Governance across North India"
                            value={pageForm.heroTagline}
                            onChange={(e) => setPageForm({ ...pageForm, heroTagline: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-medium focus:border-red-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* 2. Overview Content Card */}
                      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                        <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 pb-2 border-b border-gray-100">
                          2. Introduction & Scope Statement
                        </h4>
                        <div>
                          <textarea
                            rows={4}
                            placeholder="Write a clear statement of policies, certifications, workforce standards, or services overview..."
                            value={pageForm.content}
                            onChange={(e) => setPageForm({ ...pageForm, content: e.target.value })}
                            className="w-full px-4 py-3.5 rounded-xl border border-gray-300 text-sm leading-relaxed font-medium focus:border-red-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* 3. Key Content Blocks Card */}
                      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                          <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                            3. Key Content Blocks & Detailed Standards
                          </h4>
                          <span className="text-[11px] font-bold text-slate-400">Format: Heading | Description</span>
                        </div>
                        <div>
                          <textarea
                            rows={5}
                            value={pageForm.sectionsText}
                            onChange={(e) => setPageForm({ ...pageForm, sectionsText: e.target.value })}
                            className="w-full px-4 py-3.5 rounded-xl border border-gray-300 font-mono text-xs leading-relaxed focus:border-red-500 focus:outline-none"
                            placeholder="100% PF & ESI Adherence | All challans uploaded by the 15th of each month.&#10;ISO 9001 Quality Checklists | Mandatory daily audit reports and surprise inspections."
                          />
                        </div>
                      </div>

                      {/* 4. Navbar Publishing Settings */}
                      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="fullPageInNavbar"
                            checked={pageForm.showInNavbar}
                            onChange={(e) => setPageForm({ ...pageForm, showInNavbar: e.target.checked })}
                            className="w-5 h-5 text-red-600 rounded cursor-pointer"
                          />
                          <label htmlFor="fullPageInNavbar" className="text-sm font-bold text-gray-800 cursor-pointer">
                            Automatically add direct link to Top Header Navbar
                          </label>
                        </div>
                      </div>

                    </form>

                    {/* Right Sticky Real-Time Live Preview (5 Cols) */}
                    <div className="lg:col-span-5 sticky top-24 space-y-4">
                      <div className="bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
                        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                            <span className="text-xs font-bold uppercase tracking-wider">Live Real-Time Preview</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">
                            #/p/{pageForm.slug || 'page-slug'}
                          </span>
                        </div>

                        {/* Hero Simulation */}
                        <div className="relative bg-[#071324] text-white p-6 overflow-hidden">
                          {pageForm.heroImage && (
                            <img
                              src={pageForm.heroImage}
                              alt="Preview background"
                              className="absolute inset-0 w-full h-full object-cover opacity-25"
                            />
                          )}
                          <div className="relative z-10 space-y-3">
                            <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 text-sky-300 border border-white/20">
                              {pageForm.badge || 'Official Document'}
                            </span>
                            <h3 className="text-xl font-black text-white leading-tight">
                              {pageForm.title || 'Page Title Preview'}
                            </h3>
                            <p className="text-xs text-slate-300 line-clamp-2">
                              {pageForm.heroTagline || 'Hero headline subtitle preview...'}
                            </p>
                          </div>
                        </div>

                        {/* Body Content Simulation */}
                        <div className="p-5 space-y-4 bg-slate-50 max-h-[360px] overflow-y-auto text-xs">
                          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1.5 shadow-xs">
                            <span className="text-[10px] font-bold uppercase text-red-600 block">Overview Statement</span>
                            <p className="text-slate-700 leading-relaxed line-clamp-4">
                              {pageForm.content || 'Overview description will be formatted here.'}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <span className="text-[10px] font-bold uppercase text-slate-500 block">Content Blocks Preview</span>
                            {pageForm.sectionsText.split('\n').filter(Boolean).map((line, idx) => {
                              const [h, ...t] = line.split('|');
                              return (
                                <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
                                  <div className="font-bold text-slate-900">{h ? h.trim() : `Block #${idx + 1}`}</div>
                                  <div className="text-[11px] text-slate-600 line-clamp-2">{t.join('|').trim()}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              )}
            </div>
          )}

          {/* SECTION 9: SYSTEM SETTINGS & RESTORE TOOLS */}
          {activeSection === 'settings' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-950">System Settings & Data Tools</h3>
                <p className="text-sm text-gray-600 mt-1 font-medium">Export site backups or reset all dynamic data to initial MANABS defaults.</p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="p-6 rounded-2xl bg-sky-50 border border-sky-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-base font-black text-sky-950">Export Complete Website Backup</h4>
                    <p className="text-xs sm:text-sm text-sky-800 font-medium mt-0.5">Downloads a timestamped JSON file containing all customized services, jobs, leads, and stats.</p>
                  </div>
                  <button
                    onClick={handleExportBackup}
                    className="px-5 py-3 bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0 flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download JSON</span>
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-red-50 border border-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-base font-black text-red-950">Reset All Data to System Defaults</h4>
                    <p className="text-xs sm:text-sm text-red-800 font-medium mt-0.5">Restores default 5 services, official job openings, stats, and clears test lead data.</p>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you absolutely sure you want to reset all dynamic website data back to factory defaults?')) {
                        resetAllToDefaults();
                        showToast('All website data reset to default successfully!');
                      }
                    }}
                    className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0 flex items-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>Reset to Defaults</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* SERVICE EDIT/CREATE MODAL */}
      {modalType === 'service' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-10 max-w-2xl w-full shadow-2xl relative border border-gray-200 text-gray-900 max-h-[90vh] overflow-y-auto my-6">
            <button onClick={() => setModalType(null)} className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 rounded-full">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-black text-gray-950 mb-6 pb-3 border-b border-gray-100">
              {editingItem ? `Edit Service: ${editingItem.title}` : 'Add New Service Vertical'}
            </h3>
            <form onSubmit={handleSaveService} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-gray-800 uppercase mb-1.5">Service Title *</label>
                <input
                  type="text"
                  required
                  value={serviceForm.title}
                  onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 font-bold text-base"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-800 uppercase mb-1.5">Category / Domain</label>
                  <input
                    type="text"
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-800 uppercase mb-1.5">Accent Theme Color</label>
                  <select
                    value={serviceForm.accentColor}
                    onChange={(e) => setServiceForm({ ...serviceForm, accentColor: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white font-semibold"
                  >
                    <option value="sky">Sky Blue (Pillar)</option>
                    <option value="red">Coral Red (Highlight)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-800 uppercase mb-1.5">Tagline / Headline</label>
                <input
                  type="text"
                  value={serviceForm.tagline}
                  onChange={(e) => setServiceForm({ ...serviceForm, tagline: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 uppercase mb-1.5">Short Description (Cards)</label>
                <input
                  type="text"
                  value={serviceForm.shortDesc}
                  onChange={(e) => setServiceForm({ ...serviceForm, shortDesc: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 uppercase mb-1.5">Full Detailed Overview</label>
                <textarea
                  rows={3}
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 uppercase mb-1.5">Key Features (1 per line)</label>
                <textarea
                  rows={3}
                  value={serviceForm.featuresText}
                  onChange={(e) => setServiceForm({ ...serviceForm, featuresText: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 uppercase mb-1.5">Frequently Asked Questions (Format: Question | Answer)</label>
                <textarea
                  rows={3}
                  value={serviceForm.faqsText}
                  onChange={(e) => setServiceForm({ ...serviceForm, faqsText: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 font-mono text-xs"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 font-bold rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm shadow-md"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* JOB EDIT/CREATE MODAL */}
      {modalType === 'job' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-10 max-w-2xl w-full shadow-2xl relative border border-gray-200 text-gray-900 max-h-[90vh] overflow-y-auto my-6">
            <button onClick={() => setModalType(null)} className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 rounded-full">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-black text-gray-950 mb-6 pb-3 border-b border-gray-100">
              {editingItem ? `Edit Job Vacancy: ${editingItem.title}` : 'Post New Job Vacancy'}
            </h3>
            <form onSubmit={handleSaveJob} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-800 uppercase mb-1.5">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 font-bold text-base"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-800 uppercase mb-1.5">Department</label>
                  <select
                    value={jobForm.department}
                    onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white font-semibold"
                  >
                    <option value="Integrated Facilities">Integrated Facilities</option>
                    <option value="HR & Payroll">HR & Payroll</option>
                    <option value="Engineering & Maintenance">Engineering & Maintenance</option>
                    <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
                    <option value="Quality & Compliance">Quality & Compliance</option>
                    <option value="Sales & Client Relations">Sales & Client Relations</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-800 uppercase mb-1.5">Location</label>
                  <input
                    type="text"
                    required
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-800 uppercase mb-1.5">Experience Required</label>
                  <input
                    type="text"
                    required
                    value={jobForm.experience}
                    onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-800 uppercase mb-1.5">Salary Range (CTC)</label>
                  <input
                    type="text"
                    required
                    value={jobForm.salary}
                    onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-800 uppercase mb-1.5">Job Description</label>
                <textarea
                  rows={2}
                  required
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 uppercase mb-1.5">Key Responsibilities (1 per line)</label>
                <textarea
                  rows={3}
                  value={jobForm.responsibilitiesText}
                  onChange={(e) => setJobForm({ ...jobForm, responsibilitiesText: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 uppercase mb-1.5">Qualifications (1 per line)</label>
                <textarea
                  rows={2}
                  value={jobForm.qualificationsText}
                  onChange={(e) => setJobForm({ ...jobForm, qualificationsText: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 uppercase mb-1.5">Skills (Comma separated)</label>
                <input
                  type="text"
                  value={jobForm.skillsText}
                  onChange={(e) => setJobForm({ ...jobForm, skillsText: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="hot-job"
                  checked={jobForm.isHot}
                  onChange={(e) => setJobForm({ ...jobForm, isHot: e.target.checked })}
                  className="w-4 h-4 rounded text-red-600"
                />
                <label htmlFor="hot-job" className="font-bold text-gray-800 cursor-pointer text-sm">
                  Mark as Urgent Hiring (Hot Opening Badge)
                </label>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 font-bold rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 bg-gradient-to-r from-red-600 to-sky-600 text-white font-bold rounded-xl text-sm shadow-md"
                >
                  Save Vacancy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TESTIMONIAL EDIT/CREATE MODAL */}
      {modalType === 'testimonial' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-10 max-w-lg w-full shadow-2xl relative border border-gray-200 text-gray-900 my-6">
            <button onClick={() => setModalType(null)} className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 rounded-full">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-black text-gray-950 mb-6 pb-3 border-b border-gray-100">
              {editingItem ? 'Edit Client Testimonial' : 'Add Client Testimonial'}
            </h3>
            <form onSubmit={handleSaveTestimonial} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-gray-800 uppercase mb-1.5">Client Full Name *</label>
                <input
                  type="text"
                  required
                  value={testimonialForm.clientName}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, clientName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 font-bold text-base"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-800 uppercase mb-1.5">Designation</label>
                  <input
                    type="text"
                    value={testimonialForm.designation}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, designation: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-800 uppercase mb-1.5">Company Name</label>
                  <input
                    type="text"
                    value={testimonialForm.company}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-800 uppercase mb-1.5">Quote / Review</label>
                <textarea
                  rows={3}
                  required
                  value={testimonialForm.quote}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 leading-relaxed font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-800 uppercase mb-1.5">Metric Highlight</label>
                  <input
                    type="text"
                    value={testimonialForm.metric}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, metric: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-800 uppercase mb-1.5">Service Used</label>
                  <input
                    type="text"
                    value={testimonialForm.serviceUsed}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, serviceUsed: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 font-medium"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 font-bold rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm shadow-md"
                >
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* NAVBAR MENU ITEM EDIT/CREATE MODAL */}
      {modalType === 'navItem' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-10 max-w-lg w-full shadow-2xl relative border border-gray-200 text-gray-900">
            <button onClick={() => setModalType(null)} className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 rounded-full cursor-pointer">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-black text-gray-950 mb-6 pb-3 border-b border-gray-100">
              {editingItem ? `Edit Menu Item: ${editingItem.label}` : 'Add New Navbar Item'}
            </h3>
            <form onSubmit={handleSaveNav} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-gray-800 uppercase mb-1.5">Link Label *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. COMPLIANCE, MEDIA, ABOUT"
                  value={navForm.label}
                  onChange={(e) => setNavForm({ ...navForm, label: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 uppercase mb-1.5">Link Destination Type</label>
                <select
                  value={navForm.type}
                  onChange={(e) => {
                    const newType = e.target.value;
                    let defaultTarget = 'home';
                    if (newType === 'page' && customPages.length > 0) defaultTarget = `p/${customPages[0].slug}`;
                    if (newType === 'services-dropdown') defaultTarget = 'services';
                    setNavForm({ ...navForm, type: newType, path: defaultTarget });
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white font-semibold"
                >
                  <option value="internal">Built-in Main Page</option>
                  <option value="page">Custom Dynamic Page</option>
                  <option value="services-dropdown">Services Dropdown Menu</option>
                  <option value="custom">Custom Route Key</option>
                </select>
              </div>

              {navForm.type === 'internal' && (
                <div>
                  <label className="block font-bold text-gray-800 uppercase mb-1.5">Select Built-in Page</label>
                  <select
                    value={navForm.path}
                    onChange={(e) => setNavForm({ ...navForm, path: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white font-semibold"
                  >
                    <option value="home">Home (home)</option>
                    <option value="about">About Us (about)</option>
                    <option value="services">Services Spectrum (services)</option>
                    <option value="payroll">Payroll Calculator (payroll)</option>
                    <option value="careers">Careers & Hiring (careers)</option>
                    <option value="contact">Contact & Quotes (contact)</option>
                  </select>
                </div>
              )}

              {navForm.type === 'page' && (
                <div>
                  <label className="block font-bold text-gray-800 uppercase mb-1.5">Select Custom Page</label>
                  <select
                    value={navForm.path}
                    onChange={(e) => setNavForm({ ...navForm, path: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white font-semibold"
                  >
                    {customPages && customPages.map(cp => (
                      <option key={cp.id} value={`p/${cp.slug}`}>
                        {cp.title} (p/{cp.slug})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {(navForm.type === 'custom' || navForm.type === 'services-dropdown') && (
                <div>
                  <label className="block font-bold text-gray-800 uppercase mb-1.5">Target Route Path</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. services or contact"
                    value={navForm.path}
                    onChange={(e) => setNavForm({ ...navForm, path: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 font-mono text-xs"
                  />
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="navIsHot"
                  checked={navForm.isHot}
                  onChange={(e) => setNavForm({ ...navForm, isHot: e.target.checked })}
                  className="w-5 h-5 text-red-600 rounded cursor-pointer"
                />
                <label htmlFor="navIsHot" className="font-bold text-gray-800 cursor-pointer flex items-center gap-2">
                  <span>Highlight with Live Hot/Pulse Dot Indicator</span>
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                </label>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 font-bold rounded-xl text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm shadow-md cursor-pointer"
                >
                  Save Navigation Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESUME PREVIEW & CANDIDATE DOSSIER MODAL */}
      {previewResumeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">

            {/* Modal Header */}
            <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center text-white shrink-0 shadow-md">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg sm:text-xl font-black text-white">{previewResumeModal.applicantName}</h3>
                    <span className="text-[11px] font-mono bg-white/10 px-2 py-0.5 rounded text-white/90 font-bold">
                      {previewResumeModal.refId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium mt-0.5">
                    {previewResumeModal.role} • Phone: <span className="text-emerald-400 font-bold">{previewResumeModal.phone}</span> {previewResumeModal.email ? `• ${previewResumeModal.email}` : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadResume(previewResumeModal)}
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resume</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <span>🖨️ Print</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewResumeModal(null)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Full Structured Resume Sheet */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 bg-slate-100">

              <div className="bg-white rounded-3xl border-2 border-slate-300 shadow-xl p-6 sm:p-8 space-y-6">

                {/* Candidate Title & Role */}
                <div className="pb-4 border-b-2 border-slate-200">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200 inline-block mb-2">
                    Official Candidate Resume Dossier
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase">
                    {previewResumeModal.applicantName}
                  </h2>
                  <p className="text-sm font-bold text-red-600 mt-0.5">
                    Position Applied: {previewResumeModal.role}
                  </p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium">
                  <div>
                    <span className="text-slate-400 block font-bold uppercase text-[10px]">Contact Phone</span>
                    <span className="font-extrabold text-emerald-700 text-sm mt-0.5 block">{previewResumeModal.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold uppercase text-[10px]">Email Address</span>
                    <span className="font-bold text-slate-800 text-sm mt-0.5 block truncate">{previewResumeModal.email || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold uppercase text-[10px]">Total Experience</span>
                    <span className="font-bold text-slate-800 text-sm mt-0.5 block">{previewResumeModal.experience || '1 - 3 Years'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold uppercase text-[10px]">Submission Date</span>
                    <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                      {previewResumeModal.date ? new Date(previewResumeModal.date).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>
                </div>

                {/* Attached File Reference Box */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-xs font-bold text-sky-900">
                  <div className="flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-sky-600" />
                    <span>Attached Document: {previewResumeModal.fileName || 'Candidate Document'}</span>
                  </div>
                  <span className="text-[11px] bg-white px-2.5 py-0.5 rounded-md border border-sky-200 text-sky-700">
                    ✓ Verified
                  </span>
                </div>

                {/* Raw Uploaded File Viewer if Base64 exists */}
                {previewResumeModal.dataUrl && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600 uppercase tracking-wider">
                      <span>Uploaded File View</span>
                      <button
                        type="button"
                        onClick={() => handleOpenFileInNewTab(previewResumeModal.dataUrl, previewResumeModal.fileName)}
                        className="text-sky-600 hover:text-sky-800 flex items-center gap-1 font-bold lowercase hover:underline cursor-pointer"
                      >
                        <span>open in new tab (Full PDF View)</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                    {previewResumeModal.dataUrl.startsWith('data:image/') ? (
                      <img
                        src={previewResumeModal.dataUrl}
                        alt="Resume preview"
                        className="w-full max-h-[500px] object-contain rounded-2xl border border-slate-200 bg-slate-100"
                      />
                    ) : (
                      <iframe
                        src={getBlobUrlFromDataUrl(previewResumeModal.dataUrl)}
                        title="Resume Preview"
                        className="w-full h-[520px] rounded-2xl border border-slate-200 bg-white"
                      />
                    )}
                  </div>
                )}

                {/* Full Formatted Candidate Description & Cover Note */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                    <FileText className="w-4 h-4 text-red-600" />
                    <span>Candidate Statement & Cover Experience</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 whitespace-pre-wrap font-sans leading-relaxed break-words">
                    {previewResumeModal.message || 'No additional cover note submitted.'}
                  </div>
                </div>

                {/* Authenticated Stamp */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>MANABS National Resource Cell • Certified Candidate Review</span>
                  </div>
                  <span className="font-mono text-slate-400">ID: {previewResumeModal.refId}</span>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                MANABS Central Resource Cell • HR Candidate Dossier
              </span>
              <div className="flex items-center gap-3 ml-auto">
                <button
                  type="button"
                  onClick={() => handleDownloadResume(previewResumeModal)}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resume</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 border border-slate-300 transition-colors cursor-pointer"
                >
                  <span>🖨️ Print</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewResumeModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}



    </div>
  );
};

export default AdminDashboardPage;
