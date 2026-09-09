import React from 'react';
import PayrollSection from '../components/PayrollSection';
import { 
  Calculator, 
  FileCheck2, 
  ShieldCheck, 
  CreditCard, 
  Users, 
  Receipt, 
  Building2, 
  CheckCircle2, 
  ArrowRight,
  Lock,
  Clock
} from 'lucide-react';
import { statutoryCompliances } from '../data/companyData';

const PayrollPage = ({ onNavigate }) => {
  return (
    <div className="bg-white pt-28 pb-20">
      
      {/* Top Banner */}
      <section className="bg-gradient-to-r from-[#b91c1c] via-[#dc2626] to-[#b91c1c] text-white py-14 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-5xl mx-auto text-center space-y-3">
          <span className="text-[11px] font-extrabold uppercase tracking-widest bg-white/15 px-3 py-1 rounded-full text-white inline-block">
            MANABS Payroll & Workforce Solutions
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wide uppercase">
            Corporate Payroll & Statutory Management
          </h1>
          <p className="text-sm sm:text-base text-red-100 max-w-2xl mx-auto leading-relaxed">
            100% compliant salary processing, EPFO ECR, ESIC returns, biometric attendance sync, and instant digital payslips.
          </p>
        </div>
      </section>

      {/* Main Interactive Payroll Engine */}
      <div className="py-8">
        <PayrollSection onNavigate={onNavigate} />
      </div>

      {/* Detailed Statutory Compliance Framework */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#0a192f] text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
              Zero-Risk Regulatory Governance
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold">
              Complete Statutory Filings Handled by MANABS
            </h3>
            <p className="text-xs text-gray-300">
              Never worry about audit notices, late return penalties, or compliance discrepancies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statutoryCompliances.map((item, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                  <span>{item.title}</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">{item.desc}</p>
                <span className="text-[10px] text-emerald-400 font-semibold block pt-1">
                  ✓ {item.code}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-left">
              <h4 className="text-base font-bold text-white">Need Customized Payroll Outsourcing for Your Company?</h4>
              <p className="text-xs text-gray-400">We manage complete manpower staffing and statutory payroll for companies across India.</p>
            </div>
            <button
              onClick={() => onNavigate('contact')}
              className="px-8 py-3.5 bg-gradient-to-r from-red-600 to-sky-600 hover:from-red-700 hover:to-sky-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0"
            >
              Request Custom Payroll Quote
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};

export default PayrollPage;
