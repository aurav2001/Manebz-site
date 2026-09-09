import React, { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { jobOpenings, employeePerks } from '../data/companyData';

const perkIcons = {
  ShieldCheck: ShieldCheck,
  GraduationCap: GraduationCap,
  CreditCard: CreditCard,
  Award: Award,
};

const CareersPage = ({ onNavigate }) => {
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedLoc, setSelectedLoc] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [activeJob, setActiveJob] = useState(null);
  
  // Specific Job Application Form State
  const [applyForm, setApplyForm] = useState({
    name: '',
    phone: '',
    email: '',
    experience: '',
    currentLocation: '',
    message: '',
    resumeFileName: '',
  });
  const [applySubmitted, setApplySubmitted] = useState(false);

  // Future Talent Pool / Resume Vault Form State
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

  // Filtered Jobs
  const filteredJobs = jobOpenings.filter((job) => {
    const matchesDept = selectedDept === 'All' || job.department === selectedDept;
    const matchesLoc = selectedLoc === 'All' || job.location.toLowerCase().includes(selectedLoc.toLowerCase().replace(' delhi ncr', ''));
    const matchesSearch = searchTerm === '' || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      job.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDept && matchesLoc && matchesSearch;
  });

  const handleOpenApply = (job) => {
    setActiveJob(job);
    setApplyModalOpen(true);
    setApplySubmitted(false);
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!applyForm.name || !applyForm.phone) return;
    setApplySubmitted(true);
    setTimeout(() => {
      setApplySubmitted(false);
      setApplyModalOpen(false);
      setApplyForm({
        name: '',
        phone: '',
        email: '',
        experience: '',
        currentLocation: '',
        message: '',
        resumeFileName: '',
      });
    }, 2400);
  };

  const handleTalentPoolSubmit = (e) => {
    e.preventDefault();
    if (!talentForm.fullName || !talentForm.phone) return;

    const generatedId = `MNB-TALENT-${Math.floor(100000 + Math.random() * 900000)}`;
    setTalentAppId(generatedId);

    // Store in localStorage for persistence
    try {
      const existing = JSON.parse(localStorage.getItem('manabs_future_talent_bank') || '[]');
      existing.push({
        id: generatedId,
        date: new Date().toISOString(),
        ...talentForm
      });
      localStorage.setItem('manabs_future_talent_bank', JSON.stringify(existing));
    } catch (err) {
      console.error(err);
    }

    setTalentSubmitted(true);
  };

  const scrollToFuturePool = () => {
    const el = document.getElementById('future-talent-vault');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white pt-28 pb-20">
      
      {/* Top Banner */}
      <section className="bg-gradient-to-r from-[#b91c1c] via-[#dc2626] to-[#b91c1c] text-white py-14 px-4 sm:px-6 lg:px-8 shadow-md relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-4 relative z-10">
          <span className="text-[11px] font-extrabold uppercase tracking-widest bg-white/15 px-3 py-1 rounded-full text-white inline-block">
            Join The MANABS Team • In-House Resource Cell
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wide uppercase">
            Careers & Talent Opportunities
          </h1>
          <p className="text-sm sm:text-base text-red-100 max-w-2xl mx-auto leading-relaxed">
            "Recruit Quality Resources, Nurture and Retain". Build a fulfilling career with India's leading facilities, workforce, and engineering management enterprise.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                const el = document.getElementById('openings');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-2.5 bg-white text-red-600 hover:bg-gray-100 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
            >
              Browse Active Jobs
            </button>
            <button
              onClick={scrollToFuturePool}
              className="px-6 py-2.5 bg-sky-950/70 hover:bg-sky-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all border border-sky-400/40 flex items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5 text-sky-400" />
              <span>Drop Resume for Future Openings</span>
            </button>
          </div>
        </div>
      </section>

      {/* 1. EMPLOYEE PERKS & BENEFITS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-600">
            Why Work With Us
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Empowerment, Security & Growth
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-red-600 to-sky-600 mx-auto rounded-full mt-2" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {employeePerks.map((perk) => {
            const Icon = perkIcons[perk.icon] || ShieldCheck;
            return (
              <div
                key={perk.id}
                className="bg-gray-50 p-6 rounded-2xl border border-gray-200 hover:border-red-400 hover:shadow-lg transition-all space-y-3 group"
              >
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                  {perk.title}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {perk.desc}
                </p>
              </div>
            );
          })}
        </div>

      </section>

      {/* 2. IN-HOUSE RESOURCE CELL & TRAINING HIGHLIGHT */}
      <section className="bg-[#0a192f] text-white py-14 border-y border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
                National Resource Cell Model
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Mandatory 2-Week Comprehensive Induction & Training
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Every newly recruited team member undergoes rigorous 2-week training, of which <strong>6 to 8 days</strong> are intensive induction covering operating procedures, bio-friendly consumables, machinery safety, soft skills, and client etiquette.
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-lg-end">
              <div className="bg-white/10 p-6 rounded-2xl border border-white/15 text-center space-y-2 w-full">
                <span className="text-3xl font-black text-red-400">100% Paid</span>
                <p className="text-xs text-gray-200">Induction Training & Safety Certification Provided</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CURRENT JOB OPENINGS & FILTERS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="openings">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-gray-200 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-red-600">Current Openings</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              Explore Job Roles ({filteredJobs.length} Available)
            </h3>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by role or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-red-500 text-xs"
            />
          </div>
        </div>

        {/* Filters: Department & Region */}
        <div className="space-y-4 mb-10">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-bold text-gray-500 shrink-0 mr-2">Department:</span>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedDept === dept
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-bold text-gray-500 shrink-0 mr-2">Location:</span>
            {locations.map((loc) => (
              <button
                key={loc}
                onClick={() => setSelectedLoc(loc)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedLoc === loc
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Job Openings Grid */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white p-7 rounded-3xl border border-gray-200 hover:border-red-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                      {job.department}
                    </span>
                    {job.isHot && (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-700 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Urgent Hiring
                      </span>
                    )}
                  </div>

                  <h4 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                    {job.title}
                  </h4>

                  <div className="flex flex-wrap gap-y-1 gap-x-4 text-xs text-gray-500 mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-sky-500" />
                      {job.experience}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-gray-800">
                      <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                      {job.salary}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-gray-100">
                    {job.skills.map((skill, idx) => (
                      <span key={idx} className="text-[10px] font-medium bg-gray-50 text-gray-600 px-2.5 py-1 rounded-md border border-gray-100">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleOpenApply(job)}
                    className="w-full py-3 bg-gradient-to-r from-red-600 to-sky-600 hover:from-red-700 hover:to-sky-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 active:scale-98"
                  >
                    <span>Apply For This Position</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-200">
            <p className="text-sm font-semibold text-gray-600">No openings matching your current filter.</p>
            <button
              onClick={() => { setSelectedDept('All'); setSelectedLoc('All'); setSearchTerm(''); }}
              className="mt-3 text-xs font-bold text-red-600 underline"
            >
              Reset Filters
            </button>
          </div>
        )}

      </section>

      {/* 4. FUTURE TALENT POOL & RESUME VAULT (FEATURE REQUEST) */}
      <section id="future-talent-vault" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-gradient-to-br from-[#0a192f] via-[#112240] to-gray-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-sky-500/20">
          
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-8">
            
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-sky-300 text-xs font-bold uppercase tracking-wider">
                <Database className="w-3.5 h-3.5 text-red-400" />
                <span>MANABS National Resource Cell • Future Talent Bank</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Submit Your Resume for <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-red-400">Future Openings</span>
              </h2>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Even if an exact match isn't listed above, upload your CV to our central Resource Cell talent vault. When our HR & Operations leaders initiate new corporate facilities, warehousing hubs, or technical deployments, registered candidates receive priority contact and fast-track interviews.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[11px] text-sky-200">
                <span className="flex items-center gap-1">✓ 100% Confidential HR Bank</span>
                <span className="flex items-center gap-1">✓ Direct Priority Outreach</span>
                <span className="flex items-center gap-1">✓ 2-Week Paid Induction</span>
                <span className="flex items-center gap-1">✓ PF & ESI Statutory Security</span>
              </div>
            </div>

            {/* Form / Submitted Card */}
            {!talentSubmitted ? (
              <form 
                onSubmit={handleTalentPoolSubmit}
                className="max-w-3xl mx-auto bg-white/5 border border-white/10 p-6 sm:p-8 rounded-3xl backdrop-blur-md space-y-5 text-gray-900"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={talentForm.fullName}
                      onChange={(e) => setTalentForm({ ...talentForm, fullName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white text-gray-900 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider mb-1">
                      Mobile / WhatsApp Number *
                    </label>
                    <input 
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={talentForm.phone}
                      onChange={(e) => setTalentForm({ ...talentForm, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white text-gray-900 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input 
                      type="email"
                      placeholder="ramesh@email.com"
                      value={talentForm.email}
                      onChange={(e) => setTalentForm({ ...talentForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white text-gray-900 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider mb-1">
                      Preferred Department / Domain *
                    </label>
                    <select
                      value={talentForm.targetDepartment}
                      onChange={(e) => setTalentForm({ ...talentForm, targetDepartment: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white text-gray-900 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
                    >
                      <option value="Integrated Facilities (Housekeeping, Soft Services)">Integrated Facilities (Housekeeping, Soft Services)</option>
                      <option value="HR Staffing & Statutory Payroll">HR Staffing & Statutory Payroll</option>
                      <option value="Engineering & Maintenance (MEP, HVAC, Panels)">Engineering & Maintenance (MEP, HVAC, Panels)</option>
                      <option value="Logistics & Warehouse Operations (Forklift, Floor Ops)">Logistics & Warehouse Operations (Forklift, Floor Ops)</option>
                      <option value="Quality Assurance & ISO/EMS Audits">Quality Assurance & ISO/EMS Audits</option>
                      <option value="Corporate Administration & Management">Corporate Administration & Management</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider mb-1">
                      Preferred Location
                    </label>
                    <select
                      value={talentForm.preferredLocation}
                      onChange={(e) => setTalentForm({ ...talentForm, preferredLocation: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white text-gray-900 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
                    >
                      <option value="Delhi NCR (Delhi, Gurugram, Noida)">Delhi NCR (Delhi, Gurugram, Noida)</option>
                      <option value="Uttar Pradesh (Lucknow, Kanpur, Agra)">Uttar Pradesh (Lucknow, Kanpur, Agra)</option>
                      <option value="Haryana (Manesar, Panipat, Sonipat)">Haryana (Manesar, Panipat, Sonipat)</option>
                      <option value="Uttarakhand (Dehradun, Haridwar, Pantnagar)">Uttarakhand (Dehradun, Haridwar, Pantnagar)</option>
                      <option value="Pan-India / Flexible">Pan-India / Flexible</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider mb-1">
                      Total Experience
                    </label>
                    <select
                      value={talentForm.experience}
                      onChange={(e) => setTalentForm({ ...talentForm, experience: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white text-gray-900 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
                    >
                      <option value="Fresher / < 1 Year">Fresher / &lt; 1 Year</option>
                      <option value="1 - 3 Years">1 - 3 Years</option>
                      <option value="3 - 6 Years">3 - 6 Years</option>
                      <option value="6 - 10 Years">6 - 10 Years</option>
                      <option value="10+ Years">10+ Years (Senior Lead)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider mb-1">
                      Joining Availability
                    </label>
                    <select
                      value={talentForm.noticePeriod}
                      onChange={(e) => setTalentForm({ ...talentForm, noticePeriod: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white text-gray-900 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
                    >
                      <option value="Immediate / < 15 Days">Immediate / &lt; 15 Days</option>
                      <option value="1 Month Notice">1 Month Notice</option>
                      <option value="2 Months Notice">2 Months Notice</option>
                    </select>
                  </div>
                </div>

                {/* Resume Upload File Box */}
                <div>
                  <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider mb-1">
                    Attach Your Resume / CV File (PDF, DOC, DOCX)
                  </label>
                  <div className="border-2 border-dashed border-white/20 hover:border-sky-400 rounded-2xl p-5 text-center cursor-pointer transition-colors bg-white/5">
                    <input
                      type="file"
                      id="future-resume-upload"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setTalentForm({ ...talentForm, resumeFileName: e.target.files[0].name });
                        }
                      }}
                    />
                    <label htmlFor="future-resume-upload" className="cursor-pointer space-y-1 block">
                      <UploadCloud className="w-8 h-8 text-sky-400 mx-auto" />
                      <span className="text-xs font-semibold text-white block">
                        {talentForm.resumeFileName || 'Click to Select or Drop Resume (PDF, DOCX up to 10MB)'}
                      </span>
                      {talentForm.resumeFileName ? (
                        <span className="text-[11px] text-emerald-400 font-bold block">
                          ✓ File Attached: {talentForm.resumeFileName}
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400 block">
                          Supported formats: .pdf, .docx, .doc
                        </span>
                      )}
                    </label>
                  </div>
                </div>

                {/* Key Skills */}
                <div>
                  <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider mb-1">
                    Key Skills & Past Highlights (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. BMS operations, HT/LT electrical panels, JIT inventory, team supervision..."
                    value={talentForm.keySkills}
                    onChange={(e) => setTalentForm({ ...talentForm, keySkills: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-white text-gray-900 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>

                {/* Consent Checkbox */}
                <div className="flex items-start gap-2 pt-1 text-gray-300">
                  <input
                    type="checkbox"
                    id="talent-consent"
                    checked={talentForm.consent}
                    onChange={(e) => setTalentForm({ ...talentForm, consent: e.target.checked })}
                    className="mt-0.5 rounded text-sky-600 focus:ring-sky-400"
                  />
                  <label htmlFor="talent-consent" className="text-[11px] leading-tight cursor-pointer">
                    I authorize MANABS National Resource Cell and HR team to store my profile and contact me via Phone, WhatsApp, or Email whenever relevant job opportunities open.
                  </label>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-red-600 via-sky-600 to-sky-700 hover:from-red-700 hover:to-sky-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>Register Profile in MANABS Future Talent Bank</span>
                </button>
              </form>
            ) : (
              /* Success Confirmation Card */
              <div className="max-w-xl mx-auto bg-white/10 border border-emerald-400/60 p-8 rounded-3xl text-center space-y-4 backdrop-blur-md animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-300 block">
                    Registration Confirmed • Talent ID: {talentAppId}
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-1">
                    Profile Successfully Added to Talent Bank!
                  </h3>
                  <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                    Thank you, <span className="font-bold text-white">{talentForm.fullName}</span>. Your details and resume have been indexed in our central Resource Cell database.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-left text-xs text-gray-200 space-y-1.5">
                  <div className="flex justify-between"><span className="text-gray-400">Department:</span> <span className="font-bold text-white">{talentForm.targetDepartment}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Preferred Location:</span> <span className="text-sky-300">{talentForm.preferredLocation}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Contact Number:</span> <span className="text-emerald-400">{talentForm.phone}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Status:</span> <span className="font-bold text-emerald-300">✓ Active in HR Scout Pool</span></div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setTalentSubmitted(false);
                      setTalentForm({
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
                    }}
                    className="px-6 py-2.5 bg-white/15 hover:bg-white/25 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-white/20"
                  >
                    Submit Another Profile
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* Quick Apply Modal for specific jobs */}
      {applyModalOpen && activeJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative border border-gray-200 text-gray-900 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setApplyModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            {!applySubmitted ? (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div className="pb-3 border-b border-gray-100">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-red-600">Application Form</span>
                  <h3 className="text-xl font-bold text-gray-900">{activeJob.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{activeJob.department} • {activeJob.location}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Amit Kumar"
                      value={applyForm.name}
                      onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-red-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={applyForm.phone}
                      onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-red-500 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      placeholder="amit@email.com"
                      value={applyForm.email}
                      onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-red-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Total Experience</label>
                    <select
                      value={applyForm.experience}
                      onChange={(e) => setApplyForm({ ...applyForm, experience: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-red-500 text-xs bg-white"
                    >
                      <option value="">Select Experience</option>
                      <option value="Fresher / < 1 Year">Fresher / &lt; 1 Year</option>
                      <option value="1 - 3 Years">1 - 3 Years</option>
                      <option value="3 - 6 Years">3 - 6 Years</option>
                      <option value="6+ Years">6+ Years</option>
                    </select>
                  </div>
                </div>

                {/* Resume Upload Simulator */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Attach Resume / CV</label>
                  <div className="border-2 border-dashed border-gray-300 hover:border-red-500 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-gray-50">
                    <input
                      type="file"
                      id="resume-upload"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setApplyForm({ ...applyForm, resumeFileName: e.target.files[0].name });
                        }
                      }}
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer space-y-1 block">
                      <UploadCloud className="w-6 h-6 text-red-600 mx-auto" />
                      <span className="text-xs font-semibold text-gray-700 block">
                        {applyForm.resumeFileName || 'Click to Upload Resume (PDF, DOCX up to 5MB)'}
                      </span>
                      {applyForm.resumeFileName && (
                        <span className="text-[10px] text-emerald-600 font-bold block">✓ File attached successfully</span>
                      )}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Cover Note / Brief Message</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us why you are a great fit for this role..."
                    value={applyForm.message}
                    onChange={(e) => setApplyForm({ ...applyForm, message: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-red-500 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-red-600 to-sky-600 hover:from-red-700 hover:to-sky-700 text-white font-extrabold uppercase tracking-wider rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-md active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Application</span>
                </button>
              </form>
            ) : (
              <div className="text-center py-10 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">Application Submitted!</h4>
                <p className="text-xs text-gray-600 leading-relaxed max-w-sm mx-auto">
                  Thank you <span className="font-bold text-gray-800">{applyForm.name}</span>. Your application for <span className="font-bold text-red-600">{activeJob.title}</span> has been routed to our national Resource Cell. Our HR team will connect with you shortly.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default CareersPage;
