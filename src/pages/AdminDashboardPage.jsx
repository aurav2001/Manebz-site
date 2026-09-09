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
  AlertCircle
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
    jobApplications, updateJobApplicationStatus, deleteJobApplication,
    talentVaultApplications, updateTalentVaultStatus, deleteTalentVaultApplication,
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
    if (passwordInput === 'Admin123') {
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
  const [activeSection, setActiveSection] = useState('overview'); // overview, services, jobs, inquiries, applications, talent-vault, company-info, testimonials, settings

  // Search & Filter in Sub-sections
  const [subSearch, setSubSearch] = useState('');

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

  const handleDownloadResume = (applicant) => {
    const candidateName = applicant.fullName || applicant.applicantName || 'Candidate';
    const roleTitle = applicant.jobTitle || applicant.role || applicant.targetDepartment || 'Applicant';
    const fileName = applicant.fileName || applicant.resumeFileName || `${candidateName.replace(/\s+/g, '_')}_Resume.pdf`;

    if (applicant.dataUrl || applicant.resumeDataUrl) {
      const dataUri = applicant.dataUrl || applicant.resumeDataUrl;
      const a = document.createElement('a');
      a.href = dataUri;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast(`Downloaded: ${fileName}`);
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

  // 1. Service Modals
  const openServiceModal = (s = null) => {
    if (s) {
      setEditingItem(s);
      setServiceForm({
        title: s.title,
        category: s.category,
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
        description: 'Dedicated management system with SOP-compliant execution.',
        accentColor: 'sky',
        icon: 'Building2',
        featuresText: 'Dedicated site manager\n24/7 emergency roster\n100% statutory adherence',
        faqsText: 'How soon can deployment occur? | Deployment starts within 48 to 72 business hours.\nAre personnel insured? | Yes, 100% ESI, PF, and statutory insurance compliance.',
      });
    }
    setModalType('service');
  };

  const handleSaveService = (e) => {
    e.preventDefault();
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
    setModalType(null);
  };

  // 2. Job Modals
  const openJobModal = (job = null) => {
    if (job) {
      setEditingItem(job);
      setJobForm({
        title: job.title,
        department: job.department,
        location: job.location,
        type: job.type || 'Full-Time',
        experience: job.experience,
        salary: job.salary,
        description: job.description,
        responsibilitiesText: Array.isArray(job.responsibilities) ? job.responsibilities.join('\n') : '',
        qualificationsText: Array.isArray(job.qualifications) ? job.qualifications.join('\n') : '',
        skillsText: Array.isArray(job.skills) ? job.skills.join(', ') : '',
        workingHours: job.workingHours || 'General Shift',
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
        description: '',
        responsibilitiesText: 'Oversee daily operational standards.\nCoordinate with client supervisors.\nEnsure 100% statutory compliance.',
        qualificationsText: 'Graduate / Diploma in relevant domain.\nStrong field leadership and communication.',
        skillsText: 'Operations Management, SLA Tracking, Vendor Coordination',
        workingHours: 'General Shift (9:30 AM - 6:30 PM)',
        openingsCount: 2,
        isHot: true,
      });
    }
    setModalType('job');
  };

  const handleSaveJob = (e) => {
    e.preventDefault();
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
    setModalType(null);
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
    <div className="min-h-screen bg-slate-50 pt-20 pb-20 text-gray-900 flex flex-col">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-gray-950 text-white px-6 py-3.5 rounded-2xl shadow-2xl border border-sky-400 flex items-center gap-3 animate-in slide-in-from-top-3 text-sm font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Navigation Header Bar with Main Logo & Large Titles */}
      <div className="bg-white border-b border-gray-200 px-6 sm:px-10 py-4 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('home')} 
              className="focus:outline-none hover:opacity-90 transition-opacity shrink-0"
              title="Click to view live website"
            >
              <img 
                src={logoImg} 
                alt="MANABS / MANEBZ Logo" 
                className="h-11 sm:h-12 w-auto object-contain rounded-xl shadow-xs border border-gray-200" 
              />
            </button>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-gray-950">
                  MANABS Control Center
                </h1>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-black px-2.5 py-0.5 rounded-full border border-emerald-200">
                  LIVE DYNAMIC
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 font-medium">
                Unified Content, Inquiries, Careers & Operations Management Portal
              </p>
            </div>
          </div>

          {/* Top Quick Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors shadow-xs"
            >
              <Eye className="w-4 h-4 text-sky-600" />
              <span>Preview Live Site</span>
            </button>

            <button
              onClick={handleExportBackup}
              className="px-4 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors border border-sky-200 shadow-xs"
              title="Download full JSON backup of website data"
            >
              <Download className="w-4 h-4" />
              <span>Export Backup</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors border border-red-200 shadow-xs"
              title="Lock Admin Panel / Logout"
            >
              <Lock className="w-4 h-4" />
              <span>Lock / Logout</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Admin Workspace Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* SIDEBAR NAVIGATION (3 of 12 columns) with readable text and clear badges */}
          <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-200 p-4 shadow-sm space-y-2 sticky lg:top-24">
            
            <div className="px-3.5 py-2 text-xs font-black uppercase tracking-widest text-gray-400">
              Navigation Menu
            </div>

            {[
              { id: 'overview', label: 'Overview & Metrics', icon: LayoutDashboard, badge: null },
              { id: 'services', label: 'Services Spectrum', icon: Layers, badge: services.length },
              { id: 'jobs', label: 'Careers & Vacancies', icon: Briefcase, badge: jobs.length },
              { id: 'inquiries', label: 'RFQ Quote Leads', icon: MessageSquare, badge: inquiries.length, badgeColor: 'bg-red-100 text-red-700 border border-red-200' },
              { id: 'applications', label: 'Job Applications', icon: FileText, badge: jobApplications.length, badgeColor: 'bg-sky-100 text-sky-700 border border-sky-200' },
              { id: 'talent-vault', label: 'Future Talent Bank', icon: Database, badge: talentVaultApplications.length, badgeColor: 'bg-purple-100 text-purple-700 border border-purple-200' },
              { id: 'company-info', label: 'Company Heritage & Stats', icon: Award, badge: null },
              { id: 'testimonials', label: 'Client Testimonials', icon: Star, badge: testimonials.length },
              { id: 'settings', label: 'System & Reset Tools', icon: Settings, badge: null },
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
                  className={`w-full text-left px-4 py-3.5 rounded-2xl text-sm sm:text-base font-bold flex items-center justify-between transition-all ${
                    isActive
                      ? 'bg-[#0a192f] text-white shadow-md shadow-sky-950/20'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-sky-400' : 'text-gray-400'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== null && (
                    <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : tab.badgeColor || 'bg-gray-100 text-gray-700'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}

          </div>

          {/* MAIN CONTENT AREA (9 of 12 columns) */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* SECTION 1: OVERVIEW & METRICS */}
            {activeSection === 'overview' && (
              <div className="space-y-6">
                
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
                
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-gray-950">Services Spectrum ({services.length} Verticals)</h3>
                    <p className="text-sm text-gray-600 mt-1 font-medium">Edit descriptions, capabilities, FAQs, and SLA metrics for each corporate vertical.</p>
                  </div>
                  <button
                    onClick={() => openServiceModal(null)}
                    className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 shrink-0 transition-transform active:scale-95"
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
                          <span className={`text-xs font-bold px-3 py-1 rounded-lg border ${
                            srv.accentColor === 'red' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-sky-50 text-sky-700 border-sky-200'
                          }`}>
                            Accent: {srv.accentColor}
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
                          className="px-4 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-sm rounded-xl flex items-center gap-2 transition-colors border border-sky-200"
                        >
                          <Edit3 className="w-4 h-4 text-sky-600" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete service vertical "${srv.title}"?`)) {
                              deleteService(srv.id);
                              showToast(`Deleted ${srv.title}`);
                            }
                          }}
                          className="p-2.5 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-xl transition-colors border border-gray-200"
                          title="Delete Service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* SECTION 3: CAREERS & VACANCIES MANAGER */}
            {activeSection === 'jobs' && (
              <div className="space-y-6">
                
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-gray-950">Job Vacancies ({jobs.length} Active Positions)</h3>
                    <p className="text-sm text-gray-600 mt-1 font-medium">Manage all job openings, salaries, experience requirements, and urgent hiring badges.</p>
                  </div>
                  <button
                    onClick={() => openJobModal(null)}
                    className="px-5 py-3 bg-gradient-to-r from-red-600 to-sky-600 hover:from-red-700 hover:to-sky-700 text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 shrink-0 transition-transform active:scale-95"
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
                          className="px-4 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-sm rounded-xl flex items-center gap-2 transition-colors border border-sky-200"
                        >
                          <Edit3 className="w-4 h-4 text-sky-600" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete job opening "${job.title}"?`)) {
                              deleteJob(job.id);
                              showToast(`Deleted ${job.title}`);
                            }
                          }}
                          className="p-2.5 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-xl transition-colors border border-gray-200"
                          title="Delete Job"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* SECTION 4: RFQ QUOTE LEADS INBOX */}
            {activeSection === 'inquiries' && (
              <div className="space-y-6">
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-gray-950">Client Quotation Inquiries ({inquiries.length})</h3>
                    <p className="text-sm text-gray-600 mt-1 font-medium">Live proposal requests submitted from website quote buttons & modals.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {inquiries.length > 0 ? (
                    inquiries.map((inq) => (
                      <div key={inq.id} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                          <div>
                            <span className="text-xs font-mono font-bold text-gray-400 block">{inq.id} • {new Date(inq.date).toLocaleDateString()}</span>
                            <h4 className="text-lg font-black text-gray-950 mt-0.5">{inq.name}</h4>
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
                          <span className="font-black text-sky-800 block mb-1">Service Requested: {inq.service}</span>
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
                            className="text-xs sm:text-sm text-red-600 hover:text-red-700 hover:underline flex items-center gap-1.5 font-bold"
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

            {/* SECTION 5: JOB APPLICATIONS INBOX */}
            {activeSection === 'applications' && (
              <div className="space-y-6">
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-gray-950">Direct Job Applications ({jobApplications.length})</h3>
                    <p className="text-sm text-gray-600 mt-1 font-medium">Candidates who applied directly to specific job openings.</p>
                  </div>
                </div>

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
                            value={app.status}
                            onChange={(e) => updateJobApplicationStatus(app.refId, e.target.value)}
                            className="px-3.5 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm font-bold bg-white focus:outline-none shadow-xs"
                          >
                            <option value="Submitted">🟢 Submitted</option>
                            <option value="Under Review">🟡 Under Review</option>
                            <option value="Shortlisted">🔵 Shortlisted</option>
                            <option value="Resource Cell Induction">🟣 Resource Cell Induction</option>
                            <option value="Rejected">🔴 Rejected</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-gray-700 font-medium">
                          <div><span className="font-bold text-gray-400">Phone:</span> <span className="text-emerald-700 font-bold ml-1">{app.phone}</span></div>
                          <div><span className="font-bold text-gray-400">Email:</span> <span className="ml-1 font-semibold">{app.email || 'N/A'}</span></div>
                          <div><span className="font-bold text-gray-400">Experience:</span> <span className="ml-1 font-semibold">{app.experience}</span></div>
                        </div>

                        {app.resumeFileName && (
                          <div className="space-y-4">
                            {/* Resume Card Bar */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-sky-50/90 border border-sky-200">
                              <div className="flex items-center gap-3 text-xs sm:text-sm text-sky-950 font-bold min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center shrink-0 text-sky-700 shadow-xs">
                                  <FileText className="w-5 h-5" />
                                </div>
                                <div className="truncate">
                                  <span className="block truncate font-extrabold text-slate-900 text-sm">{app.resumeFileName}</span>
                                  <span className="text-xs text-sky-700 font-semibold flex items-center gap-1.5 mt-0.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                                    {app.resumeFileSize ? `Attached File • ${app.resumeFileSize}` : 'Attached Resume / CV Document'}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                                <button
                                  type="button"
                                  onClick={() => setExpandedResumeId(expandedResumeId === app.refId ? null : app.refId)}
                                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>{expandedResumeId === app.refId ? 'Hide Resume' : 'View Resume'}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDownloadResume(app)}
                                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-sky-100 text-sky-800 border border-sky-300 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                                >
                                  <Download className="w-3.5 h-3.5 text-sky-700" />
                                  <span>Download</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setPreviewResumeModal({
                                    applicantName: app.fullName,
                                    role: app.jobTitle,
                                    refId: app.refId,
                                    date: app.date,
                                    phone: app.phone,
                                    email: app.email,
                                    experience: app.experience,
                                    currentLocation: app.currentLocation,
                                    fileName: app.resumeFileName,
                                    dataUrl: app.resumeDataUrl,
                                    fileType: app.resumeFileType,
                                    message: app.message,
                                    type: 'job-application'
                                  })}
                                  className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                                  title="Open in Popup Modal"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* INLINE EXPANDED RESUME DOCUMENT SHEET */}
                            {expandedResumeId === app.refId && (
                              <div className="bg-white rounded-3xl border-2 border-slate-300 shadow-xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-98 duration-200">
                                {/* Resume Document Header */}
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b-2 border-slate-200">
                                  <div>
                                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200 inline-block mb-2">
                                      Candidate Curriculum Vitae / Resume Sheet
                                    </span>
                                    <h3 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight">
                                      {app.fullName}
                                    </h3>
                                    <p className="text-sm font-bold text-red-600 mt-0.5">
                                      Applied Position: {app.jobTitle}
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-2 flex-wrap shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => handleDownloadResume(app)}
                                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                                    >
                                      <Download className="w-3.5 h-3.5" />
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
                                      onClick={() => setExpandedResumeId(null)}
                                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
                                      title="Close Resume View"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>

                                {/* Matrix Info */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium">
                                  <div>
                                    <span className="text-slate-400 block font-bold uppercase text-[10px]">Contact Phone</span>
                                    <span className="font-extrabold text-emerald-700 text-sm mt-0.5 block">{app.phone}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block font-bold uppercase text-[10px]">Email Address</span>
                                    <span className="font-bold text-slate-800 text-sm mt-0.5 block truncate">{app.email || 'N/A'}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block font-bold uppercase text-[10px]">Experience Level</span>
                                    <span className="font-bold text-slate-800 text-sm mt-0.5 block">{app.experience}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block font-bold uppercase text-[10px]">Reference Number</span>
                                    <span className="font-bold text-slate-800 text-sm mt-0.5 block font-mono">{app.refId}</span>
                                  </div>
                                </div>

                                {/* Attached Source File Box */}
                                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-sky-50/80 border border-sky-200 text-xs font-bold text-sky-900">
                                  <div className="flex items-center gap-2">
                                    <Paperclip className="w-4 h-4 text-sky-600" />
                                    <span>Attached File: {app.resumeFileName}</span>
                                  </div>
                                  <span className="text-[11px] bg-white px-2.5 py-0.5 rounded-md border border-sky-200 text-sky-700">
                                    ✓ Verified Record
                                  </span>
                                </div>

                                {/* Embedded File Viewer if Base64 exists */}
                                {app.resumeDataUrl && (
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs font-bold text-slate-600 uppercase tracking-wider">
                                      <span>Uploaded Document Preview</span>
                                      <a
                                        href={app.resumeDataUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-sky-600 hover:text-sky-800 flex items-center gap-1 font-bold lowercase hover:underline"
                                      >
                                        <span>open in full tab</span>
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    </div>
                                    {app.resumeDataUrl.startsWith('data:image/') ? (
                                      <img
                                        src={app.resumeDataUrl}
                                        alt="Resume preview"
                                        className="w-full max-h-[450px] object-contain rounded-2xl border border-slate-200 bg-slate-100"
                                      />
                                    ) : (
                                      <iframe
                                        src={app.resumeDataUrl}
                                        title="Resume Preview"
                                        className="w-full h-[420px] rounded-2xl border border-slate-200 bg-white"
                                      />
                                    )}
                                  </div>
                                )}

                                {/* Cover Description in Exact Formatting */}
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                                    <FileText className="w-4 h-4 text-red-600" />
                                    <span>Candidate Statement & Cover Experience</span>
                                  </div>
                                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 whitespace-pre-wrap font-sans leading-relaxed break-words">
                                    {app.message || 'No additional note provided.'}
                                  </div>
                                </div>

                                {/* Authenticated Stamp */}
                                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
                                  <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                    <span>Authenticated Candidate Dossier • MANABS HR Resource Cell</span>
                                  </div>
                                  <span className="font-mono text-slate-400">LOG: {app.refId}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {app.message && !expandedResumeId && (
                          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-1.5">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                              <MessageSquare className="w-3.5 h-3.5 text-red-600" />
                              <span>Candidate Message / Description:</span>
                            </div>
                            <div className="text-xs sm:text-sm text-slate-900 whitespace-pre-wrap font-sans leading-relaxed break-words pl-0.5">
                              {app.message}
                            </div>
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
                            className="text-xs sm:text-sm text-red-600 hover:text-red-700 hover:underline flex items-center gap-1.5 font-bold"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Remove Application</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16 bg-white rounded-3xl border border-gray-200">
                      <p className="text-sm text-gray-500 font-medium">No direct job applications logged yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SECTION 6: FUTURE TALENT BANK VAULT */}
            {activeSection === 'talent-vault' && (
              <div className="space-y-6">
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-gray-950">National Resource Cell Future Talent Bank ({talentVaultApplications.length})</h3>
                    <p className="text-sm text-gray-600 mt-1 font-medium">Central resume registry for upcoming corporate facilities and logistics staff scout calls.</p>
                  </div>
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

                        {t.resumeFileName && (
                          <div className="space-y-4">
                            {/* Resume Card Bar */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-sky-50/90 border border-sky-200">
                              <div className="flex items-center gap-3 text-xs sm:text-sm text-sky-950 font-bold min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center shrink-0 text-sky-700 shadow-xs">
                                  <FileText className="w-5 h-5" />
                                </div>
                                <div className="truncate">
                                  <span className="block truncate font-extrabold text-slate-900 text-sm">{t.resumeFileName}</span>
                                  <span className="text-xs text-sky-700 font-semibold flex items-center gap-1.5 mt-0.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                                    {t.resumeFileSize ? `Attached File • ${t.resumeFileSize}` : 'Attached Resume / CV Document'}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                                <button
                                  type="button"
                                  onClick={() => setExpandedResumeId(expandedResumeId === t.id ? null : t.id)}
                                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>{expandedResumeId === t.id ? 'Hide Resume' : 'View Resume'}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDownloadResume(t)}
                                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-sky-100 text-sky-800 border border-sky-300 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                                >
                                  <Download className="w-3.5 h-3.5 text-sky-700" />
                                  <span>Download</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setPreviewResumeModal({
                                    applicantName: t.fullName,
                                    role: t.targetDepartment,
                                    refId: t.id,
                                    date: t.date,
                                    phone: t.phone,
                                    email: t.email,
                                    experience: t.experience,
                                    preferredLocation: t.preferredLocation,
                                    noticePeriod: t.noticePeriod,
                                    expectedSalary: t.expectedSalary,
                                    fileName: t.resumeFileName,
                                    dataUrl: t.resumeDataUrl,
                                    fileType: t.resumeFileType,
                                    message: t.keySkills,
                                    type: 'talent-vault'
                                  })}
                                  className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                                  title="Open in Popup Modal"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* INLINE EXPANDED RESUME DOCUMENT SHEET FOR TALENT VAULT */}
                            {expandedResumeId === t.id && (
                              <div className="bg-white rounded-3xl border-2 border-slate-300 shadow-xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-98 duration-200">
                                {/* Resume Document Header */}
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b-2 border-slate-200">
                                  <div>
                                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 inline-block mb-2">
                                      National Resource Cell Talent Bank Profile
                                    </span>
                                    <h3 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight">
                                      {t.fullName}
                                    </h3>
                                    <p className="text-sm font-bold text-sky-700 mt-0.5">
                                      Target Domain: {t.targetDepartment}
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-2 flex-wrap shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => handleDownloadResume(t)}
                                      className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                                    >
                                      <Download className="w-3.5 h-3.5" />
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
                                      onClick={() => setExpandedResumeId(null)}
                                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
                                      title="Close Resume View"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>

                                {/* Matrix Info */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium">
                                  <div>
                                    <span className="text-slate-400 block font-bold uppercase text-[10px]">Phone Number</span>
                                    <span className="font-extrabold text-emerald-700 text-sm mt-0.5 block">{t.phone}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block font-bold uppercase text-[10px]">Preferred Location</span>
                                    <span className="font-bold text-slate-800 text-sm mt-0.5 block truncate">{t.preferredLocation}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block font-bold uppercase text-[10px]">Notice Period</span>
                                    <span className="font-bold text-slate-800 text-sm mt-0.5 block">{t.noticePeriod || 'Immediate'}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block font-bold uppercase text-[10px]">Profile Vault ID</span>
                                    <span className="font-bold text-slate-800 text-sm mt-0.5 block font-mono">{t.id}</span>
                                  </div>
                                </div>

                                {/* Attached Source File Box */}
                                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-sky-50/80 border border-sky-200 text-xs font-bold text-sky-900">
                                  <div className="flex items-center gap-2">
                                    <Paperclip className="w-4 h-4 text-sky-600" />
                                    <span>Attached File: {t.resumeFileName}</span>
                                  </div>
                                  <span className="text-[11px] bg-white px-2.5 py-0.5 rounded-md border border-sky-200 text-sky-700">
                                    ✓ Verified Record
                                  </span>
                                </div>

                                {/* Embedded File Viewer if Base64 exists */}
                                {t.resumeDataUrl && (
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs font-bold text-slate-600 uppercase tracking-wider">
                                      <span>Uploaded Document Preview</span>
                                      <a
                                        href={t.resumeDataUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-sky-600 hover:text-sky-800 flex items-center gap-1 font-bold lowercase hover:underline"
                                      >
                                        <span>open in full tab</span>
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    </div>
                                    {t.resumeDataUrl.startsWith('data:image/') ? (
                                      <img
                                        src={t.resumeDataUrl}
                                        alt="Resume preview"
                                        className="w-full max-h-[450px] object-contain rounded-2xl border border-slate-200 bg-slate-100"
                                      />
                                    ) : (
                                      <iframe
                                        src={t.resumeDataUrl}
                                        title="Resume Preview"
                                        className="w-full h-[420px] rounded-2xl border border-slate-200 bg-white"
                                      />
                                    )}
                                  </div>
                                )}

                                {/* Key Skills in Exact Formatting */}
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                                    <Sparkles className="w-4 h-4 text-sky-600" />
                                    <span>Candidate Key Skills & Experience Highlights</span>
                                  </div>
                                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 whitespace-pre-wrap font-sans leading-relaxed break-words">
                                    {t.keySkills || 'Profile indexed for scout matching.'}
                                  </div>
                                </div>

                                {/* Authenticated Stamp */}
                                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
                                  <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                    <span>National Resource Cell Indexed • MANABS HR Operations</span>
                                  </div>
                                  <span className="font-mono text-slate-400">VAULT: {t.id}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {t.keySkills && !expandedResumeId && (
                          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-1.5">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                              <span>Candidate Key Skills & Description:</span>
                            </div>
                            <div className="text-xs sm:text-sm text-slate-900 whitespace-pre-wrap font-sans leading-relaxed break-words pl-0.5">
                              {t.keySkills}
                            </div>
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
                            className="text-xs sm:text-sm text-red-600 hover:text-red-700 hover:underline flex items-center gap-1.5 font-bold"
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

          </div>

        </div>
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
                      <a
                        href={previewResumeModal.dataUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-600 hover:text-sky-800 flex items-center gap-1 font-bold lowercase hover:underline"
                      >
                        <span>open in new window</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    {previewResumeModal.dataUrl.startsWith('data:image/') ? (
                      <img
                        src={previewResumeModal.dataUrl}
                        alt="Resume preview"
                        className="w-full max-h-[450px] object-contain rounded-2xl border border-slate-200 bg-slate-100"
                      />
                    ) : (
                      <iframe
                        src={previewResumeModal.dataUrl}
                        title="Resume Preview"
                        className="w-full h-[450px] rounded-2xl border border-slate-200 bg-white"
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
