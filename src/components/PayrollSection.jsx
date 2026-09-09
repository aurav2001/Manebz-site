import React, { useState } from 'react';
import { 
  Calculator, 
  FileText, 
  CreditCard, 
  Receipt, 
  Fingerprint, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Download, 
  Building2, 
  Users, 
  DollarSign, 
  Layers,
  Award,
  ChevronRight,
  FileCheck2,
  Clock,
  Sparkles,
  Smartphone,
  TrendingUp,
  Percent,
  Check,
  Briefcase
} from 'lucide-react';
import { payrollFeatures, samplePayrollRoles } from '../data/companyData';

const iconMap = {
  Calculator: Calculator,
  FileText: FileText,
  CreditCard: CreditCard,
  Receipt: Receipt,
  Fingerprint: Fingerprint,
  ShieldCheck: ShieldCheck,
};

const PayrollSection = ({ onNavigate }) => {
  const [activeCalcTab, setActiveCalcTab] = useState('standard'); // 'standard', 'overtime', 'agency-invoice', 'statutory-bonus'
  const [selectedRole, setSelectedRole] = useState(samplePayrollRoles[0]);
  const [grossSalary, setGrossSalary] = useState(samplePayrollRoles[0].typicalGross);
  const [employeeCount, setEmployeeCount] = useState(25);
  const [showSlipModal, setShowSlipModal] = useState(false);

  // Advanced Mode States
  const [overtimeHours, setOvertimeHours] = useState(16); // 16 hrs OT per month
  const [nightShiftDays, setNightShiftDays] = useState(6);
  const [agencyFeePercent, setAgencyFeePercent] = useState(8.5); // 8.5% staffing margin
  const [bonusPercent, setBonusPercent] = useState(8.33); // 8.33% statutory annual bonus

  // 1. Standard Salary Breakdown Computations
  const basicSalary = Math.round((grossSalary * selectedRole.basicPercent) / 100);
  const hra = Math.round((grossSalary * selectedRole.hraPercent) / 100);
  const specialAllowance = Math.max(0, grossSalary - basicSalary - hra);

  // 2. PF & ESI Statutory Rules
  const pfWage = Math.min(basicSalary, 15000);
  const employeePF = Math.round(pfWage * 0.12);
  const employerPF = Math.round(pfWage * 0.12); // (3.67% EPF + 8.33% EPS)

  const isESIApplicable = grossSalary <= 21000;
  const employeeESI = isESIApplicable ? Math.round(grossSalary * 0.0075) : 0;
  const employerESI = isESIApplicable ? Math.round(grossSalary * 0.0325) : 0;

  const professionalTax = grossSalary > 15000 ? 200 : 0;
  const totalDeductions = employeePF + employeeESI + professionalTax;
  const inHandSalary = grossSalary - totalDeductions;

  // 3. Overtime Computation (Labor Law Rule: 2x Hourly Rate on Gross/26/8)
  const hourlyRate = (grossSalary / 26) / 8;
  const overtimeRate = hourlyRate * 2; // 2x double OT rate
  const monthlyOTPay = Math.round(overtimeRate * overtimeHours);
  const nightShiftAllowance = nightShiftDays * 150; // ₹150/night
  const totalGrossWithOT = grossSalary + monthlyOTPay + nightShiftAllowance;
  const inHandWithOT = totalGrossWithOT - totalDeductions;

  // 4. Employer CTC & B2B Staffing Billing
  const employerStatutoryCost = employerPF + employerESI;
  const basePersonCTC = grossSalary + employerStatutoryCost;
  const totalMonthlyBatchCost = basePersonCTC * employeeCount;

  // Agency Margin & GST for B2B Client Invoice
  const agencyManagementFee = Math.round((totalMonthlyBatchCost * agencyFeePercent) / 100);
  const subtotalBeforeTax = totalMonthlyBatchCost + agencyManagementFee;
  const gst18Percent = Math.round(subtotalBeforeTax * 0.18);
  const totalClientMonthlyInvoice = subtotalBeforeTax + gst18Percent;

  // 5. Annual Statutory Bonus & Gratuity
  const annualGross = grossSalary * 12;
  const annualStatutoryBonus = Math.round((annualGross * bonusPercent) / 100);
  const estimatedGratuity = Math.round(((basicSalary * 15) / 26) * 5); // 5 Yrs service estimate

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setGrossSalary(role.typicalGross);
  };

  return (
    <section className="py-20 bg-gray-50 border-y border-gray-200" id="payroll-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Automated Workforce Payroll Engine</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Automated <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-blue-700 to-red-600">Payroll & Statutory</span> Compliance
          </h2>
          <div className="w-16 h-1.5 bg-gradient-to-r from-sky-500 to-blue-600 mx-auto rounded-full mt-2" />
          <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed pt-1">
            End-to-end workforce disbursement engine: Automated EPFO/ESIC filings, 2x Overtime computations, 1-click Bank batch NEFT transfers, and B2B client invoice generation.
          </p>
        </div>

        {/* 1. INTERACTIVE MULTI-MODE CALCULATOR CARD */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-6 sm:p-10 mb-16">
          
          {/* Top Mode Selector Tabs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-gray-100 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                Interactive Enterprise Estimator
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">
                Workforce CTC & Compliance Engine
              </h3>
            </div>

            {/* Mode Switcher */}
            <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                onClick={() => setActiveCalcTab('standard')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCalcTab === 'standard'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                1. Standard CTC & Take-Home
              </button>
              <button
                onClick={() => setActiveCalcTab('overtime')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeCalcTab === 'overtime'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>2. Overtime (OT 2x) & Shifts</span>
              </button>
              <button
                onClick={() => setActiveCalcTab('agency-invoice')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeCalcTab === 'agency-invoice'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>3. B2B Client Invoice</span>
              </button>
              <button
                onClick={() => setActiveCalcTab('statutory-bonus')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeCalcTab === 'statutory-bonus'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <Percent className="w-3.5 h-3.5" />
                <span>4. Annual Bonus & Gratuity</span>
              </button>
            </div>
          </div>

          {/* Role Presets */}
          <div className="mb-8 flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
              Preset Roles:
            </span>
            {samplePayrollRoles.map((role) => (
              <button
                key={role.id}
                onClick={() => handleRoleSelect(role)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedRole.id === role.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {role.roleName.split('/')[0]}
              </button>
            ))}
          </div>

          {/* 2-Column Split: Controls vs Live Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Controls Workspace (6 Cols) */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Gross Salary Slider */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Monthly Gross Wage per Person
                  </label>
                  <span className="text-lg font-extrabold text-red-600">
                    ₹{grossSalary.toLocaleString('en-IN')}
                  </span>
                </div>

                <input
                  type="range"
                  min="12000"
                  max="120000"
                  step="500"
                  value={grossSalary}
                  onChange={(e) => setGrossSalary(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                />

                <div className="flex justify-between text-[10px] font-semibold text-gray-400">
                  <span>₹12,000 (Min Wage)</span>
                  <span>₹60,000 (Supervisor)</span>
                  <span>₹1,20,000 (Operations Lead)</span>
                </div>
              </div>

              {/* Headcount Slider */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Workforce Volume (Headcount)
                  </label>
                  <span className="text-lg font-extrabold text-sky-600">
                    {employeeCount} Personnel Deployed
                  </span>
                </div>

                <input
                  type="range"
                  min="5"
                  max="500"
                  step="5"
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />

                <div className="flex justify-between text-[10px] font-semibold text-gray-400">
                  <span>5 Staff</span>
                  <span>100 Staff</span>
                  <span>500+ Staff</span>
                </div>
              </div>

              {/* MODE 2 SPECIFIC: Overtime (OT 2x) & Night Shift Sliders */}
              {activeCalcTab === 'overtime' && (
                <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-amber-900 uppercase">
                      Monthly Overtime (2x Statutory Rate)
                    </label>
                    <span className="text-sm font-extrabold text-amber-900">{overtimeHours} Hours</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    step="2"
                    value={overtimeHours}
                    onChange={(e) => setOvertimeHours(Number(e.target.value))}
                    className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  />
                  <div className="grid grid-cols-2 gap-3 text-[11px] pt-2 border-t border-amber-200/60 text-amber-900">
                    <div>
                      <span>Base Hourly Pay:</span>
                      <strong className="block font-mono">₹{hourlyRate.toFixed(1)} / hr</strong>
                    </div>
                    <div>
                      <span>Double Overtime Pay (2x):</span>
                      <strong className="block font-mono text-emerald-700">₹{overtimeRate.toFixed(1)} / hr</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* MODE 3 SPECIFIC: Agency Fee Margin Slider */}
              {activeCalcTab === 'agency-invoice' && (
                <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-purple-900 uppercase">
                      MANABS Agency Management Fee
                    </label>
                    <span className="text-sm font-extrabold text-purple-900">{agencyFeePercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="15"
                    step="0.5"
                    value={agencyFeePercent}
                    onChange={(e) => setAgencyFeePercent(Number(e.target.value))}
                    className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <p className="text-[11px] text-purple-700">
                    Covers dedicated on-site supervision, uniform/ID kits, biometric hardware maintenance, and replacement guarantee.
                  </p>
                </div>
              )}

              {/* MODE 4 SPECIFIC: Annual Bonus Percentage */}
              {activeCalcTab === 'statutory-bonus' && (
                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-emerald-900 uppercase">
                      Payment of Bonus Act Percentage
                    </label>
                    <span className="text-sm font-extrabold text-emerald-900">{bonusPercent}% (Annual)</span>
                  </div>
                  <input
                    type="range"
                    min="8.33"
                    max="20"
                    step="0.5"
                    value={bonusPercent}
                    onChange={(e) => setBonusPercent(Number(e.target.value))}
                    className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <p className="text-[11px] text-emerald-700">
                    Mandatory annual festival/Diwali payout under the Payment of Bonus Act (minimum 8.33% to max 20%).
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSlipModal(true)}
                  className="flex-1 py-3 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Preview Payslip Format</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Request Proposal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Right: Dynamic Output Card (6 Cols) */}
            <div className="lg:col-span-6 bg-gradient-to-br from-[#0a192f] to-[#112240] text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
              
              {/* Card Dynamic Headline */}
              <div className="flex justify-between items-start border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-400">
                    {activeCalcTab === 'overtime' ? 'Net Take-Home (With OT)' : activeCalcTab === 'agency-invoice' ? 'Total Monthly Client Invoice' : 'Monthly Net Take-Home'}
                  </span>
                  <h4 className="text-3xl sm:text-4xl font-black text-white mt-1">
                    {activeCalcTab === 'overtime' ? `₹${inHandWithOT.toLocaleString('en-IN')}` : activeCalcTab === 'agency-invoice' ? `₹${totalClientMonthlyInvoice.toLocaleString('en-IN')}` : `₹${inHandSalary.toLocaleString('en-IN')}`}
                    <span className="text-xs font-normal text-gray-300"> / month</span>
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-400">
                    {activeCalcTab === 'agency-invoice' ? 'Pre-Tax CTC Batch' : 'Monthly CTC / Person'}
                  </span>
                  <div className="text-lg font-bold text-white mt-1">
                    {activeCalcTab === 'agency-invoice' ? `₹${totalMonthlyBatchCost.toLocaleString('en-IN')}` : `₹${basePersonCTC.toLocaleString('en-IN')}`}
                  </div>
                </div>
              </div>

              {/* Dynamic Rows based on active Tab */}
              {activeCalcTab === 'standard' && (
                <div className="space-y-2.5 text-xs animate-in fade-in">
                  <div className="flex justify-between py-1.5 border-b border-white/5 text-gray-300">
                    <span>Basic Wage ({selectedRole.basicPercent}%)</span>
                    <span className="font-bold text-white">₹{basicSalary.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5 text-gray-300">
                    <span>House Rent Allowance - HRA ({selectedRole.hraPercent}%)</span>
                    <span className="font-bold text-white">₹{hra.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5 text-gray-300">
                    <span>Special & Uniform Allowances</span>
                    <span className="font-bold text-white">₹{specialAllowance.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5 text-gray-300">
                    <span className="text-red-300">(-) Employee Deductions (PF 12% + ESI 0.75% + PT)</span>
                    <span className="font-bold text-red-400">-₹{totalDeductions.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5 text-gray-300">
                    <span className="text-sky-300">(+) Employer Share (PF 12% + ESI 3.25%)</span>
                    <span className="font-bold text-sky-400">+₹{employerStatutoryCost.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )}

              {activeCalcTab === 'overtime' && (
                <div className="space-y-2.5 text-xs animate-in fade-in">
                  <div className="flex justify-between py-1.5 border-b border-white/5 text-gray-300">
                    <span>Base Monthly Gross Wage:</span>
                    <span className="font-bold text-white">₹{grossSalary.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5 text-gray-300">
                    <span className="text-emerald-300">(+) Overtime Earnings ({overtimeHours} hrs @ 2x rate):</span>
                    <span className="font-bold text-emerald-400">+₹{monthlyOTPay.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5 text-gray-300">
                    <span>Total Augmented Gross:</span>
                    <span className="font-bold text-white">₹{totalGrossWithOT.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5 text-gray-300">
                    <span className="text-red-300">(-) Total Statutory Deductions:</span>
                    <span className="font-bold text-red-400">-₹{totalDeductions.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )}

              {activeCalcTab === 'agency-invoice' && (
                <div className="space-y-2.5 text-xs animate-in fade-in">
                  <div className="flex justify-between py-1.5 border-b border-white/5 text-gray-300">
                    <span>Total Deployed Workforce CTC ({employeeCount} staff):</span>
                    <span className="font-bold text-white">₹{totalMonthlyBatchCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5 text-gray-300">
                    <span className="text-purple-300">(+) MANABS Management Fee ({agencyFeePercent}%):</span>
                    <span className="font-bold text-purple-400">+₹{agencyManagementFee.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5 text-gray-300">
                    <span>Taxable Subtotal:</span>
                    <span className="font-bold text-white">₹{subtotalBeforeTax.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5 text-gray-300">
                    <span className="text-sky-300">(+) Applicable GST (18% Input Credit Eligible):</span>
                    <span className="font-bold text-sky-400">+₹{gst18Percent.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )}

              {activeCalcTab === 'statutory-bonus' && (
                <div className="space-y-2.5 text-xs animate-in fade-in">
                  <div className="flex justify-between py-1.5 border-b border-white/5 text-gray-300">
                    <span>Annual Gross Earning:</span>
                    <span className="font-bold text-white">₹{annualGross.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5 text-gray-300">
                    <span className="text-emerald-300">Annual Statutory Bonus ({bonusPercent}%):</span>
                    <span className="font-bold text-emerald-400">₹{annualStatutoryBonus.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5 text-gray-300">
                    <span className="text-sky-300">Estimated Gratuity (5 Yrs Service):</span>
                    <span className="font-bold text-sky-400">₹{estimatedGratuity.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5 text-gray-300">
                    <span>Total Annual Batch Bonus ({employeeCount} Staff):</span>
                    <span className="font-bold text-white">₹{(annualStatutoryBonus * employeeCount).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )}

              {/* Total Monthly Batch Box */}
              <div className="p-4 rounded-2xl bg-white/10 border border-white/15 flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">
                    {activeCalcTab === 'agency-invoice' ? 'Total Monthly Invoice Bill' : `Monthly Outflow (${employeeCount} Staff)`}
                  </span>
                  <span className="text-xl font-extrabold text-emerald-400">
                    {activeCalcTab === 'agency-invoice' ? `₹${totalClientMonthlyInvoice.toLocaleString('en-IN')}` : `₹${totalMonthlyBatchCost.toLocaleString('en-IN')}`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-sky-600 text-white rounded-xl text-xs font-bold hover:scale-105 transition-transform cursor-pointer"
                >
                  Get Exact Quote
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* 2. ADVANCED ENTERPRISE PAYROLL CAPABILITIES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {payrollFeatures.map((feat) => {
            const Icon = iconMap[feat.icon] || Calculator;
            return (
              <div
                key={feat.id}
                className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200 shadow-sm hover:border-red-500 hover:shadow-lg transition-all space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                    {feat.badge}
                  </span>
                </div>

                <h4 className="text-base font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                  {feat.title}
                </h4>

                <p className="text-xs text-gray-600 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>

      {/* Payslip Modal Preview */}
      {showSlipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative border border-gray-200 text-gray-900 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowSlipModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 cursor-pointer"
            >
              ✕
            </button>

            <div className="text-center pb-4 border-b border-gray-200 space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-red-600">MANABS Facilities & Workforce</span>
              <h3 className="text-xl font-extrabold text-gray-900">CONFIDENTIAL SALARY PAYSLIP</h3>
              <p className="text-[11px] text-gray-500">Pay Period: Current Month • Delhi NCR / Pan-India</p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 text-xs border-b border-gray-100">
              <div>
                <span className="text-gray-500 block">Designation:</span>
                <strong className="text-gray-900">{selectedRole.roleName}</strong>
              </div>
              <div>
                <span className="text-gray-500 block">Statutory Status:</span>
                <strong className="text-emerald-600 font-bold">100% PF & ESI Compliant</strong>
              </div>
              <div>
                <span className="text-gray-500 block">EPFO UAN No.:</span>
                <span className="text-gray-700 font-mono">1012XXXXXXXX</span>
              </div>
              <div>
                <span className="text-gray-500 block">ESI IP No.:</span>
                <span className="text-gray-700 font-mono">2001XXXXXXXX</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 py-4 text-xs border-b border-gray-200">
              {/* Earnings */}
              <div className="space-y-2">
                <span className="font-bold text-gray-900 uppercase tracking-wider block text-[11px]">Gross Earnings</span>
                <div className="flex justify-between text-gray-600">
                  <span>Basic Salary:</span>
                  <span className="font-semibold text-gray-900">₹{basicSalary.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>HRA:</span>
                  <span className="font-semibold text-gray-900">₹{hra.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Special Allowance:</span>
                  <span className="font-semibold text-gray-900">₹{specialAllowance.toLocaleString('en-IN')}</span>
                </div>
                {overtimeHours > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Overtime ({overtimeHours} hrs 2x):</span>
                    <span>+₹{monthlyOTPay.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-200 font-bold text-gray-900">
                  <span>Total Gross Wage:</span>
                  <span>₹{(grossSalary + (overtimeHours > 0 ? monthlyOTPay : 0)).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Deductions */}
              <div className="space-y-2">
                <span className="font-bold text-gray-900 uppercase tracking-wider block text-[11px]">Statutory Deductions</span>
                <div className="flex justify-between text-gray-600">
                  <span>Employee PF (12%):</span>
                  <span className="font-semibold text-red-600">-₹{employeePF.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Employee ESI (0.75%):</span>
                  <span className="font-semibold text-red-600">-₹{employeeESI.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Professional Tax:</span>
                  <span className="font-semibold text-red-600">-₹{professionalTax}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 font-bold text-red-600">
                  <span>Total Deductions:</span>
                  <span>-₹{totalDeductions.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex justify-between items-center my-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Net Take-Home Disbursed</span>
                <span className="text-2xl font-black text-emerald-700">₹{(inHandSalary + (overtimeHours > 0 ? monthlyOTPay : 0)).toLocaleString('en-IN')}</span>
              </div>
              <div className="text-right text-[11px] text-emerald-800">
                <span>Disbursal via NEFT / RTGS</span>
                <div className="font-bold text-emerald-900">Direct Bank Transfer</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                🖨️ Print Payslip
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSlipModal(false);
                  onNavigate('contact');
                }}
                className="flex-1 py-3 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 uppercase tracking-wider cursor-pointer"
              >
                Outsource Your Payroll
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};

export default PayrollSection;

