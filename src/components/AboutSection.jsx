import React, { useState } from 'react';
import { 
  Eye, 
  Target, 
  Award, 
  CheckCircle2, 
  Cpu, 
  HeartHandshake, 
  Shield, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { companyMilestones, coreValues } from '../data/companyData';

const iconValueMap = {
  Cpu: Cpu,
  HeartHandshake: HeartHandshake,
  Shield: Shield,
  Sparkles: Award,
};

const AboutSection = () => {
  const [activeTab, setActiveTab] = useState('vision');
  const [selectedMilestone, setSelectedMilestone] = useState(companyMilestones[companyMilestones.length - 1]);

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      
      {/* Background styling */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-300">
            <Award className="w-3.5 h-3.5" />
            <span>Architecting The Enterprise Horizon</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-white">
            Built on Resilience, <br />
            <span className="text-gradient-cyan">Powered by Relentless Innovation</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Since 2012, Menabz has evolved from a boutique distributed systems lab to India's premier autonomous cloud and AI enterprise backbone.
          </p>
        </div>

        {/* Vision & Mission Interactive Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 items-stretch">
          
          {/* Left Column: Vision & Mission Tabs */}
          <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-cyan-500/15 to-transparent rounded-bl-full pointer-events-none" />
            
            <div>
              {/* Tab Selector */}
              <div className="flex items-center gap-3 p-1.5 rounded-2xl bg-black/40 border border-white/10 w-fit mb-8">
                <button
                  onClick={() => setActiveTab('vision')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'vision'
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-md shadow-cyan-500/25'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  <span>Our Vision</span>
                </button>
                <button
                  onClick={() => setActiveTab('mission')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'mission'
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-black shadow-md shadow-emerald-500/25'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Target className="w-4 h-4" />
                  <span>Our Mission</span>
                </button>
              </div>

              {/* Tab Content Display */}
              {activeTab === 'vision' ? (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                    Global Perspective 2030
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white leading-snug">
                    To be the world's most trusted autonomous intelligence and computational mesh.
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    We envision an enterprise landscape where infrastructure self-tunes in milliseconds, cyber defenses neutralize threats before propagation, and spatial neural models empower human decisions with zero friction.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
                      <div className="text-cyan-400 font-bold text-lg">100%</div>
                      <div className="text-xs text-slate-400">Autonomous Self-Healing</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
                      <div className="text-cyan-400 font-bold text-lg">Quantum-Safe</div>
                      <div className="text-xs text-slate-400">Cryptographic Standard</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                    Operational Execution
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white leading-snug">
                    Empowering enterprise scale through uncompromising engineering and sovereign data pipelines.
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Our mission is to construct resilient, low-latency, and economically viable cloud-native architectures that provide Indian and global enterprises with decisive strategic superiority.
                  </p>

                  <ul className="space-y-2.5 pt-2 text-xs sm:text-sm text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Zero vendor lock-in with open-standard orchestration</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Strict data sovereignty compliant with Indian DPDP & Global GDPR</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Carbon-efficient green datacenter cooling technologies</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span>Established Delhi NCR • 2012</span>
              <span className="text-cyan-400 font-semibold">14+ Years of Industry Leadership</span>
            </div>
          </div>

          {/* Right Column: Core Values 2x2 Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {coreValues.map((val) => {
              const Icon = iconValueMap[val.icon] || Cpu;
              return (
                <div 
                  key={val.id}
                  className="p-6 rounded-3xl glass-card flex flex-col justify-between group hover:border-cyan-500/40 transition-all"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500/20 group-hover:border-cyan-400 transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-display font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {val.title}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-semibold text-slate-400 group-hover:text-cyan-400">
                    <span>Explore Metric</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Company Evolution / Timeline */}
        <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-white/10 relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 text-xs text-slate-300 mb-2">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>Historical Trajectory</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-black text-white">
                Our Journey Through Time
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md">
              Click any year milestone to review critical expansion phases and strategic technological leaps.
            </p>
          </div>

          {/* Timeline Bar Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
            {companyMilestones.map((m) => {
              const isSelected = selectedMilestone.year === m.year;
              return (
                <button
                  key={m.year}
                  onClick={() => setSelectedMilestone(m)}
                  className={`p-4 rounded-2xl border text-left transition-all relative ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400/60 shadow-lg shadow-cyan-500/20'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/25'
                  }`}
                >
                  <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1">
                    {m.badge}
                  </div>
                  <div className="text-xl sm:text-2xl font-display font-black text-white">
                    {m.year}
                  </div>
                  <div className="text-xs text-slate-300 font-medium truncate mt-1">
                    {m.title}
                  </div>
                  {isSelected && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-cyan-400 rotate-45 rounded-sm" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Milestone Detail Banner */}
          <div className="p-6 rounded-2xl bg-black/40 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-display font-black text-cyan-400">
                  {selectedMilestone.year}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 text-xs font-bold border border-cyan-500/40">
                  {selectedMilestone.badge} Milestone
                </span>
              </div>
              <h4 className="text-lg font-bold text-white">
                {selectedMilestone.title}
              </h4>
              <p className="text-sm text-slate-300 max-w-3xl">
                {selectedMilestone.description}
              </p>
            </div>

            <div className="shrink-0">
              <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-center">
                <Award className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
                <span className="text-[11px] font-bold text-slate-200">Verified Milestone</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutSection;
