import React from 'react';
import ServicesSection from '../components/ServicesSection';
import { Layers, ArrowRight, ShieldCheck, Award } from 'lucide-react';

const SolutionsPage = ({ onNavigate }) => {
  return (
    <div className="pt-24 pb-20 space-y-12 bg-white">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-xs font-semibold text-sky-800 mb-4">
          <Award className="w-3.5 h-3.5 text-red-600" />
          <span>Strategic Facilities & Workforce Spectrum</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 uppercase">
          Corporate <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-sky-600">Solutions</span>
        </h1>
        <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto mt-3">
          Delivering 24/7 facility operations, trained workforce from our in-house Resource Cell, bio-friendly consumables, and 100% statutory compliance.
        </p>
      </div>

      {/* Main Services Section */}
      <ServicesSection 
        onOpenInquiry={() => onNavigate('contact')} 
        onNavigate={onNavigate}
      />

      {/* Page Footer CTA */}
      <div className="max-w-5xl mx-auto px-4 text-center">
        <div className="p-8 rounded-3xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="text-left space-y-1">
            <h3 className="text-xl font-bold text-gray-900">
              Need Turnkey Facility or Manpower Staffing?
            </h3>
            <p className="text-xs text-gray-500">
              Get an instant customized proposal and statutory compliance dossier for your sites.
            </p>
          </div>
          <button
            onClick={() => onNavigate('contact')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-sky-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 shadow-md hover:shadow-lg transition-all"
          >
            <span>Request Corporate Proposal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SolutionsPage;
