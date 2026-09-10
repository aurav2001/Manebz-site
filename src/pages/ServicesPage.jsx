import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Truck, 
  Building2, 
  Briefcase, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Phone,
  Clock,
  Award,
  Layers,
  Check,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  Calendar,
  Zap,
  ArrowLeft,
  Mail,
  Shield,
  Search,
  Star
} from 'lucide-react';
import { servicesData, statutoryCompliances, qualityAssurancePoints } from '../data/companyData';
import { useCompany } from '../context/CompanyContext';
import PayrollSection from '../components/PayrollSection';
import serviceBg from '../assets/servicebg.avif';

const iconMap = {
  Users: Users,
  Truck: Truck,
  Building2: Building2,
  Briefcase: Briefcase,
  ShieldCheck: ShieldCheck,
};

const ServicesPage = ({ onNavigate, initialServiceSlug = null }) => {
  const { services, qualityAssurancePoints: dynamicQA, statutoryCompliances: dynamicCompliances, addInquiry } = useCompany();
  const [activeTab, setActiveTab] = useState(initialServiceSlug || 'all');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'Delhi NCR',
    requirements: '',
    serviceName: ''
  });
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  useEffect(() => {
    if (initialServiceSlug) {
      setActiveTab(initialServiceSlug);
    }
  }, [initialServiceSlug]);

  const handleTabChange = (tabSlug) => {
    setActiveTab(tabSlug);
    setOpenFaqIndex(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuoteSubmit = (e, serviceTitle) => {
    e.preventDefault();
    if (!quoteForm.phone || !quoteForm.name) return;
    addInquiry({
      name: quoteForm.name,
      phone: quoteForm.phone,
      email: quoteForm.email,
      service: serviceTitle || quoteForm.serviceName || 'Service Page RFQ',
      message: `City: ${quoteForm.city || 'Delhi NCR'} | Details: ${quoteForm.requirements || 'General RFQ'}`
    });
    setQuoteSubmitted(true);
    setTimeout(() => {
      setQuoteSubmitted(false);
      setQuoteForm({
        name: '',
        phone: '',
        email: '',
        city: 'Delhi NCR',
        requirements: '',
        serviceName: ''
      });
    }, 3000);
  };

  // Find active service object if a specific service is selected
  const currentService = (services || []).find(
    (s) => s.slug === activeTab || s.id === activeTab
  );

  return (
    <div className="bg-white pb-20">
      
      {/* 1. HERO BANNER WITH LUXURY BREADCRUMB */}
      <section className="relative bg-[#071324] text-white pt-36 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-md">
        <div className="absolute inset-0 z-0">
          <img 
            src={serviceBg} 
            alt="Services Banner" 
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071324] via-[#071324]/85 to-[#071324]/60" />
        </div>

        {/* Glow elements */}
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 space-y-6">
          {/* Breadcrumb Row */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>

            {activeTab !== 'all' && currentService ? (
              <>
                <button
                  onClick={() => handleTabChange('all')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-300 hover:text-white transition-colors cursor-pointer bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full border border-white/15 backdrop-blur-md"
                >
                  <span>All Services</span>
                </button>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/25 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                  <Award className="w-3.5 h-3.5 text-red-400" />
                  <span>{currentService.category}</span>
                </div>
              </>
            ) : (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-sky-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                <Award className="w-3.5 h-3.5 text-red-400" />
                <span>MANABS 5-Pillar Service Spectrum</span>
              </div>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight uppercase">
            {activeTab !== 'all' && currentService ? currentService.title : (
              <>
                Strategic Facilities & <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-red-400">Workforce Solutions</span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed font-medium">
            {activeTab !== 'all' && currentService 
              ? currentService.tagline 
              : 'Operating across Delhi NCR, UP, Haryana, and Uttarakhand with 20+ years founder expertise, state-of-the-art machines, bio-friendly consumables, and 100% statutory compliance.'
            }
          </p>
        </div>
      </section>

      {/* 2. INTERACTIVE SERVICE SELECTOR TABS BAR (Normal flow, scrolls up naturally) */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            
            {/* All Overview Button */}
            <button
              onClick={() => handleTabChange('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-[#0a192f] to-[#1e3a8a] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All 5 Services</span>
            </button>

            {/* Individual Service Tabs */}
            {(services || []).map((s) => {
              const Icon = iconMap[s.icon] || Building2;
              const isActive = activeTab === s.slug || activeTab === s.id;
              const isRed = s.accentColor === 'red';
              return (
                <button
                  key={s.id}
                  onClick={() => handleTabChange(s.slug)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                    isActive
                      ? isRed 
                        ? 'bg-red-600 text-white shadow-md' 
                        : 'bg-sky-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{s.title}</span>
                </button>
              );
            })}

          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* VIEW A: ALL SERVICES OVERVIEW */}
        {activeTab === 'all' && (
          <div className="space-y-16">
            
            {/* Quick Introduction Banner */}
            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-left">
                <span className="text-xs font-bold uppercase tracking-widest text-red-600">Enterprise Service Catalog</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  Select a Service Vertical to Explore Deep-Dive Specs
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 max-w-2xl">
                  Each service vertical is supported by dedicated operational standard operating procedures (SOPs), statutory audits, and round-the-clock supervision.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => onNavigate('contact')}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <span>Request Full RFQ</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 5 Services Deep Cards List */}
            <div className="space-y-10">
              {(services || []).map((srv, index) => {
                const Icon = iconMap[srv.icon] || Building2;
                const isRed = srv.accentColor === 'red';
                return (
                  <div 
                    key={srv.id}
                    className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-sm hover:shadow-xl hover:border-sky-300 transition-all duration-300 flex flex-col lg:flex-row gap-8 items-stretch group"
                  >
                    {/* Left: Main Details */}
                    <div className="lg:w-2/3 flex flex-col justify-between space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                            isRed ? 'bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white' : 'bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white'
                          }`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                              Vertical 0{index + 1} • {srv.category}
                            </span>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 uppercase tracking-tight">
                              {srv.title}
                            </h3>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm font-semibold text-gray-700 italic">
                          "{srv.tagline}"
                        </p>

                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                          {srv.description}
                        </p>
                      </div>

                      {/* Feature Checklist */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-gray-100">
                        {srv.features.slice(0, 4).map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs font-medium text-gray-800">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="leading-snug">{feat}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <button
                          onClick={() => handleTabChange(srv.slug)}
                          className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm ${
                            isRed 
                              ? 'bg-red-50 text-red-700 hover:bg-red-600 hover:text-white' 
                              : 'bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white'
                          }`}
                        >
                          <span>Explore Deep-Dive Specs</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Right: Key Stats & SLA Callout Card */}
                    <div className="lg:w-1/3 bg-gradient-to-br from-gray-50 to-gray-100/80 rounded-2xl p-6 border border-gray-200 flex flex-col justify-between space-y-6">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 block mb-3">
                          Key Performance Metrics
                        </span>
                        
                        <div className="grid grid-cols-2 gap-3">
                          {srv.stats.map((st, i) => (
                            <div key={i} className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-2xs">
                              <span className={`text-base sm:text-lg font-extrabold block ${
                                isRed ? 'text-red-600' : 'text-sky-600'
                              }`}>
                                {st.value}
                              </span>
                              <span className="text-[10px] font-bold text-gray-800 block line-clamp-1">
                                {st.label}
                              </span>
                              <span className="text-[9px] text-gray-400 block line-clamp-1">
                                {st.sub}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-200 space-y-2">
                        <div className="flex items-center gap-2 text-[11px] text-gray-600">
                          <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>100% PF, ESI & Statutory Shield</span>
                        </div>
                        <button
                          onClick={() => {
                            handleTabChange(srv.slug);
                            setTimeout(() => {
                              const el = document.getElementById('service-rfq-form');
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }, 100);
                          }}
                          className="w-full py-2.5 bg-gradient-to-r from-red-600 to-sky-600 hover:from-red-700 hover:to-sky-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md text-center"
                        >
                          Request Quotation
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Comprehensive Service Matrix Comparison Table */}
            <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-10 shadow-sm space-y-6">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-sky-600">Cross-Vertical Comparison</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  MANABS Service Capability Matrix
                </h3>
                <p className="text-xs text-gray-500">
                  Comparing operational standards, compliance coverage, and delivery models across all 5 verticals.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 font-extrabold uppercase text-[10px] tracking-wider">
                      <th className="py-4 px-4">Service Vertical</th>
                      <th className="py-4 px-4">Key Personnel / Roles</th>
                      <th className="py-4 px-4">Quality & Machinery</th>
                      <th className="py-4 px-4">Statutory & Audits</th>
                      <th className="py-4 px-4">Deployment Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    <tr className="hover:bg-gray-50/50">
                      <td className="py-3.5 px-4 font-bold text-gray-900">HR Staffing & Payroll</td>
                      <td className="py-3.5 px-4">Frontline, Technical, Shift Leads & Managers</td>
                      <td className="py-3.5 px-4">Resource Cell 2-Wk Training, Soft Skills</td>
                      <td className="py-3.5 px-4"><span className="text-emerald-600 font-bold">100% PF, ESI, PAN, Bonus</span></td>
                      <td className="py-3.5 px-4 font-semibold text-sky-600">24 - 48 Hours</td>
                    </tr>
                    <tr className="hover:bg-gray-50/50">
                      <td className="py-3.5 px-4 font-bold text-gray-900">Logistics & Warehouse</td>
                      <td className="py-3.5 px-4">Certified Forklift Drivers, Pickers, Floor In-Charge</td>
                      <td className="py-3.5 px-4">JIT Inventory Systems, Heavy Stackers</td>
                      <td className="py-3.5 px-4"><span className="text-emerald-600 font-bold">OSHA & BIS Safety Standards</span></td>
                      <td className="py-3.5 px-4 font-semibold text-sky-600">48 - 72 Hours</td>
                    </tr>
                    <tr className="hover:bg-gray-50/50">
                      <td className="py-3.5 px-4 font-bold text-gray-900">Facilities Management (IFM)</td>
                      <td className="py-3.5 px-4">MEP Engineers, HVAC Techs, Soft Service Staff</td>
                      <td className="py-3.5 px-4">Ride-On Scrubbers, Bio Consumables</td>
                      <td className="py-3.5 px-4"><span className="text-emerald-600 font-bold">ISO & EMS Certified SOPs</span></td>
                      <td className="py-3.5 px-4 font-semibold text-sky-600">Immediate / 24/7</td>
                    </tr>
                    <tr className="hover:bg-gray-50/50">
                      <td className="py-3.5 px-4 font-bold text-gray-900">Real Estate Advisory</td>
                      <td className="py-3.5 px-4">Commercial Space Consultants, Fit-Out Leads</td>
                      <td className="py-3.5 px-4">Space Audits, Modular Infrastructure</td>
                      <td className="py-3.5 px-4"><span className="text-emerald-600 font-bold">Legal Contract & Lease Due Diligence</span></td>
                      <td className="py-3.5 px-4 font-semibold text-sky-600">Project-Based</td>
                    </tr>
                    <tr className="hover:bg-gray-50/50">
                      <td className="py-3.5 px-4 font-bold text-gray-900">Compliance & Audits</td>
                      <td className="py-3.5 px-4">Labour Law Specialists, ISO Auditors</td>
                      <td className="py-3.5 px-4">Location Checklists, Suggestion Logs</td>
                      <td className="py-3.5 px-4"><span className="text-emerald-600 font-bold">Monthly Surprise Audits & ECR Proofs</span></td>
                      <td className="py-3.5 px-4 font-semibold text-sky-600">Ongoing Monthly</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* VIEW B: DEDICATED INDIVIDUAL SERVICE DEEP DIVE */}
        {currentService && (
          <div className="space-y-12">
            
            {/* Top Breadcrumb Navigation Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
              <div className="flex items-center gap-2.5 flex-wrap text-xs font-bold uppercase tracking-wider">
                <button
                  onClick={() => onNavigate('home')}
                  className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-950 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Home</span>
                </button>
                <span className="text-slate-300 font-black">/</span>
                <button
                  onClick={() => handleTabChange('all')}
                  className="text-sky-600 hover:text-sky-800 transition-colors cursor-pointer"
                >
                  All Services
                </button>
                <span className="text-slate-300 font-black">/</span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[11px]">
                  {currentService.category}
                </span>
                <span className="text-slate-300 font-black">/</span>
                <span className="text-red-600 font-extrabold truncate max-w-[200px] sm:max-w-none">
                  {currentService.title}
                </span>
              </div>

              <button
                onClick={() => handleTabChange('all')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 shadow-2xs transition-colors cursor-pointer shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Switch Service</span>
              </button>
            </div>

            {/* Service Hero Header Card */}
            <div className="bg-gradient-to-r from-gray-900 via-[#0a192f] to-gray-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
              <div className="max-w-4xl space-y-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    currentService.accentColor === 'red' ? 'bg-red-500 text-white' : 'bg-sky-500 text-white'
                  }`}>
                    {React.createElement(iconMap[currentService.icon] || Building2, { className: "w-6 h-6" })}
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full text-sky-300">
                      MANABS Specialized Vertical
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight mt-1">
                      {currentService.title}
                    </h2>
                  </div>
                </div>

                <p className="text-base sm:text-lg text-sky-200 font-medium">
                  {currentService.tagline}
                </p>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-3xl">
                  {currentService.description}
                </p>
              </div>

              {/* 4 Stats Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10 relative z-10">
                {currentService.stats.map((st, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
                    <span className={`text-xl sm:text-2xl font-extrabold block ${
                      currentService.accentColor === 'red' ? 'text-red-400' : 'text-sky-400'
                    }`}>
                      {st.value}
                    </span>
                    <span className="text-xs font-bold text-white block mt-0.5">{st.label}</span>
                    <span className="text-[10px] text-gray-400 block">{st.sub}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section: Roles Covered & Personnel Spectrum */}
            <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-10 shadow-sm space-y-6">
              <div className="max-w-2xl space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-red-600">Personnel & Role Coverage</span>
                <h3 className="text-2xl font-extrabold text-gray-900">
                  Specialized Talent & Operational Profiles Deployed
                </h3>
                <p className="text-xs text-gray-500">
                  Every profile is sourced via our in-house Resource Cell and vetted with 100% background checks and statutory enrollment.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentService.rolesCovered.map((role, idx) => (
                  <div 
                    key={idx}
                    className="p-5 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-2 hover:border-sky-400 hover:bg-sky-50/40 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-600">
                        {role.level}
                      </span>
                      <span className="text-[10px] font-bold text-sky-600">
                        Exp: {role.exp}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 leading-snug">
                      {role.title}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 pt-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>100% PF/ESI & Police Vetted</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section: 4-Step Standard Operating Execution Workflow */}
            <div className="bg-gray-50 rounded-3xl border border-gray-200 p-8 sm:p-10 shadow-sm space-y-8">
              <div className="text-center max-w-2xl mx-auto space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-sky-600">Execution Framework</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  Standard Operating Procedures (SOP) & Lifecycle
                </h3>
                <p className="text-xs text-gray-500">
                  From initial audit to mobilization and ongoing 24/7 quality governance.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {currentService.workflow.map((wf, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-3 relative">
                    <span className="text-2xl font-black text-gray-200 block font-mono">
                      {wf.step}
                    </span>
                    <h4 className="text-sm font-bold text-gray-900">
                      {wf.title}
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {wf.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section: Key Features & Capabilities List */}
            <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-10 shadow-sm space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-red-600">Deliverables & Features</span>
                <h3 className="text-2xl font-extrabold text-gray-900">
                  What You Get with MANABS {currentService.title}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentService.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-800 leading-snug block">{feat}</span>
                      <span className="text-[11px] text-gray-500 mt-0.5 block">Managed under strict SLA benchmarks and periodic audits.</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section: Frequently Asked Questions Accordion */}
            <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-10 shadow-sm space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-sky-600">Client Clarifications</span>
                <h3 className="text-2xl font-extrabold text-gray-900">
                  Frequently Asked Questions
                </h3>
              </div>

              <div className="space-y-3">
                {currentService.faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div 
                      key={idx}
                      className="border border-gray-200 rounded-2xl overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full text-left p-5 bg-gray-50/60 hover:bg-gray-100/60 flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-gray-900 transition-colors"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-sky-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
                      </button>
                      {isOpen && (
                        <div className="p-5 bg-white text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 animate-in fade-in duration-150">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section: Fast-Track Service RFQ / Proposal Request Form */}
            <div id="service-rfq-form" className="bg-gradient-to-br from-[#0a192f] via-[#112240] to-gray-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-sky-400">Direct Fast-Track Proposal</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold">
                  Request a Customized Proposal for {currentService.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-300">
                  Serving Delhi NCR, Uttar Pradesh, Haryana, Uttarakhand & Pan-India corporate facilities.
                </p>
              </div>

              {!quoteSubmitted ? (
                <form 
                  onSubmit={(e) => handleQuoteSubmit(e, currentService.title)}
                  className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-900"
                >
                  <div>
                    <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider mb-1">Company / Contact Name *</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Apex Tech Park / Rahul Verma"
                      value={quoteForm.name}
                      onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white text-gray-900 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider mb-1">Phone / Mobile Number *</label>
                    <input 
                      type="tel"
                      required
                      placeholder="+91 91234 56789"
                      value={quoteForm.phone}
                      onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white text-gray-900 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider mb-1">Corporate Email</label>
                    <input 
                      type="email"
                      placeholder="admin@yourcompany.com"
                      value={quoteForm.email}
                      onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white text-gray-900 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider mb-1">Operating Location / State</label>
                    <select
                      value={quoteForm.city}
                      onChange={(e) => setQuoteForm({ ...quoteForm, city: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white text-gray-900 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
                    >
                      <option value="Delhi NCR (Delhi, Gurugram, Noida, Faridabad)">Delhi NCR (Delhi, Gurugram, Noida, Faridabad)</option>
                      <option value="Uttar Pradesh (Lucknow, Kanpur, Agra, Meerut)">Uttar Pradesh (Lucknow, Kanpur, Agra, Meerut)</option>
                      <option value="Haryana (Manesar, Panipat, Sonipat, Karnal)">Haryana (Manesar, Panipat, Sonipat, Karnal)</option>
                      <option value="Uttarakhand (Dehradun, Haridwar, Pantnagar, Rudrapur)">Uttarakhand (Dehradun, Haridwar, Pantnagar, Rudrapur)</option>
                      <option value="Pan-India Corporate Deployment">Pan-India Corporate Deployment</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider mb-1">Requirements / Scope of Work</label>
                    <textarea 
                      rows={3}
                      placeholder={`Tell us about your requirements for ${currentService.title} (e.g. area sq.ft, manpower volume, shifts)...`}
                      value={quoteForm.requirements}
                      onChange={(e) => setQuoteForm({ ...quoteForm, requirements: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white text-gray-900 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>

                  <div className="sm:col-span-2 pt-2">
                    <button
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-red-600 to-sky-600 hover:from-red-700 hover:to-sky-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <span>Submit Proposal Request for {currentService.title}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-emerald-900/40 border border-emerald-500/50 rounded-2xl p-8 max-w-lg mx-auto text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-lg font-bold text-white">Proposal Request Received!</h4>
                  <p className="text-xs text-gray-300">
                    Thank you <span className="font-bold text-white">{quoteForm.name}</span>. Our Operations Lead for <span className="font-bold text-sky-300">{currentService.title}</span> will contact you at <span className="font-bold text-white">{quoteForm.phone}</span> within 4 business hours.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* 4. INTERACTIVE PAYROLL COMPONENT (Included on services page for quick calculation) */}
      <PayrollSection onNavigate={onNavigate} />

      {/* 5. QUALITY ASSURANCE & STATUTORY STANDARDS BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="bg-[#0a192f] text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
              Quality Assurance Systems
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold">
              Why Corporate India Relies on MANABS
            </h3>
            <p className="text-xs text-gray-300">
              Structured inspection, Suggestion Registers, JIT management, and zero time-lag execution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {(dynamicQA || qualityAssurancePoints).slice(0, 6).map((qa, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="font-bold text-sky-400 block">{qa.title}</span>
                <p className="text-gray-300 text-[11px] leading-relaxed">{qa.desc}</p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-gray-300">Looking for turn-key facilities management or custom manpower staffing?</span>
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0"
            >
              Contact Operations Team
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};

export default ServicesPage;
