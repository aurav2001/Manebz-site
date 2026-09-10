import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Truck, 
  Building2, 
  Briefcase, 
  ShieldCheck, 
  ArrowRight, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Mail, 
  Clock, 
  Award, 
  MapPin, 
  Check, 
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { servicesData, companyStats, qualityAssurancePoints } from '../data/companyData';
import { useCompany } from '../context/CompanyContext';
import PayrollSection from '../components/PayrollSection';
import TestimonialsSlider from '../components/TestimonialsSlider';
import FAQSection from '../components/FAQSection';

const iconMap = {
  Users: Users,
  Truck: Truck,
  Building2: Building2,
  Briefcase: Briefcase,
  ShieldCheck: ShieldCheck,
};

const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
    title: 'Integrated Facilities Management',
    tagline: 'Modern Corporate Infrastructure & Soft Services Governance',
    badge: 'Integrated Facilities'
  },
  {
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2074&auto=format&fit=crop',
    title: 'Corporate Staffing & Payroll',
    tagline: '100% Statutory Compliant Workforce & Resource Cell',
    badge: 'Staffing & Payroll'
  },
  {
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop',
    title: 'Logistics & Warehousing',
    tagline: 'JIT Supply Chain & Certified Operations Crew',
    badge: 'Logistics Operations'
  },
  {
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=2070&auto=format&fit=crop',
    title: 'Engineering & Maintenance (MEP)',
    tagline: '24/7/365 HVAC, Electrical & Facility Uptime Governance',
    badge: 'Engineering & MEP'
  }
];

const workSteps = [
  {
    step: 'Step 01',
    title: 'Consultation & Site Audit',
    desc: 'Understanding your corporate facilities, workforce volume, logistics flow, and statutory compliance needs.',
    icon: Building2,
    color: 'text-sky-600 bg-sky-50',
  },
  {
    step: 'Step 02',
    title: 'Resource Cell Screening',
    desc: 'Rigorous selection and mandatory 2-week training including 6-8 days induction for all personnel.',
    icon: GraduationCap,
    color: 'text-red-600 bg-red-50',
  },
  {
    step: 'Step 03',
    title: 'Bio-Friendly Deployment',
    desc: 'Mobilization of state-of-the-art machines, eco-friendly consumables, and manager-level supervisors.',
    icon: Award,
    color: 'text-sky-600 bg-sky-50',
  },
  {
    step: 'Step 04',
    title: '24/7 Operations & QA Audits',
    desc: 'Round-the-clock facility uptime, ISO/EMS checklists, JIT replenishment, and unannounced surprise visits.',
    icon: ShieldCheck,
    color: 'text-red-600 bg-red-50',
  },
];

