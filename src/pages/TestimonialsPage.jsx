import React from 'react';
import TestimonialsSection from '../components/TestimonialsSection';
import { Award, ArrowRight } from 'lucide-react';

const TestimonialsPage = ({ onNavigate }) => {
  return (
    <div className="pt-24 pb-20 space-y-12">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-300 mb-4">
          <Award className="w-3.5 h-3.5" />
          <span>Client Reviews & Verified Case Studies</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-black text-white">
          Client <span className="text-gradient">Testimonials</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mt-3">
          See what CXOs and technology leaders across India and global enterprises say about Menabz infrastructure and AI solutions.
        </p>
      </div>

      {/* Main Testimonials Component */}
      <TestimonialsSection />

      {/* Page Footer CTA */}
      <div className="max-w-5xl mx-auto px-4 text-center">
        <div className="p-8 rounded-3xl glass-panel border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left space-y-1">
            <h3 className="text-xl font-display font-bold text-white">
              Ready to start your digital transformation?
            </h3>
            <p className="text-xs text-slate-400">
              Consult with our enterprise architects today.
            </p>
          </div>
          <button
            onClick={() => onNavigate('contact')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-bold text-xs flex items-center gap-2 shrink-0 shadow-lg shadow-cyan-500/20"
          >
            <span>Inquire Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsPage;
