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
  FileCheck2
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
  const [selectedRole, setSelectedRole] = useState(samplePayrollRoles[0]);
  const [grossSalary, setGrossSalary] = useState(samplePayrollRoles[0].typicalGross);
  const [employeeCount, setEmployeeCount] = useState(25);
  const [showSlipModal, setShowSlipModal] = useState(false);

  // Dynamic Payroll Computations (Indian Statutory Rules)
  const basicSalary = Math.round((grossSalary * selectedRole.basicPercent) / 100);
  const hra = Math.round((grossSalary * selectedRole.hraPercent) / 100);
  const specialAllowance = Math.max(0, grossSalary - basicSalary - hra);

  // PF Calculation: 12% on Basic (capped at 1800 if basic > 15000 or actual)
  const pfWage = Math.min(basicSalary, 15000);
  const employeePF = Math.round(pfWage * 0.12);
  const employerPF = Math.round(pfWage * 0.12); // (3.67% EPF + 8.33% EPS)

  // ESI Calculation: Applicable if Gross <= 21,000
  const isESIApplicable = grossSalary <= 21000;
  const employeeESI = isESIApplicable ? Math.round(grossSalary * 0.0075) : 0;
  const employerESI = isESIApplicable ? Math.round(grossSalary * 0.0325) : 0;

  // Professional Tax (Approx ₹200 for standard slabs)
  const professionalTax = grossSalary > 15000 ? 200 : 0;

  // Total Deductions & Net Take Home
  const totalDeductions = employeePF + employeeESI + professionalTax;
  const inHandSalary = grossSalary - totalDeductions;

  // Total Employer Cost to Company (CTC)
  const employerStatutoryCost = employerPF + employerESI;
  const totalCTC = grossSalary + employerStatutoryCost;
  const totalMonthlyBatchCost = totalCTC * employeeCount;

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setGrossSalary(role.typicalGross);
  };

  return (
    <section className="py-20 bg-gray-50 border-y border-gray-200" id="payroll-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-red-600" />
            <span>End-to-End Payroll Outsourcing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            Automated <strong>Payroll & Statutory Compliance</strong>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-red-600 to-sky-600 mx-auto rounded-full mt-2" />
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            From single-click bank disbursals to automated PF/ESI challans, biometric sync, and instant digital payslips for 10 to 10,000+ deployed workforce.
          </p>
        </div>

        {/* 1. INTERACTIVE SALARY & STATUTORY CALCULATOR */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-6 sm:p-10 mb-16">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 mb-8 border-b border-gray-100 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                Live Interactive Estimator
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                Workforce CTC & Statutory Salary Calculator
              </h3>
            </div>

            {/* Role Preset Tabs */}
            <div className="flex flex-wrap gap-2">
              {samplePayrollRoles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedRole.id === role.id
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {role.roleName.split('/')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Controls: Sliders */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Monthly Gross Slider */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Monthly Gross Wage per Employee
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
                  <span>₹1,20,000 (Manager)</span>
                </div>
              </div>

              {/* Number of Employees Slider */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Workforce Volume (Headcount)
                  </label>
                  <span className="text-lg font-extrabold text-sky-600">
                    {employeeCount} Personnel
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

              {/* Statutory Coverage Badges */}
              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2 text-xs text-sky-900">
                <div className="flex items-center gap-2 font-bold text-sky-800">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                  <span>Statutory Compliance Summary:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-700">
                  <span>• PF (Employee 12%): <strong>₹{employeePF.toLocaleString('en-IN')}</strong></span>
                  <span>• PF (Employer 12%): <strong>₹{employerPF.toLocaleString('en-IN')}</strong></span>
                  <span>• ESI (0.75% / 3.25%): <strong>{isESIApplicable ? `₹${employeeESI} / ₹${employerESI}` : 'N/A (>₹21K)'}</strong></span>
                  <span>• PT Deductions: <strong>₹{professionalTax}</strong></span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowSlipModal(true)}
                  className="flex-1 py-3 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Preview Payslip Format</span>
                </button>
                <button
                  onClick={() => onNavigate('contact')}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Request Proposal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Right: Real-time Salary Breakdown Card */}
            <div className="lg:col-span-6 bg-gradient-to-br from-[#0a192f] to-[#112240] text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
              
              <div className="flex justify-between items-start border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-400">
                    Monthly Net Take-Home
                  </span>
                  <h4 className="text-3xl sm:text-4xl font-black text-white mt-1">
                    ₹{inHandSalary.toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-gray-300"> / month</span>
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-400">
                    Monthly CTC per Person
                  </span>
                  <div className="text-lg font-bold text-white mt-1">
                    ₹{totalCTC.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown Rows */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-white/5 text-gray-300">
                  <span>Basic Wage ({selectedRole.basicPercent}%)</span>
                  <span className="font-bold text-white">₹{basicSalary.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5 text-gray-300">
                  <span>House Rent Allowance - HRA ({selectedRole.hraPercent}%)</span>
                  <span className="font-bold text-white">₹{hra.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5 text-gray-300">
                  <span>Special & Site Allowances</span>
                  <span className="font-bold text-white">₹{specialAllowance.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5 text-gray-300">
                  <span className="text-red-300">(-) Employee Deductions (PF + ESI + PT)</span>
                  <span className="font-bold text-red-400">-₹{totalDeductions.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5 text-gray-300">
                  <span className="text-sky-300">(+) Employer Statutory Share (PF + ESI)</span>
                  <span className="font-bold text-sky-400">+₹{employerStatutoryCost.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Total Monthly Batch Box */}
              <div className="p-4 rounded-2xl bg-white/10 border border-white/15 flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Monthly Outflow ({employeeCount} Staff)</span>
                  <span className="text-xl font-extrabold text-emerald-400">₹{totalMonthlyBatchCost.toLocaleString('en-IN')}</span>
                </div>
                <button
                  onClick={() => onNavigate('contact')}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-sky-600 text-white rounded-xl text-xs font-bold hover:scale-105 transition-transform"
                >
                  Get Exact Quote
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* 2. SIX CORE PAYROLL FEATURES GRID */}
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
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
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
                <div className="flex justify-between pt-2 border-t border-gray-200 font-bold text-gray-900">
                  <span>Total Gross Wage:</span>
                  <span>₹{grossSalary.toLocaleString('en-IN')}</span>
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
                <span className="text-2xl font-black text-emerald-700">₹{inHandSalary.toLocaleString('en-IN')}</span>
              </div>
              <div className="text-right text-[11px] text-emerald-800">
                <span>Disbursal via NEFT / RTGS</span>
                <div className="font-bold text-emerald-900">Direct Bank Transfer</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSlipModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-800 text-xs font-bold rounded-xl hover:bg-gray-200"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  setShowSlipModal(false);
                  onNavigate('contact');
                }}
                className="flex-1 py-3 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 uppercase tracking-wider"
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
