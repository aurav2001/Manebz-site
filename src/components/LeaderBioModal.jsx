import React from 'react';
import { X, Users, Award, Shield, Mail, ArrowUpRight, CheckCircle2 } from 'lucide-react';

const LeaderBioModal = ({ leader, onClose }) => {
  if (!leader) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0B0F19] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/50 overflow-hidden">
        
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-cyan-500/40 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
          <div className="relative">
            <img 
              src={leader.image} 
              alt={leader.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-cyan-400 shadow-lg shadow-cyan-500/20" 
            />
            <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 text-[10px] font-bold border border-cyan-500/40">
              L{leader.level} Exec
            </span>
          </div>

          <div className="space-y-1">
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold border border-cyan-500/20 mb-1">
              {leader.department} Leadership
            </div>
            <h3 className="text-2xl font-display font-bold text-white">
              {leader.name}
            </h3>
            <p className="text-sm text-cyan-400 font-medium">
              {leader.role}
            </p>
            <div className="flex items-center gap-3 pt-1 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>{leader.teamCount}+ Direct & Indirect Reports</span>
              </span>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Executive Background & Vision
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed bg-white/[0.02] p-4 rounded-2xl border border-white/5">
              {leader.bio}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20">
              <div className="text-xs text-slate-400">Core Mandate</div>
              <div className="text-xs font-bold text-cyan-300 mt-0.5">High-Scale Architecture & SLA 99.99%</div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20">
              <div className="text-xs text-slate-400">Governance</div>
              <div className="text-xs font-bold text-emerald-300 mt-0.5">Enterprise Security & Compliance</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
          <a
            href={leader.linkedin || 'https://linkedin.com'}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-slate-300 hover:text-white hover:border-cyan-500/40 transition-colors"
          >
            <svg className="w-4 h-4 fill-cyan-400" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.75A1.6 1.6 0 0 0 6.2 8.35a1.6 1.6 0 0 0 1.63 1.6 1.6 1.6 0 0 0 1.6-1.6 1.6 1.6 0 0 0-1.6-1.6Z" />
            </svg>
            <span>Connect on LinkedIn</span>
            <ArrowUpRight className="w-3 h-3 text-slate-500" />
          </a>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-bold text-xs shadow-md shadow-cyan-500/20 hover:scale-105 transition-transform"
          >
            Close Bio
          </button>
        </div>

      </div>
    </div>
  );
};

export default LeaderBioModal;
