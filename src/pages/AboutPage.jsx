import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  Users, 
  ArrowRight, 
  ArrowLeft,
  Clock, 
  MapPin, 
  FileCheck2, 
  Check, 
  HeartHandshake,
  GraduationCap,
  Scale
} from 'lucide-react';
import { 
  companyStats, 
  statutoryCompliances, 
  qualityAssurancePoints, 
  coreValues, 
  regionsServed 
} from '../data/companyData';
import { useCompany } from '../context/CompanyContext';
import serviceBg from '../assets/servicebg.avif';

const AboutPage = ({ onNavigate }) => {
  const { 
    companyStats: dynamicStats, 
    statutoryCompliances: dynamicCompliances, 
    qualityAssurancePoints: dynamicQA, 
    regionsServed: dynamicRegions,
    coreValues: dynamicCoreValues
  } = useCompany();
  return (
    <div className="bg-white pb-24">
      
      {/* 1. HERO BANNER WITH LUXURY BREADCRUMB */}
      <section className="relative bg-[#071324] text-white pt-28 pb-14 sm:pt-36 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-md">
        <div className="absolute inset-0 z-0">
          <img 
            src={serviceBg} 
            alt="About MANABS" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071324] via-[#071324]/85 to-[#071324]/60" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10 space-y-4 sm:space-y-6">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Back to Home</span>
            </button>

            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/10 border border-white/20 text-sky-400 text-[11px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Award className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span>About MANABS / MANEBZ</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight uppercase">
            Know Us Better
          </h1>

          <p className="text-xs sm:text-base text-slate-300 max-w-3xl leading-relaxed font-medium">
            Pioneers in Strategic Facilities Management, Corporate Workforce Sourcing & Statutory Compliance since 2014.
          </p>
        </div>
      </section>

      {/* Main Story: Founded 27th Feb 2014 & Geographical Footprint */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-50 text-sky-800 text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-sky-600" />
              <span>Our Genesis & Journey</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight">
              Providing World-Class <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-blue-700 to-red-600">Facilities & Workforce</span> to Corporate India
            </h2>
            <div className="w-16 h-1.5 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full mt-2 mb-4" />

            <div className="space-y-4 text-gray-700 text-sm sm:text-base leading-relaxed">
              <p>
                <strong>MANABS</strong> was originally founded on <strong>27th February 2014</strong> by a team of seasoned professionals from the facilities & engineering industries in <strong>Delhi & NCR</strong>. From the very beginning, the company made a head start in the provision of well-trained & well-equipped personnel to its customers.
              </p>
              <p>
                The company has broadened its scope of services and commenced providing state-of-the-art machines & equipments with <strong>bio-friendly consumables & tools</strong> to a rapidly growing list of corporate clients.
              </p>
              <p>
                With its base of operations in <strong>Delhi, Uttar Pradesh, Haryana & Uttarakhand</strong>, Manabs is well spread geographically to provide an elevated level of service, instant agility, and unmatched local support.
              </p>
              <p className="bg-sky-50/60 p-4 rounded-xl border-l-4 border-sky-500 text-gray-800 text-sm">
                <em>"For the past twenty years when the concept of Outsourcing & facilities did not exist in Indian Corporate Industry, our founders were pioneers in this service domain. MANABS over a period of time has added value services i.e. Manager Level Staff, also providing highly skilled Services for back Offices."</em>
              </p>
            </div>

            {/* Geographical Badges */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-600" />
                <span>Geographical Operational Base</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {(dynamicRegions || regionsServed).map((region, i) => {
                  const label = typeof region === 'string' ? region : (region.state || region.name || '');
                  return (
                    <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg text-xs font-semibold border border-gray-200">
                      {label}
                    </span>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Highlights Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0a192f] text-white p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="border-b border-white/10 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Our Core Promise</span>
                <h3 className="text-xl font-bold text-white mt-1">Global Standard with a Local Flavour</h3>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed">
                We are a part of a progressive company culture with a strong local flavour. Our network throughout India allows us to extend that genuine personal touch.
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                  <HeartHandshake className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-white">Customer Satisfaction</h5>
                    <p className="text-[11px] text-gray-400">Attending to every client's individual corporate requirement with agility.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                  <Users className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-white">Concern for Employees</h5>
                    <p className="text-[11px] text-gray-400">Judicious empowerment, fair compensation, and safe work culture.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-white">Deep Sense of Integrity</h5>
                    <p className="text-[11px] text-gray-400">100% timely statutory adherence and zero compliance shortcuts.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('contact')}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-sky-600 hover:from-red-700 hover:to-sky-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Connect With Our Team</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Statutory Compliances & HR Section (Exact from User prompt) */}
      <section className="bg-gray-50 py-16 border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-red-600">
              Workforce Excellence & Governance
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Statutory Compliances & HR
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-red-600 to-sky-600 mx-auto rounded-full" />
            <p className="text-sm text-gray-600 leading-relaxed">
              "HR success in our company has been the result of a judicious balance between the right kind of empowerment and work discipline. The company's core values are: respect for individuals, integrity and achievement through teamwork, communication, soft skills and stability."
            </p>
          </div>

          {/* In-House National Resource Cell & Training Model */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-sm mb-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">In-House National 'Resource Cell'</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Following the dictum of <strong>‘Recruit Quality Resources, Nurture and Retain’</strong>, the company has dedicated an in-house national ‘Resource Cell’, which takes care of our recruitment requirements through a stringent selection process.
              </p>
              <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-xs text-red-900 font-semibold space-y-1">
                <div className="flex items-center gap-2 text-red-700 font-bold">
                  <Clock className="w-4 h-4" />
                  <span>Mandatory 2-Week Rigorous Training Program</span>
                </div>
                <p className="text-gray-600">
                  Once recruitment is finalized, each individual undergoes rigorous 2-week training, including <strong>6 to 8 days of comprehensive induction</strong> covering SOPs, bio-friendly chemicals, machinery safety, and soft skills.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-[#0a192f] text-white p-6 sm:p-8 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
                <Scale className="w-4 h-4" />
                <span>100% Adherence to Statutory Registrations</span>
              </div>
              <h4 className="text-lg font-bold text-white">
                As an organization, we always ensure all statutory compliances are strictly adhered to:
              </h4>

              <div className="space-y-3 pt-2">
                {(dynamicCompliances || statutoryCompliances).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-white block">{item.title}</span>
                      <span className="text-[11px] text-gray-300">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Quality Assurance & 24/7 Operations Section (Exact from User prompt) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-600">
            Systematic Quality Management
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Quality Assurance (QA) Framework
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-sky-600 to-red-600 mx-auto rounded-full" />
          <p className="text-xs sm:text-sm text-gray-500">
            Achieved through rigorous implementation of Quality Management Systems across every deployed facility.
          </p>
        </div>

        {/* 7 QA Points from User Prompt */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(dynamicQA || qualityAssurancePoints).map((qa, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-sky-500 hover:shadow-lg transition-all space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                  QA Pillar 0{index + 1}
                </span>
                <Check className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="text-base font-bold text-gray-900 group-hover:text-sky-600 transition-colors">
                {qa.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {qa.desc}
              </p>
            </div>
          ))}

          {/* 24/7 Operations Highlight Card */}
          <div className="bg-gradient-to-br from-red-600 to-red-800 text-white p-6 rounded-2xl shadow-md flex flex-col justify-between md:col-span-2 lg:col-span-2 space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-200 mb-2">
                <Clock className="w-4 h-4" />
                <span>Round-the-Clock Reliability</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold">24 Hours a Day, 7 Days a Week</h3>
              <p className="text-xs sm:text-sm text-red-100 mt-2 leading-relaxed">
                "That's how most companies need smooth operating facilities. And that's what MANABS delivers. Led by a team of facility management experts, we manage day-to-day facilities around the clock with zero time lag."
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-red-500/40">
              <span className="text-xs font-semibold text-red-100">Ready to elevate your workplace standards?</span>
              <button
                onClick={() => onNavigate('contact')}
                className="px-5 py-2 rounded-lg bg-white text-red-700 hover:bg-gray-100 font-bold text-xs uppercase tracking-wider transition-colors shrink-0 shadow-sm"
              >
                Request Proposal
              </button>
            </div>
          </div>

        </div>

      </section>

    </div>
  );
};

export default AboutPage;
