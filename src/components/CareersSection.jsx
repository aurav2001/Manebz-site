import React, { useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck,
  PlusCircle,
  FileCheck,
  GraduationCap,
  Award,
  CreditCard,
  IndianRupee,
  Database
} from 'lucide-react';
import { jobOpenings, employeePerks } from '../data/companyData';
import ApplicationModal from './ApplicationModal';

const perkIcons = {
  ShieldCheck: ShieldCheck,
  GraduationCap: GraduationCap,
  CreditCard: CreditCard,
  Award: Award,
};

const CareersSection = ({ onNavigate }) => {
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedJobForModal, setSelectedJobForModal] = useState(null);
  const [isFutureModalOpen, setIsFutureModalOpen] = useState(false);

  const departments = ['All', 'Integrated Facilities', 'HR & Payroll', 'Engineering & Maintenance', 'Logistics & Supply Chain', 'Quality & Compliance'];

  const filteredJobs = selectedDept === 'All' 
    ? jobOpenings 
    : jobOpenings.filter(j => j.department === selectedDept);

  return (
    <section id="careers" className="py-20 bg-white relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
            <Briefcase className="w-3.5 h-3.5" />
            <span>National Resource Cell • Careers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
            Recruit Quality Resources, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-sky-600">
              Nurture and Retain
            </span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Join India's premier facilities and workforce solutions enterprise across Delhi NCR, UP, Haryana, and Uttarakhand with 100% statutory security and continuous growth.
          </p>
        </div>

        {/* Culture & Perks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {employeePerks.map((perk) => {
            const Icon = perkIcons[perk.icon] || ShieldCheck;
            return (
              <div 
                key={perk.id}
                className="p-6 rounded-3xl bg-gray-50 border border-gray-200 hover:border-red-400 hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-xs text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                    {perk.title}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {perk.desc}
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
                  ? 'bg-red-600 text-white shadow-md font-bold'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {dept === 'All' ? 'All Roles (6 Openings)' : dept}
            </button>
          ))}
        </div>

        {/* Active Openings Cards */}
        <div className="space-y-4 mb-16">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-200 hover:border-red-400 hover:shadow-xl transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 group"
            >
              <div className="space-y-3 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">
                    {job.department}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 text-xs font-medium">
                    {job.type}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                    {job.salary}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                  {job.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {job.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-1">
                  <span className="flex items-center gap-1 text-gray-700">
                    <MapPin className="w-3.5 h-3.5 text-red-600" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1 text-gray-700">
                    <Clock className="w-3.5 h-3.5 text-sky-600" />
                    {job.experience}
                  </span>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {job.skills?.map((skill, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md bg-gray-50 text-gray-600 text-[11px] font-medium border border-gray-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Apply Action CTA */}
              <div className="shrink-0 flex items-center">
                <button
                  onClick={() => setSelectedJobForModal(job)}
                  className="w-full lg:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-sky-600 hover:from-red-700 hover:to-sky-700 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Apply for this Role</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Future Openings & Talent Pool Showcase Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0a192f] text-white border border-sky-500/20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          
          <div className="space-y-3 text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-300 text-xs font-bold border border-white/15">
              <Database className="w-3.5 h-3.5 text-red-400" />
              <span>National Resource Cell • Future Talent Bank</span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Don't See Your Exact Role Open Right Now?
            </h3>
            
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Drop your resume in our centralized talent pool. When upcoming facilities, MEP engineering, warehousing, or administrative projects open in your city, our HR team will contact you directly.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-sky-300 font-medium pt-2">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Direct HR Talent Scout Review</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> First Priority for New Corporate Site Deployments</span>
            </div>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => setIsFutureModalOpen(true)}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 to-sky-600 hover:from-red-700 hover:to-sky-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
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
