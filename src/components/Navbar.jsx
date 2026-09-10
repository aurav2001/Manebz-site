import React, { useState, useEffect } from 'react';
import logoImg from '../assets/logo.jpg';
import { 
  Home, 
  Info, 
  Layers, 
  MessageSquare, 
  Phone, 
  Users, 
  Truck, 
  Building2, 
  Briefcase, 
  ShieldCheck, 
  ChevronDown, 
  Menu, 
  X, 
  CheckCircle2, 
  ArrowRight,
  ChevronRight,
  FileCheck2,
  Calculator,
  BookOpen
} from 'lucide-react';
import { useCompany } from '../context/CompanyContext';

const iconMap = {
  Users: Users,
  Truck: Truck,
  Building2: Building2,
  Briefcase: Briefcase,
  ShieldCheck: ShieldCheck,
};

const Navbar = ({ currentPage, onNavigate }) => {
  const { services, addInquiry, navItems } = useCompany();
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteForm, setQuoteForm] = useState({ name: '', phone: '', service: 'HR STAFFING & PAYROLL MANAGEMENT', email: '' });
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [servicesLauncherOpen, setServicesLauncherOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll position to toggle between Top Navbar (at top) and Bottom Dock (when scrolled)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
        setServicesLauncherOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Bottom dock tabs
  const dockTabs = [
    { id: 'home', name: 'Home', icon: Home },
    { id: 'about', name: 'About', icon: Info },
    { id: 'services', name: 'Services', icon: Layers },
    { id: 'payroll', name: 'Payroll', icon: Briefcase },
    { id: 'contact', name: 'Contact', icon: MessageSquare },
  ];

  const handleQuoteSubmit = (e) => {
    e.preventDefault();
    if (!quoteForm.phone || !quoteForm.name) return;
    addInquiry(quoteForm);
    setQuoteSubmitted(true);
    setTimeout(() => {
      setQuoteSubmitted(false);
      setQuoteModalOpen(false);
      setQuoteForm({ name: '', phone: '', service: 'HR STAFFING & PAYROLL MANAGEMENT', email: '' });
    }, 2200);
  };

  return (
    <>
      {/* 1. TOP HEADER: Clean Floating Compact Bar (Visible at top of page, smooth hides on scroll) */}
      <div className={`fixed top-2.5 sm:top-4 left-0 right-0 z-40 flex justify-center px-3 sm:px-6 transition-all duration-300 ease-in-out ${
        isScrolled
          ? '-translate-y-28 opacity-0 pointer-events-none'
          : 'translate-y-0 opacity-100 pointer-events-auto'
      }`}>
        <header className="pointer-events-auto bg-white/95 backdrop-blur-md w-[92%] sm:w-auto max-w-5xl px-4 sm:px-8 py-2 sm:py-2.5 rounded-2xl lg:rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-100/90 flex justify-between lg:justify-center items-center gap-4 sm:gap-6 lg:gap-8 transition-all duration-300 relative">
          
          {/* Logo Area */}
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-left focus:outline-none group shrink-0"
          >
            <img 
              src={logoImg} 
              alt="MANEBZ / MANABS Logo" 
              loading="eager"
              decoding="async"
              className="h-7 sm:h-8 w-auto object-contain rounded-lg shadow-xs border border-gray-100 group-hover:scale-105 transition-transform" 
            />
          </button>

          {/* Desktop Navigation Links (Dynamically Managed from Admin Dashboard) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navItems && navItems.filter(item => item.isVisible).map((item) => {
              if (item.type === 'services-dropdown' || item.path === 'services') {
                return (
                  <div 
                    key={item.id}
                    className="relative py-2"
                    onMouseEnter={() => setServicesDropdownOpen(true)}
                    onMouseLeave={() => setServicesDropdownOpen(false)}
                  >
                    <button
                      onClick={() => onNavigate('services')}
                      className={`flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold transition-colors hover:text-red-600 cursor-pointer ${
                        servicesDropdownOpen || currentPage === 'services' ? 'text-red-600' : 'text-gray-700'
                      }`}
                    >
                      <span>{item.label || 'SERVICES'}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180 text-red-600' : 'text-gray-400'}`} />
                    </button>

                    {/* Exact Dropdown Menu */}
                    {servicesDropdownOpen && (
                      <div className="absolute top-full -left-16 pt-2 w-96 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                        <div className="bg-white rounded-2xl p-3 shadow-2xl border border-gray-100 divide-y divide-gray-50 max-h-[380px] overflow-y-auto">
                          {services.map((srv, idx) => {
                            const Icon = iconMap[srv.icon] || Building2;
                            return (
                              <div
                                key={srv.id || idx}
                                onClick={() => {
                                  setServicesDropdownOpen(false);
                                  onNavigate('services', srv.slug);
                                }}
                                className="py-2.5 px-3 rounded-xl hover:bg-sky-50/70 cursor-pointer flex items-start gap-3 transition-colors group"
                              >
                                <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600 group-hover:bg-red-500 group-hover:text-white transition-colors shrink-0 mt-0.5">
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div>
                                  <h5 className="text-[11px] font-bold text-red-600 group-hover:text-red-700 uppercase tracking-tight leading-snug">
                                    {srv.title}
                                  </h5>
                                  <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">{srv.desc}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              const isCurrent = currentPage === item.path || (item.path.startsWith('p/') && currentPage === 'p');
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.path)}
                  className={`flex items-center gap-1 text-xs uppercase tracking-wider font-bold transition-colors hover:text-sky-600 cursor-pointer ${
                    isCurrent 
                      ? 'text-sky-600 border-b-2 border-sky-500 pb-0.5' 
                      : 'text-gray-700'
                  }`}
                >
                  {item.isHot && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                    </span>
                  )}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action: Request Quote Button in Deep Coral Red */}
          <div className="hidden sm:flex items-center gap-4">
            <button
              onClick={() => setQuoteModalOpen(true)}
              className="flex items-center gap-2 bg-[#b91c1c] hover:bg-[#991b1b] text-white px-5 py-2.5 rounded-lg font-bold text-xs shadow-md hover:shadow-lg transition-all active:scale-95 tracking-wide"
            >
              <span>Request Quote</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-800 hover:bg-gray-100 rounded-xl"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </header>
      </div>

      {/* 2. REFINED COMPACT IPAD / MACOS BOTTOM DOCK (Hidden at top of page, smooth appears on scroll) */}
      <div className={`fixed bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center transition-all duration-300 ease-in-out ${
        isScrolled
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : 'translate-y-28 opacity-0 pointer-events-none'
      }`}>
        
        {/* Services Quick Pop-Up Launcher on dock */}
        {servicesLauncherOpen && (
          <div className="mb-2.5 w-[calc(100vw-32px)] sm:w-[380px] max-w-[380px] bg-white/95 backdrop-blur-2xl rounded-2xl p-3.5 shadow-2xl border border-gray-200 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 px-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                MANABS Service Spectrum
              </span>
              <button
                onClick={() => {
                  setServicesLauncherOpen(false);
                  onNavigate('services');
                }}
                className="text-[10px] font-bold text-sky-600 hover:underline flex items-center gap-0.5"
              >
                <span>View All</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-1 max-h-64 overflow-y-auto">
              {services.map((qs, i) => {
                const Icon = iconMap[qs.icon] || Building2;
                return (
                  <div
                    key={qs.id || i}
                    onClick={() => {
                      setServicesLauncherOpen(false);
                      onNavigate('services', qs.slug);
                    }}
                    className="p-2 rounded-xl hover:bg-sky-50 transition-all cursor-pointer flex items-center gap-2.5 group border border-transparent hover:border-sky-200"
                  >
                    <div className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center text-sky-700 group-hover:bg-red-500 group-hover:text-white transition-all shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h5 className="text-[11px] font-bold text-gray-900 group-hover:text-sky-600 transition-colors leading-tight line-clamp-1">
                        {qs.title}
                      </h5>
                      <span className="text-[9px] text-gray-400 block line-clamp-1">{qs.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Sleek iPad Dock Container */}
        <div className="relative bg-[#0a192f]/95 text-white backdrop-blur-2xl border border-sky-500/30 px-2 sm:px-3 py-1.5 rounded-full shadow-[0_12px_36px_rgba(14,165,233,0.25)] flex items-center gap-1 sm:gap-2 transition-all duration-300">
          
          {dockTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentPage === tab.id;
            return (
              <div 
                key={tab.id}
                className="relative flex flex-col items-center group"
                onMouseEnter={() => setHoveredTab(tab.id)}
                onMouseLeave={() => setHoveredTab(null)}
              >
                {/* Floating Tooltip */}
                {hoveredTab === tab.id && (
                  <div className="hidden sm:block absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-black/90 text-white text-[10px] font-semibold whitespace-nowrap shadow-lg border border-white/10 pointer-events-none animate-in fade-in zoom-in-95 duration-100">
                    {tab.name}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-[3px] border-transparent border-t-black/90" />
                  </div>
                )}

                {/* Compact App Icon */}
                <button
                  onClick={() => {
                    if (tab.id === 'services') {
                      setServicesLauncherOpen(!servicesLauncherOpen);
                    } else {
                      setServicesLauncherOpen(false);
                      onNavigate(tab.id);
                    }
                  }}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 transform group-hover:scale-115 group-hover:-translate-y-1 ${
                    isActive 
                      ? 'bg-gradient-to-tr from-sky-400 to-sky-600 text-white shadow-md shadow-sky-500/30 font-bold' 
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                  }`}
                  aria-label={tab.name}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
                </button>
              </div>
            );
          })}

          {/* Clean Thin Divider */}
          <div className="w-[1px] h-5 bg-white/20 mx-0.5" />

          {/* Quick Quote Request on Dock */}
          <div 
            className="relative flex flex-col items-center group"
            onMouseEnter={() => setHoveredTab('quote')}
            onMouseLeave={() => setHoveredTab(null)}
          >
            {hoveredTab === 'quote' && (
              <div className="hidden sm:block absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-bold whitespace-nowrap shadow-lg pointer-events-none animate-in fade-in zoom-in-95 duration-100">
                Request Quote
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-[3px] border-transparent border-t-red-600" />
              </div>
            )}

            <button
              onClick={() => setQuoteModalOpen(true)}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white flex items-center justify-center transition-all duration-200 transform group-hover:scale-115 group-hover:-translate-y-1 shadow-md shadow-red-500/30"
              aria-label="Request Quote"
            >
              <FileCheck2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Mobile Off-Canvas Right-Side Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[80]">
          {/* Backdrop with smooth dark blur */}
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300"
          />
          
          {/* Right Slide-Over Panel */}
          <div className="fixed top-0 right-0 bottom-0 w-[86%] max-w-[360px] h-full bg-white shadow-[-12px_0_40px_rgba(0,0,0,0.25)] flex flex-col justify-between z-[90] animate-in slide-in-from-right duration-300 ease-out border-l border-slate-100">
            
            {/* 1. Header with Logo and Close X */}
            <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/60">
              <div className="flex items-center gap-2">
                <img 
                  src={logoImg} 
                  alt="MANEBZ" 
                  className="h-8 w-auto object-contain rounded"
                />
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-xs"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. Scrollable Navigation Body */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              
              {/* Main Links */}
              <div className="space-y-1">
                <button
                  onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                    currentPage === 'home' 
                      ? 'bg-slate-900 text-white shadow-sm' 
                      : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>HOME</span>
                </button>

                <button
                  onClick={() => { onNavigate('about'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                    currentPage === 'about' 
                      ? 'bg-slate-900 text-white shadow-sm' 
                      : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <Info className="w-4 h-4" />
                  <span>ABOUT US</span>
                </button>
              </div>

              {/* Services Section */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between px-2 mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    OUR SERVICES
                  </span>
                  <button
                    onClick={() => { onNavigate('services'); setMobileMenuOpen(false); }}
                    className="text-[10px] font-bold text-red-600 hover:underline cursor-pointer"
                  >
                    View All →
                  </button>
                </div>

                <div className="space-y-1 pl-1">
                  {services.map((srv, idx) => {
                    const Icon = iconMap[srv.icon] || Building2;
                    return (
                      <button
                        key={srv.id || idx}
                        onClick={() => { onNavigate('services', srv.slug); setMobileMenuOpen(false); }}
                        className="w-full text-left py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 hover:text-red-600 hover:bg-red-50/60 flex items-center justify-between transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-600 shrink-0" />
                          <span className="truncate">{srv.title}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Special Sections */}
              <div className="pt-2 border-t border-slate-100 space-y-1">
                <button
                  onClick={() => { onNavigate('payroll'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    currentPage === 'payroll' 
                      ? 'bg-slate-900 text-white shadow-sm' 
                      : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4" />
                    <span>PAYROLL</span>
                  </div>
                  <span className="text-[9px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-extrabold">100% PF/ESI</span>
                </button>

                <button
                  onClick={() => { onNavigate('careers'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    currentPage === 'careers' 
                      ? 'bg-slate-900 text-white shadow-sm' 
                      : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4" />
                    <span>CAREERS</span>
                  </div>
                  <span className="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-extrabold">HIRING</span>
                </button>

                <button
                  onClick={() => { onNavigate('contact'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                    currentPage === 'contact' 
                      ? 'bg-slate-900 text-white shadow-sm' 
                      : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  <span>CONTACT US</span>
                </button>
              </div>

              {/* Direct Support Card */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1.5 mt-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Central Helpdesk
                </span>
                <a
                  href="tel:+911123456789"
                  className="flex items-center gap-2 text-xs font-bold text-slate-800 hover:text-red-600 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-red-600" />
                  <span>+91 11 2345 6789</span>
                </a>
              </div>

            </div>

            {/* 3. Bottom Sticky Action Area */}
            <div className="p-4 border-t border-slate-100 bg-white">
              <button
                onClick={() => { setMobileMenuOpen(false); setQuoteModalOpen(true); }}
                className="w-full flex items-center justify-center gap-2 bg-[#b91c1c] hover:bg-[#991b1b] text-white py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-red-500/20 active:scale-98 transition-all cursor-pointer"
              >
                <span>Request Instant Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-center text-slate-400 mt-2 font-medium">
                Pan-India Facility & Workforce Network
              </p>
            </div>

          </div>
        </div>
      )}

      {/* Request Quote Modal */}
      {quoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl p-5 sm:p-8 max-w-md w-full shadow-2xl relative border border-gray-100 text-gray-900 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setQuoteModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!quoteSubmitted ? (
              <form onSubmit={handleQuoteSubmit} className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-2 shadow-inner">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900">Request a Facility & Staffing Quote</h3>
                  <p className="text-xs text-gray-500 mt-1">Delhi NCR • UP • Haryana • Uttarakhand • Pan-India</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name / company"
                    value={quoteForm.name}
                    onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 91234 56789"
                    value={quoteForm.phone}
                    onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Select Required Service</label>
                  <select
                    value={quoteForm.service}
                    onChange={(e) => setQuoteForm({ ...quoteForm, service: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-sky-500 text-xs bg-white"
                  >
                    <option value="HR STAFFING & PAYROLL MANAGEMENT">HR STAFFING & PAYROLL MANAGEMENT</option>
                    <option value="LOGISTICS & WAREHOUSE MANAGEMENT">LOGISTICS & WAREHOUSE MANAGEMENT</option>
                    <option value="INTEGRATED FACILITIES MANAGEMENT">INTEGRATED FACILITIES MANAGEMENT</option>
                    <option value="REAL ESTATE ADVISORY LEASING & RELOCATION SERVICES">REAL ESTATE ADVISORY LEASING & RELOCATION SERVICES</option>
                    <option value="COMPLIANCE MANAGEMENT">COMPLIANCE MANAGEMENT & AUDITS</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-red-600 to-sky-600 hover:from-red-700 hover:to-sky-700 text-white font-extrabold rounded-xl text-sm transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
                >
                  <span>Submit Quote Request</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">Quotation Request Received!</h4>
                <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
                  Thank you <span className="font-bold text-gray-800">{quoteForm.name}</span>. Our facility management team will contact you at <span className="font-bold text-gray-800">{quoteForm.phone}</span> shortly.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
