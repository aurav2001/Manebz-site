import React, { useState } from 'react';
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
  IndianRupee
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

  // Toast Notification
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // PIN Handler
  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput === '1234' || pinInput === 'admin') {
      setIsAuthenticated(true);
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
    }
  };

  // 1. Service Modals
  const openServiceModal = (srv = null) => {
    if (srv) {
      setEditingItem(srv);
      setServiceForm({
        title: srv.title,
        category: srv.category,
        tagline: srv.tagline || '',
        shortDesc: srv.shortDesc,
        description: srv.description,
        accentColor: srv.accentColor || 'sky',
        icon: srv.icon || 'Building2',
        featuresText: Array.isArray(srv.features) ? srv.features.join('\n') : '',
        faqsText: Array.isArray(srv.faqs) ? srv.faqs.map(f => `${f.q} | ${f.a}`).join('\n') : '',
      });
    } else {
      setEditingItem(null);
      setServiceForm({
        title: '',
        category: 'Workforce Solutions',
        tagline: '',
        shortDesc: '',
        description: '',
        accentColor: 'sky',
        icon: 'Building2',
        featuresText: 'Dedicated In-House Resource Cell\n100% PF & ESI Statutory Compliance\n24/7 Operations & Supervision',
        faqsText: 'How is quality maintained? | Through structured location checklists and surprise audits.',
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
      return { q: parts[0]?.trim() || '', a: parts[1]?.trim() || '' };
    }).filter(f => f.q && f.a);

    if (editingItem) {
      updateService(editingItem.id, { ...serviceForm, features, faqs });
      showToast(`Service "${serviceForm.title}" updated successfully!`);
    } else {
      addService({ ...serviceForm, features, faqs });
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
          
          <div className="relative inline-block">
            <div className="w-18 h-18 rounded-2xl bg-gradient-to-tr from-red-600 to-sky-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-red-500/20">
              <Lock className="w-9 h-9" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#0a192f] flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-400 bg-sky-950/60 px-3 py-1 rounded-full border border-sky-500/30 inline-block">
              MANABS / MANEBZ Admin Portal
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Control Center Login
            </h2>
            <p className="text-xs text-gray-300">
              Restricted access for authorized operations team only.
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                Admin Password
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
                  className="w-full px-4 py-3.5 pr-12 rounded-xl bg-white/10 border border-white/20 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-sky-400 focus:bg-white/15 transition-all"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {passwordError && (
              <div className="p-2.5 rounded-xl bg-red-950/70 border border-red-500/50 text-red-300 text-xs font-semibold flex items-center gap-2">
                <X className="w-4 h-4 text-red-400 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-red-600 to-sky-600 hover:from-red-500 hover:to-sky-500 font-extrabold text-xs uppercase tracking-wider text-white rounded-xl transition-all shadow-lg shadow-red-500/25 active:scale-98 flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Dashboard</span>
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="text-xs text-gray-400 hover:text-sky-300 transition-colors inline-flex items-center gap-1.5"
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
    <div className="min-h-screen bg-gray-50 pt-20 pb-20 text-gray-900 flex flex-col">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-sky-400 flex items-center gap-2.5 animate-in slide-in-from-top-3 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Navigation Header Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0a192f] text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-gray-900">
                  MANABS Control Center
                </h1>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                  LIVE DYNAMIC
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Unified Content, Leads, Careers & Operations Management Portal
              </p>
            </div>
          </div>

          {/* Top Quick Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigate('home')}
              className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-sky-600" />
              <span>Preview Live Site</span>
            </button>

            <button
              onClick={handleExportBackup}
              className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Download full JSON backup of website data"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Backup</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Lock Admin Panel / Logout"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock / Logout</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Admin Workspace Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* SIDEBAR NAVIGATION (3 of 12 columns) */}
          <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-200 p-4 shadow-sm space-y-1.5 sticky lg:top-24">
            
            <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
              Navigation Menu
            </div>

            {[
              { id: 'overview', label: 'Overview & Metrics', icon: LayoutDashboard, badge: null },
              { id: 'services', label: 'Services Spectrum', icon: Layers, badge: services.length },
              { id: 'jobs', label: 'Careers & Vacancies', icon: Briefcase, badge: jobs.length },
              { id: 'inquiries', label: 'RFQ Quote Leads', icon: MessageSquare, badge: inquiries.length, badgeColor: 'bg-red-100 text-red-700' },
              { id: 'applications', label: 'Job Applications', icon: FileText, badge: jobApplications.length, badgeColor: 'bg-sky-100 text-sky-700' },
              { id: 'talent-vault', label: 'Future Talent Bank', icon: Database, badge: talentVaultApplications.length, badgeColor: 'bg-purple-100 text-purple-700' },
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
                  className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all ${
                    isActive
                      ? 'bg-[#0a192f] text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-gray-400'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== null && (
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : tab.badgeColor || 'bg-gray-100 text-gray-600'
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
                
                {/* 6 Quick Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div 
                    onClick={() => setActiveSection('services')}
                    className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs cursor-pointer hover:border-sky-400 transition-all"
                  >
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Active Services</span>
                    <span className="text-3xl font-black text-sky-600 mt-1 block">{services.length}</span>
                    <span className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">5 Core Pillars <ChevronRight className="w-3 h-3" /></span>
                  </div>

                  <div 
                    onClick={() => setActiveSection('jobs')}
                    className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs cursor-pointer hover:border-red-400 transition-all"
                  >
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Open Vacancies</span>
                    <span className="text-3xl font-black text-red-600 mt-1 block">{jobs.length}</span>
                    <span className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">Live in Delhi NCR/UP <ChevronRight className="w-3 h-3" /></span>
                  </div>

                  <div 
                    onClick={() => setActiveSection('inquiries')}
                    className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs cursor-pointer hover:border-emerald-400 transition-all"
                  >
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Client RFQ Leads</span>
                    <span className="text-3xl font-black text-emerald-600 mt-1 block">{inquiries.length}</span>
                    <span className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">Pending Proposals <ChevronRight className="w-3 h-3" /></span>
                  </div>

                  <div 
                    onClick={() => setActiveSection('applications')}
                    className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs cursor-pointer hover:border-purple-400 transition-all"
                  >
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Job Applications</span>
                    <span className="text-3xl font-black text-purple-600 mt-1 block">{jobApplications.length}</span>
                    <span className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">Direct CVs <ChevronRight className="w-3 h-3" /></span>
                  </div>

                  <div 
                    onClick={() => setActiveSection('talent-vault')}
                    className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs cursor-pointer hover:border-amber-400 transition-all"
                  >
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Future Talent Pool</span>
                    <span className="text-3xl font-black text-amber-600 mt-1 block">{talentVaultApplications.length}</span>
                    <span className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">Resource Cell Bank <ChevronRight className="w-3 h-3" /></span>
                  </div>

                  <div 
                    onClick={() => setActiveSection('testimonials')}
                    className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs cursor-pointer hover:border-sky-400 transition-all"
                  >
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Client Reviews</span>
                    <span className="text-3xl font-black text-sky-600 mt-1 block">{testimonials.length}</span>
                    <span className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">5-Star Verified <ChevronRight className="w-3 h-3" /></span>
                  </div>
                </div>

                {/* Recent Leads & Talent Feed */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Recent Inquiries */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                        Recent Client Proposals
                      </h3>
                      <button onClick={() => setActiveSection('inquiries')} className="text-xs text-sky-600 font-bold hover:underline">
                        View All
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {inquiries.slice(0, 3).map((inq) => (
                        <div key={inq.id} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-900">{inq.name}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700">{inq.status}</span>
                          </div>
                          <p className="text-[11px] text-gray-500">{inq.service} • {inq.phone}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Talent Bank Registrations */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                        Future Talent Bank Additions
                      </h3>
                      <button onClick={() => setActiveSection('talent-vault')} className="text-xs text-sky-600 font-bold hover:underline">
                        View All
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {talentVaultApplications.slice(0, 3).map((t) => (
                        <div key={t.id} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-900">{t.fullName}</span>
                            <span className="text-[10px] font-mono text-gray-400">{t.id}</span>
                          </div>
                          <p className="text-[11px] text-gray-500">{t.targetDepartment} • {t.experience} • {t.phone}</p>
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
                
                <div className="bg-white p-6 rounded-3xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Services Spectrum ({services.length} Verticals)</h3>
                    <p className="text-xs text-gray-500">Edit content, capabilities, FAQs, and SLA metrics for each corporate vertical.</p>
                  </div>
                  <button
                    onClick={() => openServiceModal(null)}
                    className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs flex items-center gap-1.5 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Service</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {services.map((srv) => (
                    <div 
                      key={srv.id}
                      className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-sky-400 transition-all"
                    >
                      <div className="space-y-2 max-w-2xl">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-700">
                            {srv.category}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            srv.accentColor === 'red' ? 'bg-red-50 text-red-600' : 'bg-sky-50 text-sky-600'
                          }`}>
                            Accent: {srv.accentColor}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-gray-900">{srv.title}</h4>
                        <p className="text-xs text-gray-600">{srv.shortDesc}</p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {srv.features?.slice(0, 3).map((f, i) => (
                            <span key={i} className="text-[10px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded-md border border-gray-100">
                              ✓ {f}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => openServiceModal(srv)}
                          className="px-3.5 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete service vertical "${srv.title}"?`)) {
                              deleteService(srv.id);
                              showToast(`Deleted ${srv.title}`);
                            }
                          }}
                          className="p-2 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-xl transition-colors"
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
                
                <div className="bg-white p-6 rounded-3xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Job Vacancies ({jobs.length} Active Positions)</h3>
                    <p className="text-xs text-gray-500">Manage all job openings, salaries, experience requirements, and hot badges.</p>
                  </div>
                  <button
                    onClick={() => openJobModal(null)}
                    className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-sky-600 hover:from-red-700 hover:to-sky-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs flex items-center gap-1.5 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Post New Vacancy</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div 
                      key={job.id}
                      className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-red-400 transition-all"
                    >
                      <div className="space-y-2 max-w-2xl">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-700">
                            {job.department}
                          </span>
                          {job.isHot && (
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                              🔥 Urgent Hiring
                            </span>
                          )}
                          <span className="text-xs font-bold text-emerald-700">{job.salary}</span>
                        </div>
                        <h4 className="text-base font-bold text-gray-900">{job.title}</h4>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>📍 {job.location}</span>
                          <span>⏳ {job.experience}</span>
                          <span>🕒 {job.workingHours || 'Rotational'}</span>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-1">{job.description}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => openJobModal(job)}
                          className="px-3.5 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete job opening "${job.title}"?`)) {
                              deleteJob(job.id);
                              showToast(`Deleted ${job.title}`);
                            }
                          }}
                          className="p-2 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-xl transition-colors"
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
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Client Quotation Inquiries ({inquiries.length})</h3>
                    <p className="text-xs text-gray-500">Live proposal requests submitted from website quote buttons & modals.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {inquiries.length > 0 ? (
                    inquiries.map((inq) => (
                      <div key={inq.id} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                          <div>
                            <span className="text-[10px] font-mono text-gray-400 block">{inq.id} • {new Date(inq.date).toLocaleDateString()}</span>
                            <h4 className="text-base font-bold text-gray-900">{inq.name}</h4>
                          </div>
                          
                          {/* Status Switcher */}
                          <select
                            value={inq.status}
                            onChange={(e) => updateInquiryStatus(inq.id, e.target.value)}
                            className="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-bold bg-white focus:outline-none"
                          >
                            <option value="New Lead">🟢 New Lead</option>
                            <option value="Contacted">🟡 Contacted</option>
                            <option value="Proposal Sent">🔵 Proposal Sent</option>
                            <option value="Contract Signed">⭐ Contract Signed</option>
                            <option value="Closed / Archived">⚪ Closed / Archived</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-600">
                          <div><span className="font-bold text-gray-400">Phone:</span> <span className="text-emerald-700 font-semibold">{inq.phone}</span></div>
                          <div><span className="font-bold text-gray-400">Email:</span> <span>{inq.email || 'N/A'}</span></div>
                          <div><span className="font-bold text-gray-400">Location:</span> <span>{inq.location || inq.city || 'Delhi NCR'}</span></div>
                        </div>

                        <div className="text-xs text-gray-700 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                          <span className="font-bold text-sky-700 block mb-0.5">Service Requested: {inq.service}</span>
                          <p>{inq.scope || inq.requirements || 'Standard quote request.'}</p>
                        </div>

                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => {
                              if (window.confirm('Delete this inquiry?')) {
                                deleteInquiry(inq.id);
                                showToast('Inquiry deleted.');
                              }
                            }}
                            className="text-xs text-red-600 hover:underline flex items-center gap-1 font-semibold"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove Lead</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16 bg-white rounded-3xl border border-gray-200">
                      <p className="text-xs text-gray-500">No client quotation inquiries logged yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SECTION 5: JOB APPLICATIONS INBOX */}
            {activeSection === 'applications' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Direct Job Applications ({jobApplications.length})</h3>
                    <p className="text-xs text-gray-500">Candidates who applied directly to specific job openings.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {jobApplications.length > 0 ? (
                    jobApplications.map((app) => (
                      <div key={app.refId} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                          <div>
                            <span className="text-[10px] font-mono text-gray-400 block">{app.refId} • {new Date(app.date).toLocaleDateString()}</span>
                            <h4 className="text-base font-bold text-gray-900">{app.fullName}</h4>
                            <span className="text-xs font-bold text-red-600">Applied for: {app.jobTitle}</span>
                          </div>

                          <select
                            value={app.status}
                            onChange={(e) => updateJobApplicationStatus(app.refId, e.target.value)}
                            className="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-bold bg-white focus:outline-none"
                          >
                            <option value="Submitted">🟢 Submitted</option>
                            <option value="Under Review">🟡 Under Review</option>
                            <option value="Shortlisted">🔵 Shortlisted</option>
                            <option value="Resource Cell Induction">🟣 Resource Cell Induction</option>
                            <option value="Rejected">🔴 Rejected</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-600">
                          <div><span className="font-bold text-gray-400">Phone:</span> <span className="text-emerald-700 font-semibold">{app.phone}</span></div>
                          <div><span className="font-bold text-gray-400">Email:</span> <span>{app.email || 'N/A'}</span></div>
                          <div><span className="font-bold text-gray-400">Experience:</span> <span>{app.experience}</span></div>
                        </div>

                        {app.resumeFileName && (
                          <div className="flex items-center gap-2 text-xs text-sky-700 bg-sky-50 p-2.5 rounded-xl border border-sky-100 font-semibold">
                            <FileText className="w-4 h-4" />
                            <span>Resume Attached: {app.resumeFileName}</span>
                          </div>
                        )}

                        {app.message && (
                          <p className="text-xs text-gray-600 italic bg-gray-50 p-2.5 rounded-xl">
                            "{app.message}"
                          </p>
                        )}

                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => {
                              if (window.confirm('Delete this application?')) {
                                deleteJobApplication(app.refId);
                                showToast('Application removed.');
                              }
                            }}
                            className="text-xs text-red-600 hover:underline flex items-center gap-1 font-semibold"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove Application</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16 bg-white rounded-3xl border border-gray-200">
                      <p className="text-xs text-gray-500">No direct job applications logged yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SECTION 6: FUTURE TALENT BANK VAULT */}
            {activeSection === 'talent-vault' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">National Resource Cell Future Talent Bank ({talentVaultApplications.length})</h3>
                    <p className="text-xs text-gray-500">Central resume registry for upcoming corporate facilities and logistics staff scout calls.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {talentVaultApplications.length > 0 ? (
                    talentVaultApplications.map((t) => (
                      <div key={t.id} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                          <div>
                            <span className="text-[10px] font-mono text-gray-400 block">{t.id} • {new Date(t.date).toLocaleDateString()}</span>
                            <h4 className="text-base font-bold text-gray-900">{t.fullName}</h4>
                            <span className="text-xs font-bold text-sky-700">Domain: {t.targetDepartment}</span>
                          </div>

                          <select
                            value={t.status}
                            onChange={(e) => updateTalentVaultStatus(t.id, e.target.value)}
                            className="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-bold bg-white focus:outline-none"
                          >
                            <option value="Resource Cell Indexed">🟣 Resource Cell Indexed</option>
                            <option value="Contacted for Project">🟢 Contacted for Project</option>
                            <option value="Under Training">🟡 Under Training</option>
                            <option value="Deployed on Site">⭐ Deployed on Site</option>
                            <option value="Archived">⚪ Archived</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-600">
                          <div><span className="font-bold text-gray-400">Phone:</span> <span className="text-emerald-700 font-semibold">{t.phone}</span></div>
                          <div><span className="font-bold text-gray-400">Location:</span> <span>{t.preferredLocation}</span></div>
                          <div><span className="font-bold text-gray-400">Notice:</span> <span>{t.noticePeriod || 'Immediate'}</span></div>
                        </div>

                        {t.resumeFileName && (
                          <div className="flex items-center gap-2 text-xs text-sky-700 bg-sky-50 p-2.5 rounded-xl border border-sky-100 font-semibold">
                            <FileText className="w-4 h-4" />
                            <span>Resume Attached: {t.resumeFileName}</span>
                          </div>
                        )}

                        {t.keySkills && (
                          <div className="text-xs text-gray-700 bg-gray-50 p-2.5 rounded-xl">
                            <span className="font-bold text-gray-400 block mb-0.5">Skills Highlight:</span>
                            <p>{t.keySkills}</p>
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
                            className="text-xs text-red-600 hover:underline flex items-center gap-1 font-semibold"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove Profile</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16 bg-white rounded-3xl border border-gray-200">
                      <p className="text-xs text-gray-500">No talent pool profiles registered yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SECTION 7: COMPANY HERITAGE, STATS & STATUTORY COMPLIANCES */}
            {activeSection === 'company-info' && (
              <div className="space-y-6">
                
                {/* Stats Grid */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-gray-900">Hero & Heritage Statistics</h3>
                      <p className="text-xs text-gray-500">Key proof points displayed on Home & About pages.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {companyStats.map((st) => (
                      <div key={st.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                        <span className="text-xl font-extrabold text-sky-700 block">{st.value}</span>
                        <input
                          type="text"
                          value={st.label}
                          onChange={(e) => updateStat(st.id, { label: e.target.value })}
                          className="w-full px-2.5 py-1 text-xs font-bold rounded-lg border border-gray-300 bg-white"
                        />
                        <input
                          type="text"
                          value={st.subtext}
                          onChange={(e) => updateStat(st.id, { subtext: e.target.value })}
                          className="w-full px-2.5 py-1 text-[11px] text-gray-500 rounded-lg border border-gray-200 bg-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Statutory Compliances */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Statutory Compliance Registrations</h3>
                    <p className="text-xs text-gray-500">PF, ESI, PAN, and GST regulatory declarations.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {statutoryCompliances.map((c, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                        <input
                          type="text"
                          value={c.title}
                          onChange={(e) => updateCompliance(i, { title: e.target.value })}
                          className="w-full px-2.5 py-1 text-xs font-bold rounded-lg border border-gray-300 bg-white"
                        />
                        <textarea
                          rows={2}
                          value={c.desc}
                          onChange={(e) => updateCompliance(i, { desc: e.target.value })}
                          className="w-full px-2.5 py-1 text-xs text-gray-600 rounded-lg border border-gray-200 bg-white"
                        />
                        <input
                          type="text"
                          value={c.code}
                          onChange={(e) => updateCompliance(i, { code: e.target.value })}
                          className="w-full px-2.5 py-1 text-[10px] font-mono text-sky-700 bg-sky-50 rounded-lg border border-sky-200"
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
                
                <div className="bg-white p-6 rounded-3xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Client Reviews & Testimonials ({testimonials.length})</h3>
                    <p className="text-xs text-gray-500">Manage client quotes, star ratings, and facility satisfaction metrics.</p>
                  </div>
                  <button
                    onClick={() => openTestimonialModal(null)}
                    className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs flex items-center gap-1.5 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Testimonial</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testimonials.map((t) => (
                    <div key={t.id} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-sky-50 text-sky-700">
                            {t.serviceUsed}
                          </span>
                          <span className="text-amber-500 font-bold text-xs">{'★'.repeat(t.rating)}</span>
                        </div>
                        <h4 className="text-sm font-bold text-gray-900">{t.clientName}</h4>
                        <p className="text-[11px] text-gray-500">{t.designation} • {t.company} ({t.location})</p>
                        <p className="text-xs text-gray-600 leading-relaxed italic">"{t.quote}"</p>
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-emerald-700">Metric: {t.metric}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openTestimonialModal(t)}
                            className="p-1.5 bg-gray-100 hover:bg-sky-100 text-sky-700 rounded-lg"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete review from "${t.clientName}"?`)) {
                                deleteTestimonial(t.id);
                                showToast('Testimonial deleted.');
                              }
                            }}
                            className="p-1.5 bg-gray-100 hover:bg-red-50 text-red-600 rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
              <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">System Settings & Data Tools</h3>
                  <p className="text-xs text-gray-500">Export site backups or reset all dynamic data to initial MANABS defaults.</p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="p-5 rounded-2xl bg-sky-50 border border-sky-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-sky-900">Export Complete Website Backup</h4>
                      <p className="text-xs text-sky-700">Downloads a timestamped JSON file containing all customized services, jobs, leads, and stats.</p>
                    </div>
                    <button
                      onClick={handleExportBackup}
                      className="px-5 py-2.5 bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs shrink-0 flex items-center gap-1.5"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download JSON</span>
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl bg-red-50 border border-red-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-red-900">Reset All Data to System Defaults</h4>
                      <p className="text-xs text-red-700">Restores default 5 services, official job openings, stats, and clears test lead data.</p>
                    </div>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you absolutely sure you want to reset all dynamic website data back to factory defaults?')) {
                          resetAllToDefaults();
                          showToast('All website data reset to default successfully!');
                        }
                      }}
                      className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs shrink-0 flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-4 h-4" />
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative border border-gray-200 text-gray-900 max-h-[90vh] overflow-y-auto my-6">
            <button onClick={() => setModalType(null)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              {editingItem ? `Edit Service: ${editingItem.title}` : 'Add New Service Vertical'}
            </h3>
            <form onSubmit={handleSaveService} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={serviceForm.title}
                  onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Category / Domain</label>
                  <input
                    type="text"
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Accent Theme Color</label>
                  <select
                    value={serviceForm.accentColor}
                    onChange={(e) => setServiceForm({ ...serviceForm, accentColor: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white"
                  >
                    <option value="sky">Sky Blue (Pillar)</option>
                    <option value="red">Coral Red (Highlight)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Tagline / Headline</label>
                <input
                  type="text"
                  value={serviceForm.tagline}
                  onChange={(e) => setServiceForm({ ...serviceForm, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Short Description (Cards)</label>
                <input
                  type="text"
                  value={serviceForm.shortDesc}
                  onChange={(e) => setServiceForm({ ...serviceForm, shortDesc: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Full Detailed Overview</label>
                <textarea
                  rows={3}
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Key Features (1 per line)</label>
                <textarea
                  rows={3}
                  value={serviceForm.featuresText}
                  onChange={(e) => setServiceForm({ ...serviceForm, featuresText: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Frequently Asked Questions (Format: Question | Answer)</label>
                <textarea
                  rows={2}
                  value={serviceForm.faqsText}
                  onChange={(e) => setServiceForm({ ...serviceForm, faqsText: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 bg-gray-100 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl"
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative border border-gray-200 text-gray-900 max-h-[90vh] overflow-y-auto my-6">
            <button onClick={() => setModalType(null)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              {editingItem ? `Edit Job Vacancy: ${editingItem.title}` : 'Post New Job Vacancy'}
            </h3>
            <form onSubmit={handleSaveJob} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-700 uppercase mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Department</label>
                  <select
                    value={jobForm.department}
                    onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white"
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
                  <label className="block font-bold text-gray-700 uppercase mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Experience</label>
                  <input
                    type="text"
                    required
                    value={jobForm.experience}
                    onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Salary Range</label>
                  <input
                    type="text"
                    required
                    value={jobForm.salary}
                    onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Job Description</label>
                <textarea
                  rows={2}
                  required
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Key Responsibilities (1 per line)</label>
                <textarea
                  rows={3}
                  value={jobForm.responsibilitiesText}
                  onChange={(e) => setJobForm({ ...jobForm, responsibilitiesText: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Qualifications (1 per line)</label>
                <textarea
                  rows={2}
                  value={jobForm.qualificationsText}
                  onChange={(e) => setJobForm({ ...jobForm, qualificationsText: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Skills (Comma separated)</label>
                <input
                  type="text"
                  value={jobForm.skillsText}
                  onChange={(e) => setJobForm({ ...jobForm, skillsText: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="hot-job"
                  checked={jobForm.isHot}
                  onChange={(e) => setJobForm({ ...jobForm, isHot: e.target.checked })}
                  className="rounded text-red-600"
                />
                <label htmlFor="hot-job" className="font-bold text-gray-700 cursor-pointer">
                  Mark as Urgent Hiring (Hot Opening)
                </label>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 bg-gray-100 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-red-600 to-sky-600 text-white font-bold rounded-xl"
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative border border-gray-200 text-gray-900 my-6">
            <button onClick={() => setModalType(null)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              {editingItem ? 'Edit Client Testimonial' : 'Add Client Testimonial'}
            </h3>
            <form onSubmit={handleSaveTestimonial} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Client Full Name *</label>
                <input
                  type="text"
                  required
                  value={testimonialForm.clientName}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, clientName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Designation</label>
                  <input
                    type="text"
                    value={testimonialForm.designation}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, designation: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Company</label>
                  <input
                    type="text"
                    value={testimonialForm.company}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Quote / Review</label>
                <textarea
                  rows={3}
                  required
                  value={testimonialForm.quote}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Metric Highlight</label>
                  <input
                    type="text"
                    value={testimonialForm.metric}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, metric: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Service Used</label>
                  <input
                    type="text"
                    value={testimonialForm.serviceUsed}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, serviceUsed: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 bg-gray-100 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-red-600 text-white font-bold rounded-xl"
                >
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboardPage;
