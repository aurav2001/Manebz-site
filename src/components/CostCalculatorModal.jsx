import React, { useState, useId } from 'react';
import {
  Calculator,
  X,
  CheckCircle2,
  Building2,
  ShieldCheck,
  Users,
  Truck,
  ArrowRight,
  Download,
  IndianRupee,
  FileCheck,
  Check,
  Send,
  Printer
} from 'lucide-react';
import { useCompany } from '../context/CompanyContext';
import { useLanguage } from '../context/LanguageContext';

const serviceOptions = [
  {
    id: 'ifm',
    title: 'Integrated Facility Management (IFM)',
    desc: 'Housekeeping, MEP maintenance, landscaping, hygiene & site supervision',
    icon: Building2,
    baseRatePerSqFt: 3.2,
    minCost: 65000,
    staffRatio: 8000 // 1 staff per 8,000 sq ft
  },
  {
    id: 'security',
    title: 'Security Guarding & Surveillance',
    desc: 'PSARA compliant trained guards, gunners, CCTV monitoring & gate pass automation',
    icon: ShieldCheck,
    baseRatePerSqFt: 2.4,
    minCost: 45000,
    staffRatio: 12000
  },
  {
    id: 'housekeeping',
    title: 'Mechanized Soft Services & Housekeeping',
    desc: 'Deep scrubbing, washroom hygiene, waste management & eco-certified chemicals',
    icon: CheckCircle2,
    baseRatePerSqFt: 2.1,
    minCost: 38000,
    staffRatio: 6500
  },
  {
    id: 'logistics',
    title: 'Warehouse & Logistics Staffing',
    desc: 'Pickers, packers, certified forklift operators & inventory floor leads',
    icon: Truck,
    baseRatePerSqFt: 2.8,
    minCost: 55000,
    staffRatio: 7500
  },
  {
    id: 'payroll',
    title: 'Staffing & 100% Compliant Payroll',
    desc: 'End-to-end recruitment, monthly biometric attendance, EPF, ESI challans & disbursal',
    icon: Users,
    baseRatePerHead: 18500,
    minCost: 50000,
    staffRatio: 1
  }
];

const addonList = [
  { id: 'scrubber', name: 'Ride-On Mechanized Auto-Scrubbers', cost: 24000, desc: 'Heavy duty floor care & polish' },
  { id: 'biometric', name: 'Cloud AI Biometric Attendance Unit', cost: 6500, desc: 'Real-time GPS geofencing & logs' },
  { id: 'supervisor', name: 'Dedicated 24/7 Quality Site Manager', cost: 32000, desc: 'Immediate incident escalation' },
  { id: 'compliance', name: '100% Zero-Liability Statutory Audit Shield', cost: 12000, desc: 'Monthly verified PF/ESI challan docket' }
];

