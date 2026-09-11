import React, { useState } from 'react';
import { 
  ChevronDown, 
  HelpCircle, 
  ShieldCheck, 
  Clock, 
  Building2, 
  Users, 
  Phone, 
  ArrowRight,
  CheckCircle2,
  FileCheck2
} from 'lucide-react';

const homeFAQs = [
  {
    id: 'faq-1',
    category: 'compliance',
    question: 'How does MANABS guarantee 100% PF, ESI, and Statutory Compliance?',
    answer: 'We operate a dedicated Statutory Compliance Cell. Every deployed employee is covered under EPFO and ESIC from Day 1. By the 15th of every month, we provide client partners with consolidated compliance dockets containing certified bank-verified ECR payment challans, Form 5/10 returns, and digital wage sheets—guaranteeing zero statutory liability for the principal employer.'
  },
  {
    id: 'faq-2',
    category: 'facility',
    question: 'What types of machinery and cleaning chemicals are deployed for Facility Management?',
    answer: 'We exclusively deploy industrial-grade ride-on scrubbers, high-pressure jet cleaners, single-disc buffing machines, and HEPA-filter vacuum extractors. All our cleaning consumables and concentrates are 100% Bio-Friendly, non-toxic, and Green Seal certified, ensuring safe indoor air quality and environmental sustainability.'
  },
  {
    id: 'faq-3',
    category: 'staffing',
    question: 'What is the mobilization and deployment timeline for large workforce batches?',
    answer: 'Thanks to our centralized Regional Resource Cell and active Talent Bank across Delhi NCR, UP, Haryana, and Uttarakhand, we can mobilize and deploy trained frontline workforce (10 to 500+ personnel) within 24 to 48 hours with complete background verification, police clearance, and 6-8 days mandatory induction training.'
  },
  {
    id: 'faq-4',
    category: 'operations',
    question: 'How do you conduct quality control, surprise field audits, and SLA tracking?',
    answer: 'We maintain strict standard operating procedures (SOPs), physical and digital Suggestion Registers at each client location, and hourly restroom/floor checklists. Furthermore, our senior leadership team conducts unannounced monthly surprise audits to inspect grooming, equipment maintenance, and adherence to ISO 9001 quality benchmarks.'
  },
  {
    id: 'faq-5',
    category: 'payroll',
    question: 'Can MANABS handle automated biometric attendance and direct salary disbursals?',
    answer: 'Yes. We provide integrated biometric machines and GPS-based geo-fencing attendance tracking. Our automated payroll engine computes exact basic pay, HRA, 2x overtime rates, and statutory deductions, enabling single-click direct bank NEFT/IMPS transfers and automated WhatsApp/SMS digital payslip delivery.'
  },
  {
    id: 'faq-6',
    category: 'facility',
    question: 'Do you offer 24/7 emergency MEP (Mechanical, Electrical, Plumbing) support?',
    answer: 'Absolutely. We provide round-the-clock technical building maintenance. Our certified HVAC engineers, DG set operators, and MEP specialists are stationed on-site or available via 24/7 rapid response dispatch to handle sudden power, chiller, or plumbing contingencies with minimal turnaround time.'
  }
];

const FAQSection = ({ onNavigate }) => {
  const [openId, setOpenId] = useState('faq-1');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'compliance', label: 'Statutory & Compliance' },
    { id: 'facility', label: 'Facility Management & MEP' },
    { id: 'staffing', label: 'Workforce & Staffing' },
    { id: 'payroll', label: 'Payroll & Technology' },
  ];

  const filteredFAQs = activeCategory === 'all'
    ? homeFAQs
    : homeFAQs.filter(f => f.category === activeCategory);

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-20 bg-slate-50 border-t border-gray-200" id="faq-section">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-red-600" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Got Questions? <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-600 to-sky-600">We've Got Answers.</span>
          </h2>
          <div className="w-16 h-1.5 bg-gradient-to-r from-red-500 to-sky-500 mx-auto rounded-full mt-2" />
          <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed pt-1">
            Everything you need to know about our 100% compliant facility upkeep, resource cell mobilization, and enterprise service contracts.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs ${
                  isOpen 
                    ? 'border-red-500/40 ring-2 ring-red-500/10 shadow-md' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-start gap-3.5">
                    <span className="w-7 h-7 rounded-lg bg-red-50 text-red-600 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-red-100">
                      0{index + 1}
                    </span>
                    <h3 className={`text-sm sm:text-base font-bold transition-colors ${
                      isOpen ? 'text-red-600' : 'text-slate-900 hover:text-red-600'
                    }`}>
                      {faq.question}
                    </h3>
                  </div>

                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-200">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-slate-700">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Help & Contact CTA Banner */}
        <div className="bg-gradient-to-br from-[#0a192f] via-[#112240] to-[#0a192f] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-sky-500/20">
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-400">
              Still Have Specific Queries?
            </span>
            <h4 className="text-lg sm:text-xl font-bold text-white">
              Speak directly with our Operations & Compliance Director
            </h4>
            <p className="text-xs text-slate-300">
              Get customized contract terms, SLAs, and site survey dockets within 2 business hours.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="tel:+919810000000"
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors flex items-center justify-center cursor-pointer"
              title="Call Us Directly"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FAQSection;
