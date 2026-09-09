import React, { useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Coins, 
  Globe2, 
  HeartHandshake, 
  Laptop, 
  ShieldCheck,
  PlusCircle,
  FileCheck
} from 'lucide-react';
import { jobOpenings } from '../data/companyData';
import ApplicationModal from './ApplicationModal';

const culturePerks = [
  {
    title: "High-Caliber Engineering",
    description: "Work directly on bare-metal distributed hypervisors, custom neural cores, and multi-cloud mesh.",
    icon: Laptop,
    color: "cyan",
  },
  {
    title: "Pan-India Mobility",
    description: "Seamless transfer and collaboration privileges across 18+ high-speed innovation hubs in India.",
    icon: Globe2,
    color: "emerald",
  },
  {
    title: "Top-Tier Compensation & Equity",
    description: "Competitive salary benchmarks, generous ESOP wealth creation programs, and annual performance bonuses.",
    icon: Coins,
    color: "gold",
  },
  {
    title: "Health, Family & Wellness",
    description: "₹15 Lakh comprehensive family medical insurance, mental health support, and flexible parental leave.",
    icon: HeartHandshake,
    color: "purple",
  },
];

const CareersSection = () => {
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedJobForModal, setSelectedJobForModal] = useState(null);
  const [isFutureModalOpen, setIsFutureModalOpen] = useState(false);

  const departments = ['All', 'Engineering', 'AI Research', 'Security', 'Design & UX', 'Sales & Growth'];

  const filteredJobs = selectedDept === 'All' 
    ? jobOpenings 
    : jobOpenings.filter(j => j.department === selectedDept);

  return (
    <section id="careers" className="py-24 relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-300">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Join Our Engineering Vanguard</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-white">
            Build Tomorrow's Systems <br />
            <span className="text-gradient">With Extraordinary Minds</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            We are looking for engineers, AI researchers, architects, and product leaders who thrive on solving multi-petabyte distributed computing challenges.
          </p>
        </div>

        {/* Culture & Perks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {culturePerks.map((perk, idx) => {
            const Icon = perk.icon;
            return (
              <div 
                key={idx}
                className="p-6 rounded-3xl glass-card border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-display font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {perk.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {perk.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Department Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedDept === dept
                  ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-black shadow-lg shadow-cyan-500/20 font-bold scale-105'
                  : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              {dept === 'All' ? 'All Roles (5 Openings)' : dept}
            </button>
          ))}
        </div>

        {/* Active Openings Cards */}
        <div className="space-y-4 mb-16">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="p-6 sm:p-8 rounded-3xl glass-card border border-white/10 hover:border-cyan-500/40 shadow-xl transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 group"
            >
              <div className="space-y-3 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-bold border border-cyan-500/20">
                    {job.department}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-slate-300 text-xs font-medium border border-white/10">
                    {job.type}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                    {job.salary}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-display font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {job.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {job.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    {job.experience}
                  </span>
                </div>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {job.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-white/[0.03] text-slate-400 text-[11px] font-mono border border-white/5">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Apply Action CTA */}
              <div className="shrink-0 flex items-center">
                <button
                  onClick={() => setSelectedJobForModal(job)}
                  className="w-full lg:w-auto px-7 py-3.5 rounded-2xl bg-cyan-500/15 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-emerald-400 hover:text-black text-cyan-300 font-bold text-xs border border-cyan-500/40 hover:border-transparent transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-md hover:shadow-cyan-500/30"
                >
                  <span>Apply for this Role</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Future Openings & Talent Pool Showcase Banner */}
        <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-cyan-500/30 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-cyan-950/30 via-slate-900/60 to-emerald-950/30">
          
          <div className="space-y-3 text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/40">
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Future Hiring & Talent Registry</span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-display font-black text-white">
              Don't See Your Exact Specialty Open Right Now?
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We are constantly scouting exceptional talent in Distributed Systems, Quantum-Resistant Cryptography, Spatial 3D UI, and Autonomous Networking. Submit your profile to our high-priority talent pipeline.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-emerald-400 font-medium pt-2">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Direct CXO Profile Review</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> First Access to 2026-27 Requisitions</span>
            </div>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => setIsFutureModalOpen(true)}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400 text-black font-extrabold text-sm shadow-xl shadow-cyan-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <FileCheck className="w-4 h-4" />
              <span>Submit Resume for Future Openings</span>
            </button>
          </div>

        </div>

      </div>

      {/* Application Modals */}
      {selectedJobForModal && (
        <ApplicationModal 
          job={selectedJobForModal} 
          isFutureOpening={false}
          onClose={() => setSelectedJobForModal(null)} 
        />
      )}

      {isFutureModalOpen && (
        <ApplicationModal 
          isFutureOpening={true}
          onClose={() => setIsFutureModalOpen(false)} 
        />
      )}

    </section>
  );
};

export default CareersSection;
