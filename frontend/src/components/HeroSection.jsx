import React from 'react';
import { 
  ArrowUpRight, 
  ShieldCheck, 
  Cpu, 
  Server, 
  Globe2, 
  ChevronDown, 
  Zap,
  CheckCircle2,
  Award,
  Users,
  MapPin
} from 'lucide-react';
import ThreeHeroCanvas from './ThreeHeroCanvas';
import { companyStats } from '../data/companyData';

const iconMap = {
  Award: Award,
  Users: Users,
  CheckCircle2: CheckCircle2,
  MapPin: MapPin,
  ShieldCheck: ShieldCheck,
};

const HeroSection = ({ onNavigate, onOpenInquiry }) => {
  return (
    <section id="home" className="relative min-h-screen pt-28 pb-16 flex flex-col justify-between overflow-hidden">
      
      {/* Background radial glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-purple-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-cyan-500/30 backdrop-blur-md shadow-lg shadow-cyan-950/40 animate-float">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
              </span>
              <span className="text-xs font-semibold text-cyan-300 tracking-wide uppercase">
                2026 Enterprise Ready • Autonomous Cloud & AI
              </span>
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight leading-[1.1] text-white">
              Pioneering <br className="hidden sm:inline" />
              <span className="text-gradient">Next-Gen Cloud</span> & <br />
              <span className="text-gradient-cyan">Spatial Intelligence</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Menabz delivers ultra-high-throughput enterprise cloud infrastructure, autonomous AI neural pipelines, and military-grade cyber defense across 18+ high-speed Pan-India hubs.
            </p>

            {/* Quick Feature Badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-1">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs font-medium text-slate-300">
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                <span>Sub-5ms Pan-India Latency</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs font-medium text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero-Trust Architecture</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs font-medium text-slate-300">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>Private LLM Clusters</span>
              </div>
            </div>

            {/* Action CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={() => onNavigate('solutions')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400 text-black font-bold text-sm tracking-wide shadow-xl shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <span>Explore Enterprise Solutions</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('locations')}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white font-semibold text-sm border border-white/15 hover:border-cyan-400/40 backdrop-blur-md transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                <Globe2 className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
                <span>View Pan-India Presence</span>
              </button>
            </div>

            {/* Live Trust Line */}
            <div className="pt-2 text-xs text-slate-400 flex items-center justify-center lg:justify-start gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> ISO 27001 & SOC-2 Certified
              </span>
              <span>•</span>
              <span>Tier-IV Data Center Standards</span>
            </div>

          </div>

          {/* Right Column: 3D Interactive WebGL Canvas */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Ambient Backing Glow */}
            <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

            {/* The 3D Canvas */}
            <div className="w-full relative">
              <ThreeHeroCanvas />

              {/* Floating Glass Badges on the 3D visual */}
              <div className="absolute -top-4 -left-2 sm:left-4 px-4 py-2.5 rounded-2xl glass-panel border border-cyan-500/30 shadow-xl shadow-cyan-950/50 animate-float pointer-events-none hidden sm:flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white">18+ Regional Nodes</div>
                  <div className="text-[10px] text-cyan-300">Fiber Interconnected</div>
                </div>
              </div>

              <div className="absolute -bottom-2 right-2 sm:right-6 px-4 py-2.5 rounded-2xl glass-panel border border-emerald-500/30 shadow-xl shadow-emerald-950/50 animate-float-reverse pointer-events-none hidden sm:flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white">Neural Core AI</div>
                  <div className="text-[10px] text-emerald-400">Real-time Inference</div>
                </div>
              </div>

              <div className="absolute bottom-16 -left-4 px-3.5 py-2 rounded-xl glass-panel border border-purple-500/30 shadow-lg pointer-events-none hidden md:flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                <span className="text-[11px] font-medium text-purple-200">Zero-Trust SOC: Active</span>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Statistics Highlight Grid */}
        <div className="mt-16 pt-10 border-t border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {companyStats.map((stat) => {
              const Icon = iconMap[stat.icon] || Award;
              return (
                <div 
                  key={stat.id}
                  className="p-4 sm:p-5 rounded-2xl glass-card relative overflow-hidden group hover:border-cyan-500/40 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {stat.label}
                    </span>
                    <Icon className="w-4 h-4 text-cyan-400 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {stat.subtext}
                  </div>
                  <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-cyan-500/10 rounded-full blur-xl group-hover:bg-cyan-500/20 transition-all" />
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Down arrow scroll hint */}
      <div className="flex justify-center pt-8">
        <a 
          href="#about" 
          onClick={(e) => {
            e.preventDefault();
            onNavigate('about');
          }}
          className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-all animate-bounce"
          aria-label="Scroll down to About section"
        >
          <ChevronDown className="w-5 h-5" />
        </a>
      </div>

    </section>
  );
};

export default HeroSection;
