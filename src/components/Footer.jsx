import React from 'react';
import logoImg from '../assets/logo.jpg';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Award, 
  CheckCircle2, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Calculator,
  Briefcase
} from 'lucide-react';
import { useCompany } from '../context/CompanyContext';

const Footer = ({ onNavigate }) => {
  const { services } = useCompany();

  return (
    <footer className="relative bg-gradient-to-b from-[#0a192f] via-[#071324] to-[#030914] text-slate-400 pt-16 pb-28 sm:pb-24 border-t border-slate-800/80 overflow-hidden">
      
      {/* Ambient background glow accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* TOP CTA ACTION STRIP */}
        <div className="bg-gradient-to-r from-white/5 via-white/[0.08] to-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-sky-400">
                Enterprise Workforce & Facilities Partner
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Ready to Upgrade Your Corporate Operations?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              100% statutory compliant workforce sourcing, commercial IFM, and automated payroll management.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('contact')}
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-red-500/25 flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Request Instant Quote</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="tel:+911149823000"
              className="w-full sm:w-auto px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-white/15 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-sky-400" />
              <span>+91 11 4982 3000</span>
            </a>
          </div>
        </div>

        {/* MAIN 4-COLUMN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 sm:gap-8 pb-12 border-b border-slate-800">
          
          {/* Column 1: Brand & Credentials (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1.5 rounded-2xl shadow-md border border-white/20 inline-block">
                <img 
                  src={logoImg} 
                  alt="MANEBZ / MANABS Logo" 
                  loading="lazy"
                  decoding="async"
                  className="h-9 w-auto object-contain rounded-lg"
                />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md block">
                  ● Est. 27th Feb 2014
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
                  Corporate India Solutions
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Pioneers in Strategic Integrated Facility Management (IFM), Corporate Workforce Sourcing, Modern Warehousing Operations, and Zero-Risk Statutory Compliance across North India.
            </p>

            {/* Credential Badges */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% PF, ESI & Statutory Compliance Shield</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Award className="w-4 h-4 text-sky-400 shrink-0" />
                <span>ISO 9001 & EMS Eco-Friendly Cleaning Standards</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Clock className="w-4 h-4 text-red-400 shrink-0" />
                <span>24/7 Rapid Escalation & Emergency Mobilization</span>
              </div>
            </div>
          </div>

          {/* Column 2: Service Spectrum (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-red-600 rounded-full"></span>
              <h4 className="text-xs font-black text-white uppercase tracking-widest">
                Service Spectrum
              </h4>
            </div>

            <ul className="space-y-2.5 text-xs">
              {(services && services.length > 0 ? services : [
                { id: 'srv-1', slug: 'hr-staffing', title: 'HR Staffing & Payroll Management' },
                { id: 'srv-2', slug: 'logistics-warehouse', title: 'Logistics & Warehouse Management' },
                { id: 'srv-3', slug: 'facilities-management', title: 'Integrated Facilities Management' },
                { id: 'srv-4', slug: 'real-estate', title: 'Real Estate Advisory & Relocation' },
                { id: 'srv-5', slug: 'compliance-management', title: 'Compliance Management & Audits' },
              ]).map((s) => (
                <li key={s.id || s.slug}>
                  <button 
                    onClick={() => onNavigate('services', s.slug)} 
                    className="group flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors text-left font-medium cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-red-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                    <span className="group-hover:translate-x-0.5 transition-transform">{s.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Navigation (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-sky-500 rounded-full"></span>
              <h4 className="text-xs font-black text-white uppercase tracking-widest">
                Quick Links
              </h4>
            </div>

            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors flex items-center gap-1.5 text-slate-300 font-medium cursor-pointer">
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors flex items-center gap-1.5 text-slate-300 font-medium cursor-pointer">
                  <span>About MANABS</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('calculator')} className="group hover:text-white transition-colors flex items-center gap-1.5 text-slate-300 font-bold cursor-pointer">
                  <span>Cost Calculator</span>
                  <span className="text-[9px] font-black uppercase bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.2 rounded">NEW</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('blog')} className="hover:text-white transition-colors flex items-center gap-1.5 text-slate-300 font-medium cursor-pointer">
                  <span>Blog & Insights</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('payroll')} className="group hover:text-white transition-colors flex items-center gap-1.5 text-slate-300 font-bold cursor-pointer">
                  <span>Payroll & Compliance</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('careers')} className="group hover:text-white transition-colors flex items-center gap-1.5 text-slate-300 font-bold cursor-pointer">
                  <span>Careers Portal</span>
                  <span className="text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded">HIRING</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors flex items-center gap-1.5 text-slate-300 font-medium cursor-pointer">
                  <span>Request Proposal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Base of Operations & Helplines (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-500 rounded-full"></span>
              <h4 className="text-xs font-black text-white uppercase tracking-widest">
                Regional Hubs & HQ
              </h4>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  <strong className="text-white block font-bold">Operational Coverage:</strong>
                  Delhi & NCR • Uttar Pradesh • Haryana • Uttarakhand
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <div className="flex flex-col">
                  <a href="tel:+911149823000" className="hover:text-white font-bold transition-colors">
                    +91 11 4982 3000
                  </a>
                  <a href="tel:+919876543210" className="text-slate-400 hover:text-white text-[11px] transition-colors">
                    +91 98765 43210
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-red-400 shrink-0" />
                <a href="mailto:contact@manabs.com" className="hover:text-white font-medium transition-colors">
                  contact@manabs.com
                </a>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-emerald-400 text-[11px] font-bold">
                <Clock className="w-3.5 h-3.5 shrink-0 animate-spin" style={{ animationDuration: '8s' }} />
                <span>24/7/365 Central Command Support</span>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT & COMPLIANCE BAR */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span>
              © {new Date().getFullYear()} <strong className="text-white">MANABS / MANEBZ Facilities & Workforce Management</strong>. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-5 text-[11px] flex-wrap justify-center font-medium">
            <button 
              onClick={() => onNavigate('p/statutory-compliance')} 
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Statutory Governance
            </button>
            <span className="text-slate-700">•</span>
            <span className="text-slate-400 hover:text-white transition-colors cursor-default">
              ISO 9001 & EMS Framework
            </span>
            <span className="text-slate-700">•</span>
            <span className="text-slate-400 hover:text-white transition-colors cursor-default">
              Privacy & Security
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