export const CostCalculatorView = ({ isModal = false, onClose }) => {
  const { addInquiry } = useCompany();
  const { t, language } = useLanguage();

  const [selectedService, setSelectedService] = useState('ifm');
  const [areaSqFt, setAreaSqFt] = useState(35000);
  const [headcountCount, setHeadcountCount] = useState(15);
  const [shiftMode, setShiftMode] = useState('single'); // 'single', 'double', '247'
  const [selectedAddons, setSelectedAddons] = useState(['compliance', 'biometric']);

  // Inquiry form states
  const [leadForm, setLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    location: 'Delhi NCR'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);

  const toggleAddon = (id) => {
    setSelectedAddons(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Calculation Logic
  const currentServiceConfig = serviceOptions.find(s => s.id === selectedService) || serviceOptions[0];

  let shiftMultiplier = 1;
  if (shiftMode === 'double') shiftMultiplier = 1.75;
  if (shiftMode === '247') shiftMultiplier = 2.45;

  let calculatedStaffCount = 0;
  if (selectedService === 'payroll') {
    calculatedStaffCount = headcountCount;
  } else {
    calculatedStaffCount = Math.max(3, Math.ceil((areaSqFt / currentServiceConfig.staffRatio) * (shiftMultiplier > 1 ? shiftMultiplier * 0.85 : 1)));
  }

  const supervisorCount = Math.max(1, Math.floor(calculatedStaffCount / 12));
  const skilledCount = Math.max(1, Math.floor(calculatedStaffCount * 0.3));
  const generalStaffCount = Math.max(1, calculatedStaffCount - supervisorCount - skilledCount);

  // Average Wages in Delhi-NCR Matrix (Semi-skilled / Skilled / Supervisory avg ₹19,500)
  const baseManpowerCost = (generalStaffCount * 17800 + skilledCount * 21500 + supervisorCount * 28000) * (shiftMultiplier > 1 && selectedService === 'payroll' ? shiftMultiplier : 1);

  // Statutory PF (12%), ESI (3.25%), Bonus/Gratuity (~12%) = ~27.25%
  const statutoryCost = Math.round(baseManpowerCost * 0.2725);
  const consumablesCost = selectedService === 'housekeeping' || selectedService === 'ifm' ? Math.round(areaSqFt * 0.45) : 0;
  
  const addonsCost = selectedAddons.reduce((acc, addonId) => {
    const item = addonList.find(a => a.id === addonId);
    return acc + (item ? item.cost : 0);
  }, 0);

  const totalMonthlyCost = Math.max(currentServiceConfig.minCost, baseManpowerCost + statutoryCost + consumablesCost + addonsCost);
  const estimatedSavings = Math.round(totalMonthlyCost * 0.21); // ~21% savings vs unorganized inhouse hiring

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.phone) return;
    setIsSubmitting(true);

    const inquiryPayload = {
      name: leadForm.name,
      phone: leadForm.phone,
      email: leadForm.email,
      company: leadForm.company || 'Enterprise Client',
      service: currentServiceConfig.title,
      location: leadForm.location,
      scope: `${selectedService === 'payroll' ? `${headcountCount} Staff` : `${areaSqFt.toLocaleString()} sq.ft`}, ${shiftMode.toUpperCase()} Shifts, Total Estimated: ₹${totalMonthlyCost.toLocaleString('en-IN')}/mo`,
      budgetEstimate: `₹ ${totalMonthlyCost.toLocaleString('en-IN')} / month`
    };

    setTimeout(() => {
      addInquiry(inquiryPayload);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handlePrintProposal = () => {
    window.print();
  };

  return (
    <div className={`bg-white text-gray-900 rounded-3xl overflow-hidden shadow-2xl ${isModal ? 'max-w-5xl w-full' : 'w-full'}`}>
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-gray-950 via-slate-900 to-red-950 text-white p-6 sm:p-8 flex items-center justify-between border-b border-gray-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/30 border border-red-500/40 text-red-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Calculator className="w-3.5 h-3.5" />
            {t.calculator.badge}
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {t.calculator.title}
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mt-1">
            {t.calculator.subtitle}
          </p>
        </div>
        {isModal && onClose && (
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
        {/* Left Inputs Column */}
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
          {/* Step 1: Service Type */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-3">
              {t.calculator.selectService}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {serviceOptions.map((srv) => {
                const Icon = srv.icon;
                const isSelected = selectedService === srv.id;
                return (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => setSelectedService(srv.id)}
                    className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-red-50/70 border-red-600 shadow-sm ring-2 ring-red-600/20'
                        : 'bg-gray-50/60 border-gray-200 hover:border-gray-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-red-600 text-white' : 'bg-white text-gray-700 shadow-xs'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-gray-900 leading-tight">
                        {srv.title.split('(')[0]}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 line-clamp-2">
                      {srv.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Scale Sizing */}
          {selectedService === 'payroll' ? (
            <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-200 space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  {t.calculator.headcount}
                </label>
                <span className="text-lg font-black text-red-600 bg-white px-3 py-1 rounded-xl shadow-xs border border-red-200">
                  {headcountCount} Staff
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="500"
                step="5"
                value={headcountCount}
                onChange={(e) => setHeadcountCount(Number(e.target.value))}
                className="w-full accent-red-600 h-2 bg-gray-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-semibold text-gray-400">
                <span>5 Staff</span>
                <span>100 Staff</span>
                <span>250 Staff</span>
                <span>500+ Staff</span>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-200 space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  {t.calculator.areaSize}
                </label>
                <span className="text-lg font-black text-red-600 bg-white px-3 py-1 rounded-xl shadow-xs border border-red-200">
                  {areaSqFt.toLocaleString()} sq.ft
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="300000"
                step="5000"
                value={areaSqFt}
                onChange={(e) => setAreaSqFt(Number(e.target.value))}
                className="w-full accent-red-600 h-2 bg-gray-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-semibold text-gray-400">
                <span>5,000 sq.ft</span>
                <span>75,000 sq.ft</span>
                <span>1,50,000 sq.ft</span>
                <span>3,00,000+ sq.ft</span>
              </div>
            </div>
          )}

          {/* Step 3: Shifts */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2.5">
              {t.calculator.shifts}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'single', label: t.calculator.singleShift },
                { id: 'double', label: t.calculator.doubleShift },
                { id: '247', label: t.calculator.roundClock }
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setShiftMode(s.id)}
                  className={`py-2.5 px-3 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer ${
                    shiftMode === s.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Addons */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2.5">
              {t.calculator.addons}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {addonList.map((addon) => {
                const active = selectedAddons.includes(addon.id);
                return (
                  <button
                    key={addon.id}
                    type="button"
                    onClick={() => toggleAddon(addon.id)}
                    className={`p-3 rounded-xl text-left border flex items-start justify-between transition-all cursor-pointer ${
                      active
                        ? 'bg-sky-50/80 border-sky-500 text-gray-900 ring-1 ring-sky-500'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{addon.name}</div>
                      <div className="text-[10px] text-gray-500">{addon.desc}</div>
                    </div>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ml-2 ${active ? 'bg-sky-600 text-white' : 'border border-gray-300'}`}>
                      {active && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Output & Action Column */}
        <div className="lg:col-span-5 p-6 sm:p-8 bg-slate-50 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Header Badge */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                {t.calculator.resultsTitle}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                ✓ 100% PF/ESI Compliant
              </span>
            </div>

            {/* Total Monthly Amount Card */}
            <div className="bg-gradient-to-br from-slate-900 to-gray-950 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 rounded-full blur-2xl" />
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                {t.calculator.monthlyEstimate}
              </div>
              <div className="flex items-baseline gap-1.5 my-2">
                <span className="text-xl font-bold text-red-400">₹</span>
                <span className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                  {totalMonthlyCost.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-gray-400">/ month</span>
              </div>
              <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5 mt-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {t.calculator.savingsBadge} (Save ~₹{estimatedSavings.toLocaleString('en-IN')}/mo)
              </p>
            </div>

            {/* Manpower Staffing Distribution */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-gray-900 pb-2 border-b border-gray-100">
                <span>{t.calculator.recommendedStaff}:</span>
                <span className="text-sm font-black text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                  {calculatedStaffCount} Associates
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>• {t.calculator.supervisors}</span>
                  <span className="font-bold text-gray-900">{supervisorCount}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>• {t.calculator.skilledStaff}</span>
                  <span className="font-bold text-gray-900">{skilledCount}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>• {t.calculator.supportStaff}</span>
                  <span className="font-bold text-gray-900">{generalStaffCount}</span>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-gray-400 border-t border-gray-100">
                {t.calculator.statutoryBreakup}
              </div>
            </div>

            {/* Inquiry Trigger / Form */}
            {!showInquiryForm ? (
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInquiryForm(true)}
                  className="w-full py-3.5 px-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-black uppercase tracking-wider transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  {t.calculator.ctaSubmitQuote}
                </button>
                <button
                  type="button"
                  onClick={handlePrintProposal}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-gray-500" />
                  {t.calculator.ctaProposal}
                </button>
              </div>
            ) : isSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-300 p-5 rounded-2xl text-center space-y-2 animate-fadeIn">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-emerald-950">{t.common.success}</h4>
                <p className="text-xs text-emerald-800">
                  {t.calculator.proposalSuccess}
                </p>
                <button
                  onClick={() => { setIsSubmitted(false); setShowInquiryForm(false); }}
                  className="text-xs font-bold text-emerald-700 underline mt-2 cursor-pointer"
                >
                  Calculate Another Requirement
                </button>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="bg-white p-5 rounded-2xl border border-red-200 shadow-md space-y-3 animate-fadeIn">
                <div className="text-xs font-bold text-gray-900 border-b pb-2">
                  {t.calculator.quoteFormTitle}
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">{t.calculator.nameLabel} *</label>
                  <input
                    type="text"
                    required
                    value={leadForm.name}
                    onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                    placeholder="e.g. Sanjay Verma"
                    className="w-full px-3 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">{t.calculator.phoneLabel} *</label>
                    <input
                      type="tel"
                      required
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                      placeholder="+91 98110..."
                      className="w-full px-3 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">{t.calculator.companyLabel}</label>
                    <input
                      type="text"
                      value={leadForm.company}
                      onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })}
                      placeholder="Company Name"
                      className="w-full px-3 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">{t.calculator.emailLabel}</label>
                  <input
                    type="email"
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                    placeholder="sanjay@enterprise.com"
                    className="w-full px-3 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowInquiryForm(false)}
                    className="w-1/3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-2/3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                  >
                    {isSubmitting ? t.common.loading : t.calculator.submitBtn}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 text-center">
            <p className="text-[11px] text-gray-400">
              * Official final quote subject to physical site inspection & SLA scope confirmation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CostCalculatorModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <CostCalculatorView isModal={true} onClose={onClose} />
    </div>
  );
}
