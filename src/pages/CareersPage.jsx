import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  IndianRupee, 
  Search, 
  CheckCircle2, 
  ArrowRight, 
  GraduationCap, 
  ShieldCheck, 
  CreditCard, 
  Award, 
  UploadCloud, 
  X, 
  Send,
  Building2,
  Users,
  Database,
  FileCheck2,
  PhoneCall,
  Sparkles,
  Check,
  FileText,
  AlertCircle,
  Plus,
  Edit3,
  Trash2,
  Settings,
  RotateCcw,
  CheckSquare,
  Layers,
  ChevronRight
} from 'lucide-react';
import { jobOpenings as defaultJobOpenings, employeePerks } from '../data/companyData';
import { useCompany } from '../context/CompanyContext';

const perkIcons = {
  ShieldCheck: ShieldCheck,
  GraduationCap: GraduationCap,
  CreditCard: CreditCard,
  Award: Award,
};

const CareersPage = ({ onNavigate }) => {
  const { 
    jobs, 
    addJobApplication, 
    addTalentVaultApplication,
    employeePerks: dynamicPerks 
  } = useCompany();

  // 2. Filters & Search State
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedLoc, setSelectedLoc] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // 3. Right-Side Panel Master-Detail State
  // Selected job for right panel (defaults to first job)
  const [selectedJobId, setSelectedJobId] = useState(() => jobs[0]?.id || 'job-1');
  // Right panel view mode: 'details' (Job details), 'apply' (Apply for selected job), 'talent-vault' (Future Resume Bank)
  const [rightPanelMode, setRightPanelMode] = useState('details');

  // 4. Job Application Form State
  const [applyForm, setApplyForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    experience: '1 - 3 Years',
    currentLocation: '',
    message: '',
    resumeFileName: '',
  });
  const [applySubmitted, setApplySubmitted] = useState(false);
  const [applyRefId, setApplyRefId] = useState('');

  // 5. Future Talent Bank Form State
  const [talentForm, setTalentForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    targetDepartment: 'Integrated Facilities',
    preferredLocation: 'Delhi NCR (Delhi, Gurugram, Noida)',
    experience: '1 - 3 Years',
    expectedSalary: '',
    noticePeriod: 'Immediate / < 15 Days',
    keySkills: '',
    resumeFileName: '',
    consent: true
  });
  const [talentSubmitted, setTalentSubmitted] = useState(false);
  const [talentAppId, setTalentAppId] = useState('');

  const departments = ['All', 'Integrated Facilities', 'HR & Payroll', 'Engineering & Maintenance', 'Logistics & Supply Chain', 'Quality & Compliance', 'Sales & Client Relations'];
  const locations = ['All', 'Delhi NCR', 'Uttar Pradesh', 'Haryana', 'Uttarakhand'];

  // Current active job object
  const activeJob = jobs.find(j => j.id === selectedJobId) || jobs[0];

  // Filtered jobs for left list
  const filteredJobs = jobs.filter((job) => {
    const matchesDept = selectedDept === 'All' || job.department === selectedDept;
    const matchesLoc = selectedLoc === 'All' || job.location.toLowerCase().includes(selectedLoc.toLowerCase().replace(' delhi ncr', ''));
    const matchesSearch = searchTerm === '' || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (job.skills && job.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDept && matchesLoc && matchesSearch;
  });

  // Handle selecting a job
  const handleSelectJob = (jobId, mode = 'details') => {
    setSelectedJobId(jobId);
    setRightPanelMode(mode);
    setApplySubmitted(false);
    // Smooth scroll to right panel on mobile
    if (window.innerWidth < 1024) {
      const el = document.getElementById('career-right-panel');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle job application submission
  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!applyForm.fullName || !applyForm.phone) return;

    const ref = `MNB-APP-${Math.floor(100000 + Math.random() * 900000)}`;
    setApplyRefId(ref);

    addJobApplication({
      refId: ref,
      jobId: activeJob?.id,
      jobTitle: activeJob?.title,
      ...applyForm
    });

    setApplySubmitted(true);
  };

  // Handle future talent pool submission
  const handleTalentPoolSubmit = (e) => {
    e.preventDefault();
    if (!talentForm.fullName || !talentForm.phone) return;

    const generatedId = `MNB-TALENT-${Math.floor(100000 + Math.random() * 900000)}`;
    setTalentAppId(generatedId);

    addTalentVaultApplication({
      id: generatedId,
      ...talentForm
    });

    setTalentSubmitted(true);
  };

  return (
    <div className="bg-white pt-24 sm:pt-28 pb-20">
      
      {/* 1. HERO BANNER */}
      <section className="bg-gradient-to-r from-[#b91c1c] via-[#dc2626] to-[#b91c1c] text-white py-12 px-4 sm:px-6 lg:px-8 shadow-md relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-3 relative z-10">
          <span className="text-[11px] font-extrabold uppercase tracking-widest bg-white/15 px-3.5 py-1 rounded-full text-white inline-block">
            MANABS National Resource Cell • Careers & Staffing Portal
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wide uppercase">
            Careers & Job Vacancies
          </h1>
          <p className="text-xs sm:text-sm text-red-100 max-w-2xl mx-auto leading-relaxed">
            "Recruit Quality Resources, Nurture and Retain". Browse active vacancies on the left, read full job specifications on the right, or submit your resume directly.
          </p>
        </div>
      </section>

      {/* 2. EMPLOYEE PERKS TICKER */}
      <div className="bg-[#0a192f] text-white py-4 border-b border-sky-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold text-gray-200">100% PF & ESI Security</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <GraduationCap className="w-4 h-4 text-sky-400 shrink-0" />
              <span className="font-semibold text-gray-200">2-Week Paid Induction</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CreditCard className="w-4 h-4 text-red-400 shrink-0" />
              <span className="font-semibold text-gray-200">On-Time Bank Salary</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-semibold text-gray-200">Fast-Track Career Growth</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN SPLIT-SCREEN WORKSPACE (Left: Vacancies List | Right: Details & Direct Form) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Top Controls Bar: Search + Filter Chips + Admin Mode Button */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-red-600">
                Active Job Openings ({filteredJobs.length} Available)
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900 mt-0.5">
                Explore Vacancies & Apply Instantly
              </h2>
            </div>

            <div className="w-full sm:w-72">
              {/* Search Box */}
              <div className="relative w-full">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search role or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-red-500 text-xs bg-white"
                />
              </div>
            </div>
          </div>

          {/* Department Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs font-bold text-gray-500 shrink-0 mr-1">Domain:</span>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedDept === dept
                    ? 'bg-red-600 text-white shadow-xs font-bold'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* 4. SPLIT LAYOUT: LEFT (Cards) & RIGHT (Details & Form) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: VACANCY CARDS LIST (7 of 12 columns) */}
          <div className="lg:col-span-7 space-y-4">
            
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => {
                const isSelected = selectedJobId === job.id && rightPanelMode !== 'talent-vault';
                return (
                  <div
                    key={job.id}
                    onClick={() => handleSelectJob(job.id, 'details')}
                    className={`rounded-2xl p-5 sm:p-6 transition-all duration-200 cursor-pointer border relative group ${
                      isSelected
                        ? 'bg-white border-red-500 shadow-lg ring-2 ring-red-500/20'
                        : 'bg-white border-gray-200 hover:border-red-300 hover:shadow-md'
                    }`}
                  >
                    {/* Active Selection Indicator */}
                    {isSelected && (
                      <div className="absolute top-0 right-0 bg-red-600 text-white text-[9px] font-extrabold uppercase px-3 py-0.5 rounded-bl-xl rounded-tr-xl">
                        Viewing Details
                      </div>
                    )}

                    <div className="space-y-3">
                      
                      {/* Department & Hot Badge */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-700">
                          {job.department}
                        </span>

                        <div>
                          {job.isHot && (
                            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Urgent Hiring
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Job Title */}
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors leading-snug">
                        {job.title}
                      </h3>

                      {/* Quick Meta Strip */}
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                          <span>{job.location}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                          <span>{job.experience}</span>
                        </span>
                        <span className="flex items-center gap-1 font-bold text-emerald-700">
                          <IndianRupee className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{job.salary}</span>
                        </span>
                      </div>

                      {/* Short Description */}
                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                        {job.description}
                      </p>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {job.skills?.slice(0, 4).map((skill, idx) => (
                          <span key={idx} className="text-[10px] font-medium bg-gray-50 text-gray-600 px-2 py-0.5 rounded-md border border-gray-100">
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Card Action Buttons */}
                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectJob(job.id, 'details');
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                            isSelected && rightPanelMode === 'details'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectJob(job.id, 'apply');
                          }}
                          className="px-5 py-2 bg-gradient-to-r from-red-600 to-sky-600 hover:from-red-700 hover:to-sky-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                        >
                          <span>Apply Now</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-200 space-y-3">
                <p className="text-sm font-semibold text-gray-600">No active vacancies found for this filter.</p>
                <button
                  onClick={() => { setSelectedDept('All'); setSearchTerm(''); }}
                  className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl"
                >
                  Reset Search & Filters
                </button>
              </div>
            )}

            {/* Bottom Card: Drop Resume in Future Talent Vault */}
            <div className="bg-gradient-to-br from-[#0a192f] to-[#112240] text-white p-6 rounded-2xl shadow-md border border-sky-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-sky-400 uppercase tracking-widest">
                  <Database className="w-3 h-3 text-red-400" />
                  <span>National Resource Cell Talent Bank</span>
                </div>
                <h4 className="text-base font-bold text-white">
                  Don't see your matching opening?
                </h4>
                <p className="text-xs text-gray-300">
                  Submit your resume once. Our HR team contacts you as upcoming projects open.
                </p>
              </div>

              <button
                onClick={() => {
                  setRightPanelMode('talent-vault');
                  setTalentSubmitted(false);
                  if (window.innerWidth < 1024) {
                    const el = document.getElementById('career-right-panel');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-sky-600 hover:from-red-700 hover:to-sky-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0 whitespace-nowrap"
              >
                Drop Resume in Vault
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: STICKY INTERACTIVE DETAILS & DIRECT APPLICATION FORM (5 of 12 columns) */}
          <div id="career-right-panel" className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            
            {/* Panel Card Container */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
              
              {/* Panel Top Navigation Tabs */}
              <div className="bg-gray-50 p-2 border-b border-gray-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  
                  {/* Tab 1: Job Details */}
                  {rightPanelMode !== 'talent-vault' && (
                    <>
                      <button
                        onClick={() => setRightPanelMode('details')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                          rightPanelMode === 'details'
                            ? 'bg-white text-gray-900 shadow-xs border border-gray-200'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5 text-sky-600" />
                        <span>Job Specs</span>
                      </button>

                      {/* Tab 2: Apply Form */}
                      <button
                        onClick={() => {
                          setRightPanelMode('apply');
                          setApplySubmitted(false);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                          rightPanelMode === 'apply'
                            ? 'bg-red-600 text-white shadow-xs'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Apply Online</span>
                      </button>
                    </>
                  )}

                  {/* Tab 3: Future Talent Vault */}
                  <button
                    onClick={() => {
                      setRightPanelMode('talent-vault');
                      setTalentSubmitted(false);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                      rightPanelMode === 'talent-vault'
                        ? 'bg-gradient-to-r from-[#0a192f] to-[#1e3a8a] text-white shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Database className="w-3.5 h-3.5 text-sky-400" />
                    <span>Future Vault</span>
                  </button>
                </div>

                {rightPanelMode === 'talent-vault' && (
                  <button
                    onClick={() => setRightPanelMode('details')}
                    className="text-[10px] font-bold text-red-600 hover:underline shrink-0"
                  >
                    Back to Jobs
                  </button>
                )}
              </div>

              {/* VIEW 1: FULL JOB DETAILS & SPECIFICATIONS */}
              {rightPanelMode === 'details' && activeJob && (
                <div className="p-6 sm:p-7 space-y-6 max-h-[78vh] overflow-y-auto">
                  
                  {/* Job Header */}
                  <div className="space-y-2 pb-4 border-b border-gray-100">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-700">
                        {activeJob.department}
                      </span>
                      {activeJob.isHot && (
                        <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                          🔥 Urgent Opening
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-extrabold text-gray-900">
                      {activeJob.title}
                    </h3>

                    <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                      <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="text-[10px] font-bold text-gray-400 uppercase block">Location</span>
                        <span className="font-semibold text-gray-900">{activeJob.location}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="text-[10px] font-bold text-gray-400 uppercase block">Experience</span>
                        <span className="font-semibold text-gray-900">{activeJob.experience}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="text-[10px] font-bold text-gray-400 uppercase block">Salary Package</span>
                        <span className="font-bold text-emerald-700">{activeJob.salary}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="text-[10px] font-bold text-gray-400 uppercase block">Working Shift</span>
                        <span className="font-semibold text-gray-900">{activeJob.workingHours || 'Rotational'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Job Overview */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Role Overview
                    </h4>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {activeJob.description}
                    </p>
                  </div>

                  {/* Key Responsibilities */}
                  {activeJob.responsibilities && activeJob.responsibilities.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Key Responsibilities & Deliverables
                      </h4>
                      <ul className="space-y-1.5 text-xs text-gray-700">
                        {activeJob.responsibilities.map((resp, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Qualifications */}
                  {activeJob.qualifications && activeJob.qualifications.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Eligibility & Qualifications
                      </h4>
                      <ul className="space-y-1.5 text-xs text-gray-700">
                        {activeJob.qualifications.map((q, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Required Skills */}
                  {activeJob.skills && activeJob.skills.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Required Core Competencies
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {activeJob.skills.map((s, i) => (
                          <span key={i} className="text-[11px] font-semibold bg-sky-50 text-sky-800 px-2.5 py-1 rounded-lg border border-sky-100">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bottom Apply CTA Button inside details */}
                  <div className="pt-3 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setRightPanelMode('apply');
                        setApplySubmitted(false);
                      }}
                      className="w-full py-3.5 bg-gradient-to-r from-red-600 to-sky-600 hover:from-red-700 hover:to-sky-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
                    >
                      <span>Proceed to Apply for this Role</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              )}

              {/* VIEW 2: DIRECT ON-PANEL JOB APPLICATION FORM */}
              {rightPanelMode === 'apply' && activeJob && (
                <div className="p-6 sm:p-7 space-y-5 max-h-[78vh] overflow-y-auto">
                  
                  <div className="pb-3 border-b border-gray-100">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-600">
                      Direct Application
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mt-0.5">
                      Apply for {activeJob.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {activeJob.location} • {activeJob.experience}
                    </p>
                  </div>

                  {!applySubmitted ? (
                    <form onSubmit={handleApplySubmit} className="space-y-4 text-gray-900">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Amit Kumar"
                          value={applyForm.fullName}
                          onChange={(e) => setApplyForm({ ...applyForm, fullName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-red-500 text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                            Mobile Number *
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="+91 98765 43210"
                            value={applyForm.phone}
                            onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-red-500 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            placeholder="amit@email.com"
                            value={applyForm.email}
                            onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-red-500 text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                            Total Experience
                          </label>
                          <select
                            value={applyForm.experience}
                            onChange={(e) => setApplyForm({ ...applyForm, experience: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-red-500 text-xs bg-white"
                          >
                            <option value="Fresher / < 1 Year">Fresher / &lt; 1 Year</option>
                            <option value="1 - 3 Years">1 - 3 Years</option>
                            <option value="3 - 6 Years">3 - 6 Years</option>
                            <option value="6+ Years">6+ Years</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                            Current City
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Noida / Gurugram"
                            value={applyForm.currentLocation}
                            onChange={(e) => setApplyForm({ ...applyForm, currentLocation: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-red-500 text-xs"
                          />
                        </div>
                      </div>

                      {/* Resume Upload File Box */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Attach Resume / CV (PDF / DOCX)
                        </label>
                        <div className="border-2 border-dashed border-gray-300 hover:border-red-500 rounded-2xl p-4 text-center cursor-pointer bg-gray-50 transition-colors">
                          <input
                            type="file"
                            id="direct-resume-upload"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setApplyForm({ ...applyForm, resumeFileName: e.target.files[0].name });
                              }
                            }}
                          />
                          <label htmlFor="direct-resume-upload" className="cursor-pointer space-y-1 block">
                            <UploadCloud className="w-6 h-6 text-red-600 mx-auto" />
                            <span className="text-xs font-semibold text-gray-800 block">
                              {applyForm.resumeFileName || 'Click to Select Resume File (PDF, DOCX up to 10MB)'}
                            </span>
                            {applyForm.resumeFileName && (
                              <span className="text-[10px] text-emerald-600 font-bold block">
                                ✓ File Selected: {applyForm.resumeFileName}
                              </span>
                            )}
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Cover Note / Why you are a good fit
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Briefly state your relevant experience..."
                          value={applyForm.message}
                          onChange={(e) => setApplyForm({ ...applyForm, message: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-red-500 text-xs"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 bg-gradient-to-r from-red-600 to-sky-600 hover:from-red-700 hover:to-sky-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
                      >
                        <Send className="w-4 h-4" />
                        <span>Submit Application for {activeJob.title}</span>
                      </button>
                    </form>
                  ) : (
                    <div className="text-center py-8 space-y-3 animate-in zoom-in-95 duration-200">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">
                        Ref #{applyRefId}
                      </span>
                      <h4 className="text-lg font-bold text-gray-900">Application Submitted!</h4>
                      <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                        Thank you <span className="font-bold text-gray-800">{applyForm.fullName}</span>. Your application for <span className="font-bold text-red-600">{activeJob.title}</span> is routed to our hiring manager.
                      </p>
                      <button
                        onClick={() => {
                          setApplySubmitted(false);
                          setRightPanelMode('details');
                        }}
                        className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl mt-2"
                      >
                        Back to Job Specs
                      </button>
                    </div>
                  )}

                </div>
              )}

              {/* VIEW 3: FUTURE TALENT BANK / RESUME DROP VAULT */}
              {rightPanelMode === 'talent-vault' && (
                <div className="p-6 sm:p-7 space-y-5 max-h-[78vh] overflow-y-auto">
                  
                  <div className="pb-3 border-b border-gray-100 space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 text-[10px] font-bold border border-sky-200">
                      <Database className="w-3 h-3 text-red-600" />
                      <span>National Resource Cell Talent Bank</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Drop Resume for Future Openings
                    </h3>
                    <p className="text-xs text-gray-500">
                      Our HR team will reach out when matching facility or logistics projects launch.
                    </p>
                  </div>

                  {!talentSubmitted ? (
                    <form onSubmit={handleTalentPoolSubmit} className="space-y-4 text-gray-900">
                      
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Rahul Sharma"
                          value={talentForm.fullName}
                          onChange={(e) => setTalentForm({ ...talentForm, fullName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-red-500 text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                            Mobile / WhatsApp *
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="+91 98765 43210"
                            value={talentForm.phone}
                            onChange={(e) => setTalentForm({ ...talentForm, phone: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-red-500 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            placeholder="rahul@email.com"
                            value={talentForm.email}
                            onChange={(e) => setTalentForm({ ...talentForm, email: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-red-500 text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Preferred Department / Domain
                        </label>
                        <select
                          value={talentForm.targetDepartment}
                          onChange={(e) => setTalentForm({ ...talentForm, targetDepartment: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-red-500 text-xs bg-white"
                        >
                          <option value="Integrated Facilities">Integrated Facilities (Housekeeping, Soft Services)</option>
                          <option value="HR & Payroll">HR Staffing & Statutory Payroll</option>
                          <option value="Engineering & Maintenance">Engineering & Maintenance (MEP/HVAC)</option>
                          <option value="Logistics & Supply Chain">Logistics & Warehouse Operations</option>
                          <option value="Quality & Compliance">Quality & Compliance Audits</option>
                          <option value="Sales & Client Relations">Sales & Client Relations</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                            Preferred Location
                          </label>
                          <select
                            value={talentForm.preferredLocation}
                            onChange={(e) => setTalentForm({ ...talentForm, preferredLocation: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-red-500 text-xs bg-white"
                          >
                            <option value="Delhi NCR (Delhi, Gurugram, Noida)">Delhi NCR</option>
                            <option value="Uttar Pradesh (Lucknow, Kanpur, Agra)">Uttar Pradesh</option>
                            <option value="Haryana (Manesar, Panipat, Sonipat)">Haryana</option>
                            <option value="Uttarakhand (Dehradun, Haridwar)">Uttarakhand</option>
                            <option value="Pan-India / Flexible">Pan-India</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                            Experience Level
                          </label>
                          <select
                            value={talentForm.experience}
                            onChange={(e) => setTalentForm({ ...talentForm, experience: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-red-500 text-xs bg-white"
                          >
                            <option value="Fresher / < 1 Year">Fresher / &lt; 1 Year</option>
                            <option value="1 - 3 Years">1 - 3 Years</option>
                            <option value="3 - 6 Years">3 - 6 Years</option>
                            <option value="6+ Years">6+ Years</option>
                          </select>
                        </div>
                      </div>

                      {/* Resume File Upload */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Attach Resume / CV File
                        </label>
                        <div className="border-2 border-dashed border-gray-300 hover:border-red-500 rounded-2xl p-4 text-center cursor-pointer bg-gray-50 transition-colors">
                          <input
                            type="file"
                            id="vault-resume-upload"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setTalentForm({ ...talentForm, resumeFileName: e.target.files[0].name });
                              }
                            }}
                          />
                          <label htmlFor="vault-resume-upload" className="cursor-pointer space-y-1 block">
                            <UploadCloud className="w-6 h-6 text-red-600 mx-auto" />
                            <span className="text-xs font-semibold text-gray-800 block">
                              {talentForm.resumeFileName || 'Click to Select Resume File (PDF, DOCX)'}
                            </span>
                            {talentForm.resumeFileName && (
                              <span className="text-[10px] text-emerald-600 font-bold block">
                                ✓ File: {talentForm.resumeFileName}
                              </span>
                            )}
                          </label>
                        </div>
                      </div>

                      {/* Consent Checkbox */}
                      <div className="flex items-start gap-2 pt-1 text-gray-600">
                        <input
                          type="checkbox"
                          id="vault-consent"
                          checked={talentForm.consent}
                          onChange={(e) => setTalentForm({ ...talentForm, consent: e.target.checked })}
                          className="mt-0.5 rounded text-red-600 focus:ring-red-400"
                        />
                        <label htmlFor="vault-consent" className="text-[11px] leading-tight cursor-pointer">
                          I agree to let MANABS HR team store my profile in the National Resource Cell talent bank for future matching opportunities.
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 bg-gradient-to-r from-[#0a192f] via-sky-700 to-red-600 hover:opacity-90 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
                      >
                        <Database className="w-4 h-4" />
                        <span>Register Profile in Talent Vault</span>
                      </button>

                    </form>
                  ) : (
                    <div className="text-center py-8 space-y-3 animate-in zoom-in-95 duration-200">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">
                        Talent ID: {talentAppId}
                      </span>
                      <h4 className="text-lg font-bold text-gray-900">Profile Added to Vault!</h4>
                      <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                        Thank you <span className="font-bold text-gray-800">{talentForm.fullName}</span>. Your resume is indexed in the MANABS central database for priority scout contact.
                      </p>
                      <button
                        onClick={() => {
                          setTalentSubmitted(false);
                          setRightPanelMode('details');
                        }}
                        className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl mt-2"
                      >
                        Back to Job Openings
                      </button>
                    </div>
                  )}

                </div>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default CareersPage;
