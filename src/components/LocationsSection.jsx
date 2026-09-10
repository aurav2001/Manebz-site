import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  Building2, 
  Phone, 
  Mail, 
  Users, 
  ArrowUpRight, 
  CheckCircle2, 
  Navigation,
  Globe2
} from 'lucide-react';
import { indiaLocations } from '../data/companyData';

const LocationsSection = () => {
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCity, setActiveCity] = useState(indiaLocations[0]); // Default to Delhi HQ

  const regions = ['All', 'North', 'South', 'West', 'East', 'Central'];

  const filteredLocations = indiaLocations.filter((loc) => {
    const matchesRegion = selectedRegion === 'All' || loc.region === selectedRegion;
    const matchesSearch = loc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          loc.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          loc.region.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  return (
    <section id="locations" className="py-24 relative overflow-hidden bg-black/30">
      
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-300">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Sovereign Edge Infrastructure</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-white">
            Pan-India Presence <br />
            <span className="text-gradient">18+ Interconnected High-Speed Hubs</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            From our New Delhi NCR Global Headquarters to Tier-1 technology corridors across India, our localized engineering clusters ensure ultra-low latency enterprise delivery.
          </p>
        </div>

        {/* Top Interactive Controls: Search & Region Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          
          {/* Region Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-white/[0.03] border border-white/10 w-full md:w-auto">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedRegion === region
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-md shadow-cyan-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {region === 'All' ? 'All India (12+ Hubs)' : `${region} Region`}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search city, address or state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all"
            />
          </div>

        </div>

        {/* Two-Column Showcase: Interactive Visual Map + Active City Focus Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-center">
          
          {/* Left: Custom Interactive SVG Map of India */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl glass-panel border border-cyan-500/20 relative flex flex-col items-center justify-center min-h-[460px] overflow-hidden">
            
            <div className="absolute top-4 left-4 z-10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-500/40">
                Interactive Mesh Map • Click Any Hub
              </span>
            </div>

            {/* India Map stylized SVG illustration & interactive nodes */}
            <div className="relative w-full max-w-md h-[400px] flex items-center justify-center">
              
              {/* Map Outline & Cyber Grid Silhouette */}
              <svg 
                viewBox="0 0 100 100" 
                className="w-full h-full opacity-60 drop-shadow-[0_0_15px_rgba(0,242,254,0.15)]"
              >
                {/* Stylized Geo Lines for India */}
                <path
                  d="M 35 12 L 45 15 L 52 20 L 58 28 L 70 32 L 85 36 L 80 42 L 72 45 L 75 52 L 68 56 L 55 68 L 48 82 L 42 90 L 38 85 L 32 72 L 25 60 L 20 48 L 22 36 L 28 25 Z"
                  fill="rgba(0, 242, 254, 0.03)"
                  stroke="rgba(0, 242, 254, 0.25)"
                  strokeWidth="0.8"
                  strokeDasharray="2, 1"
                />

                {/* Subsea & Fiber Backbone Lines connecting Metro nodes */}
                <line x1="35" y1="28" x2="25" y2="55" stroke="rgba(0, 242, 254, 0.3)" strokeWidth="0.6" />
                <line x1="35" y1="28" x2="36" y2="78" stroke="rgba(0, 242, 254, 0.3)" strokeWidth="0.6" />
                <line x1="25" y1="55" x2="36" y2="78" stroke="rgba(0, 242, 254, 0.3)" strokeWidth="0.6" />
                <line x1="36" y1="78" x2="42" y2="64" stroke="rgba(0, 242, 254, 0.3)" strokeWidth="0.6" />
                <line x1="36" y1="78" x2="46" y2="80" stroke="rgba(0, 242, 254, 0.3)" strokeWidth="0.6" />
                <line x1="35" y1="28" x2="72" y2="48" stroke="rgba(0, 242, 254, 0.3)" strokeWidth="0.6" />
                <line x1="72" y1="48" x2="46" y2="80" stroke="rgba(0, 242, 254, 0.3)" strokeWidth="0.6" />
              </svg>

              {/* Pulsing Interactive City Nodes */}
              {indiaLocations.map((loc) => {
                const isSelected = activeCity.id === loc.id;
                return (
                  <div
                    key={loc.id}
                    onClick={() => setActiveCity(loc)}
                    style={{ left: `${loc.mapX}%`, top: `${loc.mapY}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                  >
                    {/* Pulsing Ring */}
                    <div className={`relative flex items-center justify-center ${isSelected ? 'scale-125' : 'hover:scale-125'} transition-all`}>
                      <span className={`animate-ping absolute inline-flex h-6 w-6 rounded-full opacity-75 ${
                        loc.isHQ ? 'bg-cyan-400' : 'bg-emerald-400'
                      }`} />
                      
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-lg ${
                        loc.isHQ 
                          ? 'bg-cyan-400 ring-4 ring-cyan-500/30' 
                          : isSelected 
                            ? 'bg-emerald-400 ring-4 ring-emerald-500/40' 
                            : 'bg-emerald-500/80 ring-2 ring-emerald-400/20'
                      }`}>
                        <div className="w-1.5 h-1.5 bg-black rounded-full" />
                      </div>
                    </div>

                    {/* City Tag Label */}
                    <div className={`absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-bold tracking-tight shadow-md transition-all ${
                      isSelected 
                        ? 'bg-cyan-400 text-black scale-105' 
                        : 'bg-black/80 text-slate-300 border border-white/10 group-hover:border-cyan-400 group-hover:text-white'
                    }`}>
                      {loc.city.replace(' (HQ)', '')}
                    </div>
                  </div>
                );
              })}

            </div>

            <div className="w-full mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> New Delhi Global HQ
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Regional Delivery & R&D Hubs
              </span>
            </div>

          </div>

          {/* Right: Selected Active Hub Card */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl glass-panel border border-cyan-500/30 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-bl-full pointer-events-none" />

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-bold border border-cyan-500/30 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {activeCity.region} Region Center
                </span>
                {activeCity.isHQ && (
                  <span className="px-2.5 py-0.5 rounded-md bg-gradient-to-r from-cyan-400 to-emerald-400 text-black text-[10px] font-extrabold uppercase">
                    National HQ
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-3xl font-display font-black text-white">
                  {activeCity.city}
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{activeCity.address}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Hub Capacity</span>
                  <div className="text-sm font-bold text-white mt-0.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{activeCity.teamSize}</span>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Response SLA</span>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">
                    &lt; 15 Mins 24/7
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 space-y-1.5">
                <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wide">
                  Specialized Facilities
                </span>
                <p className="text-xs text-slate-200">
                  {activeCity.facilities}
                </p>
              </div>

              <div className="space-y-2 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                  <a href={`tel:${activeCity.phone}`} className="hover:text-cyan-300">{activeCity.phone}</a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <a href={`mailto:${activeCity.email}`} className="hover:text-cyan-300">{activeCity.email}</a>
                </div>
              </div>

            </div>

            <div className="mt-8 pt-4 border-t border-white/10">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(activeCity.address)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-transform"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Navigate to Office on Google Maps</span>
              </a>
            </div>

          </div>

        </div>

        {/* Pan-India Office Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map((loc) => (
            <div
              key={loc.id}
              onClick={() => setActiveCity(loc)}
              className={`p-6 rounded-3xl glass-card border transition-all cursor-pointer group relative flex flex-col justify-between ${
                activeCity.id === loc.id 
                  ? 'border-cyan-400 bg-cyan-950/20 shadow-xl shadow-cyan-500/10' 
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    {loc.region} Hub
                  </span>
                  {loc.isHQ && (
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-cyan-400 text-black">
                      HQ
                    </span>
                  )}
                </div>

                <h4 className="text-xl font-display font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {loc.city}
                </h4>

                <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                  {loc.address}
                </p>

                <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>Team:</span>
                    <span className="text-white font-medium">{loc.teamSize}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Direct:</span>
                    <span className="text-cyan-300 font-mono text-[11px]">{loc.phone}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-cyan-400">
                <span>Inspect Hub Details</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default LocationsSection;
