import React, { useState } from 'react';
import { X, Send, Upload, CheckCircle2, Award, FileText, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

const ApplicationModal = ({ job, isFutureOpening, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    linkedIn: '',
    portfolio: '',
    experienceYears: '',
    preferredLocation: 'Bengaluru / Hybrid',
    targetRole: isFutureOpening ? '' : job?.title || '',
    coverNote: '',
    resumeName: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Valid Email is required';
    if (!formData.phone.trim()) errs.phone = 'Phone Number is required';
    if (isFutureOpening && !formData.targetRole.trim()) errs.targetRole = 'Target Role / Area of Expertise is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, resumeName: e.target.files[0].name });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00F2FE', '#4FACFE', '#10B981', '#F59E0B']
      });
    } catch (err) {
      console.log(err);
    }

    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0B0F19] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/60 my-8">
        
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-cyan-500/40 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="mb-6 space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold border border-cyan-500/20">
                <Award className="w-3.5 h-3.5" />
                <span>{isFutureOpening ? 'Future Talent Pool' : 'Application Portal'}</span>
              </div>
              <h3 className="text-2xl font-display font-bold text-white">
                {isFutureOpening ? 'Join the Future Openings Registry' : `Apply: ${job?.title}`}
              </h3>
              <p className="text-xs text-slate-400">
                {isFutureOpening 
                  ? 'Submit your profile. Our talent team proactively reaches out as upcoming engineering, AI, and leadership requisitions open.'
                  : `${job?.department} • ${job?.location} • ${job?.experience}`}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Name <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
                  />
                  {errors.fullName && <p className="text-[11px] text-red-400 mt-1">{errors.fullName}</p>}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. rahul@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
                  />
                  {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Phone Number <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
                  />
                  {errors.phone && <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>}
                </div>

                {/* Years of Experience */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Total Experience (Years)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5 Years"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
                  />
                </div>

                {/* LinkedIn or GitHub */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    LinkedIn / GitHub Profile
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={formData.linkedIn}
                    onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
                  />
                </div>

                {/* Preferred City / Hub */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Preferred Base Hub
                  </label>
                  <select
                    value={formData.preferredLocation}
                    onChange={(e) => setFormData({ ...formData, preferredLocation: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0F172A] border border-white/10 focus:border-cyan-400 text-xs text-white focus:outline-none"
                  >
                    <option value="Bengaluru / Hybrid">Bengaluru (R&D & SOC)</option>
                    <option value="New Delhi (HQ)">New Delhi (HQ)</option>
                    <option value="Hyderabad">Hyderabad (AI Center)</option>
                    <option value="Mumbai">Mumbai (FinTech Hub)</option>
                    <option value="Pune">Pune (Cloud Center)</option>
                    <option value="Remote / Flexible">Remote / Flexible</option>
                  </select>
                </div>
              </div>

              {/* Target role if future opening */}
              {isFutureOpening && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Desired Role / Specialization Area <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Distributed Consensus Engineer / Quantum Crypto Analyst / Enterprise Sales"
                    value={formData.targetRole}
                    onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-xs text-white placeholder-slate-400 focus:outline-none"
                  />
                  {errors.targetRole && <p className="text-[11px] text-red-400 mt-1">{errors.targetRole}</p>}
                </div>
              )}

              {/* Resume Upload Simulation */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Upload Resume / CV (PDF or DOCX)
                </label>
                <div className="relative border-2 border-dashed border-white/15 hover:border-cyan-400/60 rounded-2xl p-4 text-center cursor-pointer bg-white/[0.02] transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="flex flex-col items-center justify-center gap-1.5 pointer-events-none">
                    <Upload className="w-5 h-5 text-cyan-400" />
                    <span className="text-xs font-medium text-slate-200">
                      {formData.resumeName || 'Click or drag resume file here (Max 15MB)'}
                    </span>
                    <span className="text-[10px] text-slate-400">PDF, DOCX formats supported</span>
                  </div>
                </div>
              </div>

              {/* Cover Note */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Brief Introduction & Key Engineering Highlights
                </label>
                <textarea
                  rows={3}
                  placeholder="Share notable distributed architectures, systems you built, or why you'd like to join Menabz..."
                  value={formData.coverNote}
                  onChange={(e) => setFormData({ ...formData, coverNote: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-xs text-white placeholder-slate-400 focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400 text-black font-extrabold text-xs shadow-lg shadow-cyan-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Application to Menabz Talent Board</span>
                </button>
              </div>

            </form>
          </div>
        ) : (
          /* Confirmation State */
          <div className="text-center py-8 space-y-5 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                Application Received • Ref #MNZ-HR-{Math.floor(1000 + Math.random() * 9000)}
              </span>
              <h3 className="text-2xl font-display font-bold text-white mt-1">
                Thank You, {formData.fullName}!
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
                Your profile has been encrypted and routed directly to our Principal Hiring Committee and Talent Acquisition division.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 max-w-md mx-auto text-left text-xs space-y-1.5 text-slate-300">
              <div><span className="text-slate-400">Position / Pool:</span> <span className="font-semibold text-white">{isFutureOpening ? formData.targetRole : job?.title}</span></div>
              <div><span className="text-slate-400">Preferred Hub:</span> <span className="text-cyan-300">{formData.preferredLocation}</span></div>
              <div><span className="text-slate-400">Confirmation Sent To:</span> <span className="text-emerald-400">{formData.email}</span></div>
            </div>

            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-bold text-xs shadow-md shadow-cyan-500/20"
              >
                Return to Careers Portal
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ApplicationModal;