const HomePage = ({ onNavigate }) => {
  const { services, companyStats: dynamicStats, addInquiry, blogs } = useCompany();
  const [emailInput, setEmailInput] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-rotate hero images every 10 seconds (10000ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!emailInput) return;
    addInquiry({
      name: 'Web Visitor',
      email: emailInput,
      phone: 'Not provided',
      service: 'General Corporate Proposal',
      message: 'Requested quote proposal from Homepage Hero'
    });
    setEmailSubmitted(true);
  };

  return (
    <div className="bg-white">
      
      {/* 1. HERO BANNER WITH DYNAMIC 10-SEC AUTO-CHANGING BACKGROUND IMAGES */}
      <section className="relative bg-[#071324] text-white pt-36 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[640px] flex items-center justify-center">
        
        {/* Background Image Carousel (Smooth Cross-fade Every 10s) */}
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              activeSlide === idx ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className={`w-full h-full object-cover transform transition-transform duration-[10000ms] ease-out ${
                activeSlide === idx ? 'scale-105' : 'scale-100'
              }`}
            />
            {/* Crisp, clear, luminous overlays for visual clarity and text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#071324] via-[#071324]/60 to-[#071324]/30" />
            <div className="absolute inset-0 bg-slate-950/30" />
          </div>
        ))}

        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none z-1" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl pointer-events-none z-1" />

        {/* Main Content Container */}
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          
          {/* Top Tagline & Active Sector Badge */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-sky-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-xs">
              <Award className="w-3.5 h-3.5 text-red-400" />
              <span>Founded Feb 27, 2014 • Delhi NCR • UP • Haryana • Uttarakhand</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/30 border border-red-500/40 text-red-300 text-xs font-bold backdrop-blur-md animate-pulse">
              <Sparkles className="w-3 h-3 text-red-400" />
              <span>{heroSlides[activeSlide].badge}</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Strategic Facilities Management & <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-200 to-red-500">
              Skilled Workforce Solutions
            </span>
          </h1>

          <p className="text-sm sm:text-base text-gray-200 max-w-3xl mx-auto leading-relaxed drop-shadow-sm font-medium">
            {heroSlides[activeSlide].tagline} — Delivering state-of-the-art machines, bio-friendly consumables, trained personnel, and 100% statutory compliance (PF, ESI, PAN) 24 hours a day, 7 days a week.
          </p>

          {/* Consultation Quote Request Form */}
          <div className="max-w-lg mx-auto pt-2">
            {!emailSubmitted ? (
              <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="Enter corporate email for proposal"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 bg-white/15 border border-white/30 rounded-full text-white placeholder-gray-300 focus:outline-none focus:border-sky-400 text-sm backdrop-blur-md shadow-inner"
                  />
                </div>
                <button
                  type="submit"
                  className="h-14 px-7 rounded-full bg-gradient-to-r from-red-600 to-sky-600 hover:from-red-700 hover:to-sky-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 shrink-0 active:scale-95 cursor-pointer"
                >
                  <span>Request Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="p-3.5 rounded-full bg-emerald-950/80 border border-emerald-400 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 backdrop-blur-md">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Thank you! Our operations head will reach out at {emailInput}.</span>
              </div>
            )}
          </div>

          {/* 10-Second Auto Slider Indicator & Sector Pills */}
          <div className="pt-3 flex flex-col items-center gap-3">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {heroSlides.map((slide, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeSlide === idx
                      ? 'bg-white text-slate-950 shadow-lg scale-105'
                      : 'bg-white/10 hover:bg-white/20 text-gray-300 border border-white/10'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${activeSlide === idx ? 'bg-red-600 animate-ping' : 'bg-gray-400'}`} />
                  <span>{slide.badge}</span>
                </button>
              ))}
            </div>

            {/* 10-Second Continuous Progress Indicator Bar */}
            <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                key={activeSlide}
                className="h-full bg-gradient-to-r from-red-500 via-sky-400 to-emerald-400 rounded-full animate-[progress_10s_linear]"
                style={{
                  animation: 'growWidth 10s linear forwards'
                }}
              />
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3.5 rounded-2xl">
              <span className="text-xl font-extrabold text-sky-400">10+ Years</span>
              <p className="text-[11px] text-gray-300">Excellence Since 2014</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3.5 rounded-2xl">
              <span className="text-xl font-extrabold text-red-400">24/7/365</span>
              <p className="text-[11px] text-gray-300">Round-the-Clock Ops</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3.5 rounded-2xl">
              <span className="text-xl font-extrabold text-sky-400">100%</span>
              <p className="text-[11px] text-gray-300">Statutory Compliances</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3.5 rounded-2xl">
              <span className="text-xl font-extrabold text-red-400">Pan-India</span>
              <p className="text-[11px] text-gray-300">Operational Reach</p>
            </div>
          </div>

        </div>

      </section>

      {/* 2. THE 5 CORE SERVICE VERTICALS */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-16 text-left max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider">
            <span>Corporate Solutions</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Comprehensive <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0a192f] via-sky-700 to-red-600">Facilities & Staffing</span> Ecosystem
          </h2>
          <div className="w-16 h-1.5 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full mt-3 mb-3" />
          <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed pt-1">
            Tailored corporate services designed to accelerate business productivity, guarantee 100% statutory compliance, and ensure robust operational security.
          </p>
        </div>

        {/* 5 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((srv) => {
            const Icon = iconMap[srv.icon] || Building2;
            const isRed = srv.accentColor === 'red';
            return (
              <div
                key={srv.id}
                onClick={() => onNavigate('services', srv.slug)}
                className="group bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.06)] hover:shadow-2xl hover:border-sky-300 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1.5"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center justify-center text-sky-600 group-hover:bg-[#0a2540] group-hover:text-white transition-all duration-300">
                    <Icon className="w-7 h-7" />
                  </div>

                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    {srv.category}
                  </span>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors tracking-tight">
                    {srv.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {srv.shortDesc}
                  </p>

                  <div className="pt-2 space-y-2">
                    {srv.features.slice(0, 3).map((f, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="line-clamp-1">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0a2540] group-hover:text-sky-600 transition-colors">
                    Explore Vertical
                  </span>
                  <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-[#0a2540] group-hover:text-white flex items-center justify-center transition-all">
                    <ArrowRight className="w-3.5 h-3.5 -rotate-45 group-hover:rotate-0 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}

          {/* 6th Card: Know Us Better Callout Card */}
          <div 
            onClick={() => onNavigate('about')}
            className="group bg-gradient-to-br from-[#0a192f] via-[#0f284e] to-[#0a192f] text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between cursor-pointer hover:shadow-2xl hover:scale-[1.01] transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 text-sky-400 flex items-center justify-center">
                <Award className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-300 block">
                Founders Heritage
              </span>
              <h3 className="text-2xl font-black text-white tracking-tight">
                20+ Years Pioneer Facility Heritage
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                Discover our dedicated in-house National Resource Cell, 2-week induction program, and 100% statutory adherence.
              </p>
            </div>

            <div className="mt-8 pt-5 border-t border-white/15 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-300 group-hover:text-white transition-colors">
                Read Company Story
              </span>
              <div className="w-7 h-7 rounded-full bg-white/15 group-hover:bg-red-500 text-white flex items-center justify-center transition-all">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* 2.5 INTERACTIVE PAYROLL & STATUTORY COMPLIANCE MODULE */}
      <PayrollSection onNavigate={onNavigate} />

      {/* 3. HOW WE WORK (Step-by-Step Workflow) */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-600 block">
              Operational Rigor
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              How MANABS Operates
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-red-600 to-sky-600 mx-auto rounded-full mt-2" />
            <p className="text-gray-600 text-xs sm:text-sm pt-1">
              A systematic 4-step framework guaranteeing zero time-lag and 100% compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workSteps.map((ws) => {
              const Icon = ws.icon;
              return (
                <div 
                  key={ws.step}
                  className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3 hover:border-red-400 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-red-600">
                      {ws.step}
                    </span>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${ws.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-gray-900">
                    {ws.title}
                  </h3>

                  <p className="text-xs text-gray-500 leading-relaxed">
                    {ws.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. CLIENT TESTIMONIALS SLIDER */}
      <TestimonialsSlider onNavigate={onNavigate} />

      {/* 5. STATUTORY & QUALITY ASSURANCE HIGHLIGHT BANNER */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-sky-900 via-[#0a192f] to-gray-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
                100% Statutory Adherence & Quality Assurance
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                PF, ESI, PAN & Service Tax Registered with ISO & EMS Quality Management
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                We implement structured location checklists, Suggestion Registers, JIT replenishment, and surprise field audits by senior leadership to ensure flawless 24/7 operations.
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {['P.F. Registration', 'E.S.I. Registration', 'PAN Compliant', 'GST / Tax Adherence', 'ISO & EMS Audits', 'JIT System'].map((item, i) => (
                  <span key={i} className="px-3 py-1 bg-white/10 rounded-lg text-xs font-semibold text-sky-200 border border-white/10">
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
              <button
                onClick={() => onNavigate('contact')}
                className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg text-center cursor-pointer"
              >
                Request Corporate Quote
              </button>

              <button
                onClick={() => onNavigate('about')}
                className="w-full py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all text-center border border-white/20 cursor-pointer"
              >
                Learn About Resource Cell
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE ENTERPRISE FAQ ACCORDION SECTION */}
      <FAQSection onNavigate={onNavigate} />

    </div>
  );
};

export default HomePage;

