import React from 'react';
import { 
  Users, 
  Truck, 
  Building2, 
  Briefcase, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Shield,
  Award
} from 'lucide-react';
import { servicesData } from '../data/companyData';

const iconServiceMap = {
  Users: Users,
  Truck: Truck,
  Building2: Building2,
  Briefcase: Briefcase,
  ShieldCheck: ShieldCheck,
};

const ServicesSection = ({ onOpenInquiry, onNavigate }) => {
  return (
    <section id="solutions" className="py-20 relative overflow-hidden bg-white">
      
      {/* Background glow elements */}
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-sky-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-xs font-semibold text-sky-800">
            <Award className="w-3.5 h-3.5 text-red-600" />
            <span>5-Pillar Corporate Service Spectrum</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
            Strategic Facilities & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-sky-600">
              Skilled Workforce Operations
            </span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Delivering state-of-the-art machines, bio-friendly consumables, trained personnel, and 100% statutory compliance across Delhi NCR, UP, Haryana, and Uttarakhand.
          </p>
        </div>

        {/* 5 Solutions Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service) => {
            const Icon = iconServiceMap[service.icon] || Building2;
            const isRed = service.accentColor === 'red';
            return (
              <div
                key={service.id}
                className="p-8 rounded-3xl bg-white border border-gray-200 hover:border-red-400 hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden"
              >
                <div>
                  {/* Category Pill & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm ${
                      isRed 
                        ? 'bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white' 
                        : 'bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white'
                    }`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-xs font-semibold text-gray-700">
                      {service.category}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors uppercase tracking-tight">
                    {service.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 mt-3 leading-relaxed">
                    {service.shortDesc}
                  </p>

                  {/* Feature Checklist */}
                  <div className="mt-6 pt-6 border-t border-gray-100 space-y-2.5">
                    {service.features.slice(0, 4).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="line-clamp-1">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <button
                    onClick={() => {
                      if (onNavigate) {
                        onNavigate('services', service.slug);
                      } else if (onOpenInquiry) {
                        onOpenInquiry();
                      }
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-gray-50 hover:bg-gradient-to-r hover:from-red-600 hover:to-sky-600 hover:text-white text-xs font-bold text-gray-800 border border-gray-200 hover:border-transparent transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-xs"
                  >
                    <span>Explore Service Details</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 p-8 sm:p-10 rounded-3xl bg-[#0a192f] text-white border border-sky-500/20 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-2 text-center lg:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Need Turnkey Facility Management or Large-Scale Manpower?
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Request an Operations & Compliance Assessment
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
              Our Senior Operations Directors conduct comprehensive on-site facility audits and statutory compliance due diligence.
            </p>
          </div>

          <button
            onClick={onOpenInquiry}
            className="shrink-0 px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-sky-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Contact Operations Team
          </button>
        </div>

      </div>
    </section>
  );
};

export default ServicesSection;
