import React from 'react';
import ClientPortalSection from '../components/ClientPortalSection';
import { Activity, ArrowRight } from 'lucide-react';

const ClientPortalPage = ({ onNavigate }) => {
  return (
    <div className="pt-24 pb-20 space-y-12">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-300 mb-4">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>24/7 Command & Support Center</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-black text-white">
          Client <span className="text-gradient">Portal</span> & Ticket Tracker
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mt-3">
          Track incident resolution benchmarks, inspect live telemetry audits, or raise priority technical requests.
        </p>
      </div>

      {/* Main Client Portal Component */}
      <ClientPortalSection />

      {/* Page Footer CTA */}
      <div className="max-w-5xl mx-auto px-4 text-center">
        <div className="p-8 rounded-3xl glass-panel border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left space-y-1">
            <h3 className="text-xl font-display font-bold text-white">
              Need direct assistance from Headquarters?
            </h3>
            <p className="text-xs text-slate-400">
              Reach our New Delhi NCR Global Headquarters switchboard.
            </p>
          </div>
          <button
            onClick={() => onNavigate('contact')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-bold text-xs flex items-center gap-2 shrink-0 shadow-lg shadow-cyan-500/20"
          >
            <span>Contact Headquarters</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientPortalPage;
