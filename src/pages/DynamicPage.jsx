import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Phone, 
  Mail, 
  Award, 
  FileText, 
  Globe, 
  Clock, 
  ArrowLeft 
} from 'lucide-react';
import { useCompany } from '../context/CompanyContext';

const DynamicPage = ({ slug, onNavigate }) => {
  const { customPages } = useCompany();
  const page = customPages.find(p => p.slug === slug || p.id === slug) || customPages[0];

  if (!page) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-36 pb-20 px-4 text-center">
        <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
          <FileText className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-slate-900">Page Not Found</h1>
        <p className="text-slate-600 mt-2 max-w-md">The requested custom page could not be located or may have been updated.</p>
        <button
          onClick={() => onNavigate('home')}
          className="mt-6 px-6 py-3 rounded-full bg-slate-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition-all cursor-pointer"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* 1. HERO BANNER */}
      <section className="relative bg-[#071324] text-white pt-36 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {page.heroImage && (
          <div className="absolute inset-0 z-0">
            <img 
              src={page.heroImage} 
              alt={page.title} 
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071324] via-[#071324]/80 to-transparent" />
          </div>
        )}

        <div className="max-w-5xl mx-auto relative z-10 space-y-6">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-sky-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Award className="w-3.5 h-3.5 text-red-400" />
            <span>{page.badge || 'Official Company Document'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {page.title}
          </h1>

          {page.heroTagline && (
            <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed font-medium">
              {page.heroTagline}
            </p>
          )}
        </div>
      </section>

      {/* 2. MAIN CONTENT BODY */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
        {/* Intro Highlight Box */}
        {page.content && (
          <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 text-xs font-extrabold uppercase tracking-widest text-red-600">
              <ShieldCheck className="w-4 h-4" />
              <span>Overview & Operational Protocol</span>
            </div>
            <p className="text-slate-800 text-base sm:text-lg leading-relaxed font-normal whitespace-pre-line">
              {page.content}
            </p>
          </div>
        )}

        {/* Dynamic Section Blocks */}
        {page.sections && page.sections.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 border-b border-slate-200 pb-3">
              Key Standards & Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {page.sections.map((sec, idx) => (
                <div 
                  key={idx} 
                  className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm hover:border-sky-400 hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-black text-xs">
                      {idx + 1}
                    </div>
                    <h4 className="text-base font-black text-slate-950">{sec.heading}</h4>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                    {sec.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. CALL TO ACTION SECTION */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-[#071324] text-white p-8 sm:p-12 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2">
            <h3 className="text-2xl font-black">Need custom enterprise assistance?</h3>
            <p className="text-slate-400 text-sm font-medium">
              Connect with our corporate facilities governance desk 24 hours a day, 7 days a week.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Contact Desk</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="tel:+918076632483"
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all border border-white/20 flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-sky-400" />
              <span>+91 8076632483</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DynamicPage;
