import React, { useEffect } from 'react';
import { Home, ArrowRight, Search, Phone, Briefcase, Layers, FileQuestion } from 'lucide-react';
import { useCompany } from '../context/CompanyContext';

const QUICK_LINKS = [
  { page: 'home', label: 'Home', desc: 'Start from the beginning', icon: Home },
  { page: 'services', label: 'Services', desc: 'Our 5 service verticals', icon: Layers },
  { page: 'careers', label: 'Careers', desc: 'Current openings', icon: Briefcase },
  { page: 'contact', label: 'Contact', desc: 'Talk to our team', icon: Phone },
];

/**
 * Shown for any URL that does not match a page.
 *
 * An SPA cannot send a real 404 status — Apache rewrites every path to index.html before
 * React sees it — so the next best thing is to tell crawlers not to index the URL. The
 * noindex tag is removed on unmount so it never leaks onto a real page.
 */
const NotFoundPage = ({ onNavigate, attemptedPath }) => {
  const { customPages } = useCompany();

  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);

    const previousTitle = document.title;
    document.title = 'Page Not Found — MANEBZ';

    return () => {
      meta.remove();
      document.title = previousTitle;
    };
  }, []);

  const publishedPages = (customPages || []).filter((p) => p.isPublished !== false);

  return (
    <div className="bg-white">
      <section className="relative bg-[#071324] text-white pt-32 pb-20 sm:pt-40 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative z-10 space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-white/10 border border-white/15 text-sky-400 flex items-center justify-center mx-auto backdrop-blur-md">
            <FileQuestion className="w-8 h-8" />
          </div>

          <p className="text-7xl sm:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-200 to-red-500">
            404
          </p>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            This page doesn&apos;t exist
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
            The link may be mistyped, or the page may have been moved or unpublished.
          </p>

          {attemptedPath && (
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 text-xs font-mono text-slate-300 backdrop-blur-md max-w-full">
              <Search className="w-3.5 h-3.5 shrink-0 text-red-400" />
              {/* The path is rendered as text, never as markup. */}
              <span className="truncate">/{attemptedPath}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={() => onNavigate('home')}
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-sky-600 hover:from-red-500 hover:to-sky-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-red-500/25 inline-flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-500 mb-8">
          Or jump to a section
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_LINKS.map(({ page, label, desc, icon: Icon }) => (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-sky-500 hover:shadow-lg transition-all text-left group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors flex items-center justify-center mb-3">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-sky-600 transition-colors flex items-center gap-1">
                {label}
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </h3>
              <p className="text-xs text-gray-500 mt-1">{desc}</p>
            </button>
          ))}
        </div>

        {publishedPages.length > 0 && (
          <div className="mt-10 pt-8 border-t border-gray-200">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-500 mb-5">
              Other pages
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {publishedPages.map((p) => (
                <button
                  key={p.id || p.slug}
                  onClick={() => onNavigate(`p/${p.slug}`)}
                  className="px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-sky-400 hover:text-sky-700 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default NotFoundPage;
