import React from 'react';
import {
  Calculator,
  FileText,
  CreditCard,
  Receipt,
  Fingerprint,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  FileCheck2,
  Check
} from 'lucide-react';
import { payrollFeatures } from '../data/companyData';

const iconMap = {
  Calculator: Calculator,
  FileText: FileText,
  CreditCard: CreditCard,
  Receipt: Receipt,
  Fingerprint: Fingerprint,
  ShieldCheck: ShieldCheck,
};

// Replaces the old salary estimator. Clients who outsource payroll care about what runs
// every month and by when, not about recomputing a CTC they already know.
const payrollCycle = [
  {
    id: 'attendance',
    window: 'Day 1 – 3',
    title: 'Attendance Reconciliation',
    desc: 'Biometric and muster logs verified against deployed headcount at every site.',
    icon: Fingerprint,
  },
  {
    id: 'invoice',
    window: 'Day 4 – 6',
    title: 'Invoice Generation',
    desc: 'Verified attendance converted into the monthly B2B invoice and raised to the client.',
    icon: Receipt,
  },
  {
    id: 'neft',
    window: 'Day 7 – 10',
    title: 'Bank Batch NEFT',
    desc: 'Single-batch salary transfer to all employee accounts, payslips issued same day.',
    icon: CreditCard,
  },
  {
    id: 'statutory',
    window: 'Day 11 – 20',
    title: 'EPFO / ESIC + GST Filing',
    desc: 'PF and ESI challans paid before the 15th, GST returns filed with the invoice cycle.',
    icon: ShieldCheck,
  },
  {
    id: 'confirmation',
    window: 'Day 20+',
    title: 'Final Confirmation',
    desc: 'Compliance docket with every challan and filing proof shared back to the client.',
    icon: FileCheck2,
  },
];

const complianceCoverage = [
  'EPF Contribution',
  'ESIC Coverage',
  'Professional Tax',
  'Statutory Bonus',
  'Gratuity',
  'Minimum Wages Act',
  'Group Medical Insurance',
  'Form 16 / TDS',
];

const PayrollSection = ({ onNavigate }) => {

  return (
    <section className="py-20 bg-gray-50 border-y border-gray-200" id="payroll-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
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

        {/* 1. MONTHLY PAYROLL & COMPLIANCE CYCLE */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-6 sm:p-10 mb-16">

          {/* Card Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-10 border-b border-gray-100 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                Managed Payroll Operations
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">
                Your Monthly Payroll & Compliance Cycle
              </h3>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shrink-0">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Zero Statutory Liability for Your Enterprise</span>
            </div>
          </div>

          {/* 5-Stage Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-7 sm:gap-6">
            {payrollCycle.map((stage, idx) => {
              const Icon = stage.icon;
              return (
                <div key={stage.id} className="relative">
                  {/* Connector line between stages (large screens only) */}
                  {idx < payrollCycle.length - 1 && (
                    <div className="hidden lg:block absolute top-6 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-sky-300 to-slate-200" />
                  )}

                  <div className="relative flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 text-white flex items-center justify-center shadow-md shrink-0 relative z-10">
                      <Icon className="w-5 h-5" />
                    </div>

                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {stage.window}
                    </span>

                    <h4 className="text-sm font-bold text-gray-900 leading-snug">
                      {stage.title}
                    </h4>

                    <p className="text-xs text-gray-600 leading-relaxed">
                      {stage.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Statutory Coverage Chips */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <p className="text-center text-xs font-bold uppercase tracking-wider text-slate-500 mb-5">
              Every Deployed Person Is Covered Under
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {complianceCoverage.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3.5 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 uppercase tracking-wider cursor-pointer inline-flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <span>Outsource Your Payroll</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3.5 bg-white border border-gray-300 text-gray-800 text-xs font-bold rounded-xl hover:border-sky-500 hover:text-sky-700 uppercase tracking-wider cursor-pointer inline-flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <span>Request a Compliance Audit</span>
            </button>
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

    </section>
  );
};

export default PayrollSection;

