import React, { useState } from 'react';
import { 
  Users, 
  ChevronRight, 
  Sparkles, 
  Shield, 
  Cpu, 
  Briefcase, 
  Layers, 
  ArrowDown, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { orgChartData } from '../data/companyData';
import LeaderBioModal from './LeaderBioModal';

const OrgChartSection = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [activeLeaderModal, setActiveLeaderModal] = useState(null);

  const departments = ['All', 'Executive', 'Engineering', 'Operations', 'Security', 'HR'];

  const filteredLeaders = selectedDepartment === 'All' 
    ? orgChartData 
    : orgChartData.filter(l => l.department === selectedDepartment || l.level === 1);

  // Group by levels for the visual tree hierarchy
  const level1 = orgChartData.filter(l => l.level === 1);
  const level2 = orgChartData.filter(l => l.level === 2);
  const level3 = orgChartData.filter(l => l.level === 3);

  return (
    <section id="org-chart" className="py-24 relative overflow-hidden">
      
      {/* Background radial accent */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-300">
            <Users className="w-3.5 h-3.5" />
            <span>Corporate Governance & Leadership Structure</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-white">
            Organisation Hierarchy <br />
            <span className="text-gradient-cyan">Led by Visionary Architects</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Our multi-disciplinary executive matrix bridges deep distributed systems engineering, AI research, cloud infrastructure, and enterprise client governance.
          </p>
        </div>

        {/* Department Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-14">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDepartment(dept)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                selectedDepartment === dept
                  ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30 scale-105'
                  : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              {dept === 'All' ? 'Complete Hierarchy (All)' : `${dept} Wing`}
            </button>
          ))}
        </div>

        {/* Hierarchical Tree Flow Visual */}
        <div className="space-y-12">
          
          {/* LEVEL 1: Executive Co-Founder & CEO */}
          <div className="flex flex-col items-center">
            <div className="text-[11px] font-bold uppercase tracking-widest text-cyan-400 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Apex Executive Leadership</span>
            </div>

            <div className="flex justify-center w-full">
              {level1.map((leader) => (
                <div 
                  key={leader.id}
                  onClick={() => setActiveLeaderModal(leader)}
                  className="w-full max-w-md p-6 rounded-3xl glass-panel border border-cyan-500/40 hover:border-cyan-400 cursor-pointer shadow-xl shadow-cyan-950/40 hover:scale-[1.02] transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-cyan-500/20 to-transparent rounded-bl-full pointer-events-none" />
                  
                  <div className="flex items-center gap-5">
                    <img 
                      src={leader.image} 
                      alt={leader.name}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-400 shadow-md" 
                    />
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                        {leader.department}
                      </span>
                      <h4 className="text-xl font-display font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {leader.name}
                      </h4>
                      <p className="text-xs text-cyan-400 font-medium">
                        {leader.role}
                      </p>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
                        <Users className="w-3 h-3 text-cyan-400" />
                        <span>{leader.teamCount}+ Team Members</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 group-hover:text-white">
                    <span>Click to view executive profile</span>
                    <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>

            {/* Connecting Line from Level 1 to Level 2 */}
            <div className="w-0.5 h-10 bg-gradient-to-b from-cyan-500 to-cyan-500/20 my-2" />
          </div>

          {/* LEVEL 2: C-Suite (CTO, COO, CFO) */}
          <div>
            <div className="text-center text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>C-Suite & Functional Command</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {level2
                .filter(l => selectedDepartment === 'All' || selectedDepartment === l.department)
                .map((leader) => (
                  <div
                    key={leader.id}
                    onClick={() => setActiveLeaderModal(leader)}
                    className="p-5 rounded-2xl glass-card border border-white/10 hover:border-cyan-500/40 cursor-pointer shadow-lg hover:shadow-cyan-500/20 transition-all group"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <img 
                        src={leader.image} 
                        alt={leader.name}
                        className="w-16 h-16 rounded-xl object-cover border border-white/20 group-hover:border-cyan-400 transition-colors" 
                      />
                      <div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                          {leader.department}
                        </span>
                        <h4 className="text-base font-display font-bold text-white group-hover:text-cyan-300 transition-colors mt-1">
                          {leader.name}
                        </h4>
                        <p className="text-xs text-cyan-400">
                          {leader.role}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {leader.bio}
                    </p>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-cyan-300">
                      <span>{leader.teamCount}+ Staff</span>
                      <span className="flex items-center gap-1 font-medium">View Bio <ChevronRight className="w-3 h-3" /></span>
                    </div>
                  </div>
                ))}
            </div>

            {/* Connecting indicator */}
            <div className="flex justify-center my-6">
              <div className="w-0.5 h-8 bg-gradient-to-b from-cyan-500/40 to-transparent" />
            </div>
          </div>

          {/* LEVEL 3: Vice Presidents & Practice Heads */}
          <div>
            <div className="text-center text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>Practice Leadership & Regional VPs</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {level3
                .filter(l => selectedDepartment === 'All' || selectedDepartment === l.department)
                .map((leader) => (
                  <div
                    key={leader.id}
                    onClick={() => setActiveLeaderModal(leader)}
                    className="p-4 rounded-2xl glass-card border border-white/5 hover:border-cyan-500/30 cursor-pointer transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <img 
                          src={leader.image} 
                          alt={leader.name}
                          className="w-12 h-12 rounded-xl object-cover border border-white/10 group-hover:border-cyan-400" 
                        />
                        <div>
                          <h5 className="text-sm font-display font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {leader.name}
                          </h5>
                          <span className="text-[10px] text-slate-400 block truncate">
                            {leader.role}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {leader.bio}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="text-cyan-400 font-semibold">{leader.department} Wing</span>
                      <span className="group-hover:text-white flex items-center gap-0.5">Details <ChevronRight className="w-3 h-3" /></span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

        </div>

      </div>

      {/* Leadership Bio Modal */}
      {activeLeaderModal && (
        <LeaderBioModal 
          leader={activeLeaderModal} 
          onClose={() => setActiveLeaderModal(null)} 
        />
      )}

    </section>
  );
};

export default OrgChartSection;
