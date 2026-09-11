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
  ArrowLeft,
  Award,
  Lock,
  Clock
} from 'lucide-react';
import { statutoryCompliances } from '../data/companyData';
import serviceBg from '../assets/servicebg.avif';

const PayrollPage = ({ onNavigate }) => {
  return (
    <div className="bg-white pb-20">
      
      {/* 1. HERO BANNER WITH LUXURY BREADCRUMB */}
      <section className="relative bg-[#071324] text-white pt-36 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-md">
        <div className="absolute inset-0 z-0">
          <img 
            src={serviceBg} 
            alt="Payroll Solutions" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071324] via-[#071324]/85 to-[#071324]/60" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10 space-y-6">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => onNavigate && onNavigate('home')}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-sky-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Award className="w-3.5 h-3.5 text-red-400" />
              <span>MANABS Payroll & Workforce Solutions</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight uppercase">
            Corporate Payroll & Statutory Management
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed font-medium">
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
