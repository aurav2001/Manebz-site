import React, { useState } from 'react';
import { X, Send, Upload, CheckCircle2, Award, FileText, AlertCircle, Database, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';

const ApplicationModal = ({ job, isFutureOpening, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    experienceYears: '1 - 3 Years',
    preferredLocation: 'Delhi NCR (Delhi, Gurugram, Noida)',
    targetRole: isFutureOpening ? 'Integrated Facilities & Housekeeping' : job?.title || '',
    coverNote: '',
    resumeName: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [generatedRefId, setGeneratedRefId] = useState('');

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!formData.phone.trim()) errs.phone = 'Phone Number is required';
    if (isFutureOpening && !formData.targetRole.trim()) errs.targetRole = 'Target Role / Department is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          resumeName: file.name,
          resumeFileName: file.name,
          resumeDataUrl: reader.result,
          resumeFileType: file.type || 'application/pdf',
          resumeFileSize: `${(file.size / 1024).toFixed(1)} KB`
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const ref = `MNB-HR-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedRefId(ref);

    // Save to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('manabs_career_applications') || '[]');
      existing.push({
        refId: ref,
        date: new Date().toISOString(),
        isFutureOpening,
        ...formData
      });
      localStorage.setItem('manabs_career_applications', JSON.stringify(existing));
    } catch (err) {
      console.error(err);
    }

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#dc2626', '#0284c7', '#10b981', '#f59e0b']
      });
    } catch (err) {
      console.log(err);
    }

    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 text-gray-900">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="mb-6 space-y-1 pb-3 border-b border-gray-100">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold border border-sky-200">
                <Database className="w-3.5 h-3.5 text-red-600" />
                <span>{isFutureOpening ? 'MANABS Future Talent Bank' : 'Direct Job Application'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                {isFutureOpening ? 'Submit Resume for Future Openings' : `Apply: ${job?.title}`}
              </h3>
              <p className="text-xs text-gray-500">
                {isFutureOpening 
                  ? 'Your profile is stored in our Resource Cell database. HR contacts you as soon as matching openings arise.'
                  : `${job?.department} • ${job?.location} • ${job?.experience}`}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-red-500 text-xs text-gray-900"
                  />
                  {errors.fullName && <p className="text-[11px] text-red-600 mt-1">{errors.fullName}</p>}
                </div>

                {/* Mobile / Phone */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Phone / WhatsApp Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-red-500 text-xs text-gray-900"
                  />
                  {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. rahul@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-red-500 text-xs text-gray-900"
                  />
                </div>

                {/* Years of Experience */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Total Experience
                  </label>
                  <select
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-red-500 text-xs text-gray-900 bg-white"
                  >
                    <option value="Fresher / < 1 Year">Fresher / &lt; 1 Year</option>
                    <option value="1 - 3 Years">1 - 3 Years</option>
                    <option value="3 - 6 Years">3 - 6 Years</option>
                    <option value="6 - 10 Years">6 - 10 Years</option>
                    <option value="10+ Years">10+ Years (Senior Lead)</option>
                  </select>
                </div>

                {/* Preferred Location */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Preferred Location Hub
                  </label>
                  <select
                    value={formData.preferredLocation}
                    onChange={(e) => setFormData({ ...formData, preferredLocation: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-red-500 text-xs text-gray-900 bg-white"
                  >
                    <option value="Delhi NCR (Delhi, Gurugram, Noida)">Delhi NCR (Delhi, Gurugram, Noida)</option>
                    <option value="Uttar Pradesh (Lucknow, Kanpur, Agra)">Uttar Pradesh (Lucknow, Kanpur, Agra)</option>
                    <option value="Haryana (Manesar, Panipat, Sonipat)">Haryana (Manesar, Panipat, Sonipat)</option>
                    <option value="Uttarakhand (Dehradun, Haridwar, Pantnagar)">Uttarakhand (Dehradun, Haridwar, Pantnagar)</option>
                    <option value="Pan-India / Flexible">Pan-India / Flexible</option>
                  </select>
                </div>

                {/* Target Role / Domain */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Domain / Role Category
                  </label>
                  {isFutureOpening ? (
                    <select
                      value={formData.targetRole}
                      onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-red-500 text-xs text-gray-900 bg-white"
                    >
                      <option value="Integrated Facilities & Housekeeping">Integrated Facilities & Housekeeping</option>
                      <option value="HR Staffing & Statutory Payroll">HR Staffing & Statutory Payroll</option>
                      <option value="Engineering & Maintenance (MEP/HVAC)">Engineering & Maintenance (MEP/HVAC)</option>
                      <option value="Logistics & Warehouse Operations">Logistics & Warehouse Operations</option>
                      <option value="Quality & Compliance Audits">Quality & Compliance Audits</option>
                      <option value="Corporate Office Admin & Front Desk">Corporate Office Admin & Front Desk</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      disabled
                      value={job?.title || ''}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-100 border border-gray-300 text-xs text-gray-700 font-semibold"
                    />
                  )}
                </div>

              </div>

              {/* Resume Upload Simulator */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Upload Resume / CV (PDF or DOCX)
                </label>
                <div className="border-2 border-dashed border-gray-300 hover:border-red-500 rounded-2xl p-4 text-center cursor-pointer bg-gray-50 transition-colors">
                  <input
                    type="file"
                    id="modal-resume-file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="modal-resume-file" className="cursor-pointer space-y-1 block">
                    <Upload className="w-6 h-6 text-red-600 mx-auto" />
                    <span className="text-xs font-semibold text-gray-800 block">
                      {formData.resumeName || 'Click to Select Resume File (PDF, DOCX up to 10MB)'}
                    </span>
                    {formData.resumeName ? (
                      <span className="text-[10px] text-emerald-600 font-bold block">✓ File Selected: {formData.resumeName}</span>
                    ) : (
                      <span className="text-[10px] text-gray-400 block">PDF, DOCX formats supported</span>
                    )}
                  </label>
                </div>
              </div>

              {/* Cover Note */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Brief Note & Key Skills
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell us about your core technical/operational skills and notice period..."
                  value={formData.coverNote}
                  onChange={(e) => setFormData({ ...formData, coverNote: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-red-500 text-xs text-gray-900"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-red-600 via-sky-600 to-sky-700 hover:from-red-700 hover:to-sky-800 text-white font-extrabold text-xs uppercase tracking-wider shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isFutureOpening ? 'Register Profile in MANABS Future Talent Pool' : 'Submit Job Application'}</span>
                </button>
              </div>

            </form>
          </div>
        ) : (
          /* Confirmation State */
          <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block">
                Profile Indexed • Ref #{generatedRefId}
              </span>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                Thank You, {formData.fullName}!
              </h3>
              <p className="text-xs text-gray-600 max-w-md mx-auto mt-1 leading-relaxed">
                {isFutureOpening 
                  ? 'Your profile is now stored in the MANABS National Resource Cell. Our HR recruitment team will proactively reach out to you via Phone/WhatsApp as new opportunities open.'
                  : `Your application for ${job?.title} has been received and routed to our hiring supervisor.`}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 max-w-md mx-auto text-left text-xs space-y-1.5 text-gray-700">
              <div><span className="text-gray-500">Target Role / Pool:</span> <span className="font-bold text-gray-900">{isFutureOpening ? formData.targetRole : job?.title}</span></div>
              <div><span className="text-gray-500">Preferred Location:</span> <span className="font-semibold text-sky-600">{formData.preferredLocation}</span></div>
              <div><span className="text-gray-500">Contact Number:</span> <span className="font-bold text-emerald-600">{formData.phone}</span></div>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-600 to-sky-600 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
              >
                Close & Return to Careers
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ApplicationModal;
