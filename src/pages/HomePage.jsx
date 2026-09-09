import React, { useState } from 'react';
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
  GraduationCap
} from 'lucide-react';
import { servicesData, companyStats, qualityAssurancePoints } from '../data/companyData';
import { useCompany } from '../context/CompanyContext';
import PayrollSection from '../components/PayrollSection';
import TestimonialsSlider from '../components/TestimonialsSlider';

const iconMap = {
  Users: Users,
  Truck: Truck,
  Building2: Building2,
  Briefcase: Briefcase,
  ShieldCheck: ShieldCheck,
};

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
  const { services, companyStats: dynamicStats, addInquiry } = useCompany();
  const [emailInput, setEmailInput] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);

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
      
      {/* 1. HERO BANNER with Blue/Red Ambient Atmosphere */}
      <section className="relative bg-[#0a192f] text-white pt-36 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        
        {/* Subtle Sky Blue & Coral Red gradient glow matching logo */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-red-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-sky-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Award className="w-3.5 h-3.5 text-red-400" />
            <span>Founded Feb 27, 2014 • Delhi NCR • UP • Haryana • Uttarakhand</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Strategic Facilities Management & <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-200 to-red-500">
              Skilled Workforce Solutions
            </span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Delivering state-of-the-art machines, bio-friendly consumables, trained personnel, and 100% statutory compliance (PF, ESI, PAN) to leading Indian corporates 24 hours a day, 7 days a week.
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
                    className="w-full h-14 pl-12 pr-4 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-sky-400 text-sm backdrop-blur-md"
                  />
                </div>
                <button
                  type="submit"
                  className="h-14 px-7 rounded-full bg-gradient-to-r from-red-600 to-sky-600 hover:from-red-700 hover:to-sky-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 shrink-0 active:scale-95"
                >
                  <span>Request Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="p-3.5 rounded-full bg-white/10 border border-emerald-400 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Thank you! Our operations head will reach out at {emailInput}.</span>
              </div>
            )}
          </div>

          {/* Quick Stats Badges */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl">
              <span className="text-xl font-extrabold text-sky-400">10+ Years</span>
              <p className="text-[11px] text-gray-300">Excellence Since 2014</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl">
              <span className="text-xl font-extrabold text-red-400">24/7/365</span>
              <p className="text-[11px] text-gray-300">Round-the-Clock Ops</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl">
              <span className="text-xl font-extrabold text-sky-400">100%</span>
              <p className="text-[11px] text-gray-300">Statutory Compliances</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl">
              <span className="text-xl font-extrabold text-red-400">Pan-India</span>
              <p className="text-[11px] text-gray-300">Operational Reach</p>
            </div>
          </div>

        </div>

      </section>

      {/* 2. THE 5 CORE SERVICE VERTICALS */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-14 text-left max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2 block">
            Our Service Spectrum
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            Comprehensive <strong>Corporate Facilities & Staffing</strong>
          </h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-red-600 to-sky-600 rounded-full mt-4 mb-4" />
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Outsourcing facility management and workforce services is a smart business decision to increase efficiency, maintain flexible resources, and decrease operating costs.
          </p>
        </div>

        {/* 5 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv) => {
            const Icon = iconMap[srv.icon] || Building2;
            const isRed = srv.accentColor === 'red';
            return (
              <div
                key={srv.id}
                onClick={() => onNavigate('services', srv.slug)}
                className="group bg-white p-7 rounded-2xl border border-gray-200 hover:border-red-500 hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 mb-5 shadow-sm ${
                    isRed 
                      ? 'text-red-600 bg-red-50 group-hover:bg-red-600 group-hover:text-white' 
                      : 'text-sky-600 bg-sky-50 group-hover:bg-sky-600 group-hover:text-white'
                  }`}>
                    <Icon className="w-7 h-7" />
                  </div>

                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {srv.category}
                  </span>

                  <h3 className="text-lg font-bold text-gray-900 mt-2.5 group-hover:text-red-600 transition-colors uppercase tracking-tight">
                    {srv.title}
                  </h3>

                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    {srv.shortDesc}
                  </p>

                  <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5">
                    {srv.features.slice(0, 3).map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] text-gray-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="line-clamp-1">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-600 group-hover:text-red-600 transition-colors">
                    Explore Vertical
                  </span>
                  <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-gradient-to-r group-hover:from-red-600 group-hover:to-sky-600 group-hover:text-white flex items-center justify-center transition-all shadow-sm">
                    <ArrowRight className="w-3.5 h-3.5 -rotate-45 group-hover:rotate-0 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}

          {/* 6th Card: Know Us Better Callout Card */}
          <div 
            onClick={() => onNavigate('about')}
            className="group bg-gradient-to-br from-[#0a192f] to-[#112240] text-white p-7 rounded-2xl shadow-lg flex flex-col justify-between cursor-pointer hover:shadow-2xl transition-all"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 text-sky-400 flex items-center justify-center">
                <Award className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300">
                Pioneer Heritage
              </span>
              <h3 className="text-xl font-bold text-white">
                Know MANABS Better
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Founders were pioneers in Indian corporate facilities for 20+ years. Discover our dedicated in-house Resource Cell and ISO/EMS quality culture.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400 group-hover:text-white transition-colors">
                Read Full Story
              </span>
              <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-red-500 text-white flex items-center justify-center transition-all">
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

      {/* 3.5 AUTO-SLIDING CLIENT TESTIMONIALS SECTION */}
      <TestimonialsSlider onNavigate={onNavigate} />

      {/* 4. STATUTORY & QUALITY ASSURANCE HIGHLIGHT BANNER */}
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
                className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg text-center"
              >
                Request Corporate Quote
              </button>

              <button
                onClick={() => onNavigate('about')}
                className="w-full py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all text-center border border-white/20"
              >
                Learn About Resource Cell
              </button>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
