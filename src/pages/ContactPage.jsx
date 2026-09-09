import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, Clock, ShieldCheck, Building2, Award } from 'lucide-react';
import { statutoryCompliances, regionsServed } from '../data/companyData';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    location: 'Delhi & NCR',
    service: 'HR STAFFING & PAYROLL MANAGEMENT',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitted(true);
  };

  return (
    <div className="bg-white pt-28 pb-20">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#b91c1c] via-[#dc2626] to-[#b91c1c] text-white py-14 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-5xl mx-auto text-center space-y-3">
          <span className="text-[11px] font-extrabold uppercase tracking-widest bg-white/15 px-3 py-1 rounded-full text-white inline-block">
            Connect With MANABS
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wide uppercase">
            Corporate Enquiry & Quote Request
          </h1>
          <p className="text-sm sm:text-base text-red-100 max-w-2xl mx-auto leading-relaxed">
            Reach out to our facility management and workforce consulting specialists across Delhi NCR, UP, Haryana, Uttarakhand, and Pan-India.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left: Office & Operational Base Info */}
          <div className="lg:col-span-5 bg-gray-50 p-8 rounded-3xl border border-gray-200 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-extrabold text-red-600 uppercase tracking-wider mb-1">
                <Award className="w-4 h-4" />
                <span>Established 27th Feb 2014</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Base of Operations</h3>
              <p className="text-xs text-gray-500 mt-1">Delhi NCR • Uttar Pradesh • Haryana • Uttarakhand</p>
            </div>

            <div className="space-y-4 text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-gray-900 font-bold">Central Resource Cell & HQ:</strong>
                  <span>Delhi & NCR Hub, New Delhi / Gurugram / Noida, India</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-red-600 shrink-0" />
                <span>+91 11 4982 3000 / +91 98765 43210</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-red-600 shrink-0" />
                <span>contact@manabs.com / operations@manebz.com</span>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-red-600 shrink-0" />
                <span>24/7/365 Round-the-Clock Facilities Management</span>
              </div>
            </div>

            {/* Statutory Compliance Badge */}
            <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Statutory Registrations Verified:</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600">
                <span className="p-1.5 bg-gray-50 rounded-lg border border-gray-100">✓ P.F. Registration</span>
                <span className="p-1.5 bg-gray-50 rounded-lg border border-gray-100">✓ E.S.I. Registration</span>
                <span className="p-1.5 bg-gray-50 rounded-lg border border-gray-100">✓ PAN Compliant</span>
                <span className="p-1.5 bg-gray-50 rounded-lg border border-gray-100">✓ Service Tax / GST</span>
              </div>
            </div>

            {/* Regional Hubs List */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Regional Operational Clusters</h4>
              <div className="space-y-1.5">
                {regionsServed.map((reg, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-gray-200/60">
                    <span className="font-semibold text-gray-800">{reg.state}</span>
                    <span className="text-[10px] text-gray-500">{reg.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Corporate Proposal Request Form */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-sky-600">Instant Proposal</span>
                  <h3 className="text-2xl font-bold text-gray-900">Submit Corporate Enquiry</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-red-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-red-500 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Work Email</label>
                    <input
                      type="email"
                      placeholder="rajesh@enterprise.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-red-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Company / Organization</label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Corporation"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-red-500 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Operating Region</label>
                    <select
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-red-500 text-xs bg-white"
                    >
                      <option value="Delhi & NCR">Delhi & NCR</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Uttarakhand">Uttarakhand</option>
                      <option value="Pan-India">Pan-India Network</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Required Service Vertical</label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-red-500 text-xs bg-white"
                    >
                      <option value="HR STAFFING & PAYROLL MANAGEMENT">HR STAFFING & PAYROLL MANAGEMENT</option>
                      <option value="LOGISTICS & WAREHOUSE MANAGEMENT">LOGISTICS & WAREHOUSE MANAGEMENT</option>
                      <option value="INTEGRATED FACILITIES MANAGEMENT">INTEGRATED FACILITIES MANAGEMENT</option>
                      <option value="REAL ESTATE ADVISORY LEASING & RELOCATION SERVICES">REAL ESTATE ADVISORY LEASING & RELOCATION SERVICES</option>
                      <option value="COMPLIANCE MANAGEMENT">COMPLIANCE MANAGEMENT & AUDITS</option>
                      <option value="OTHER QUERY">OTHER QUERY</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Requirements / Facility Details</label>
                  <textarea
                    rows={4}
                    placeholder="Provide details about manpower requirements, facility area (sq ft), machines, bio-consumables, or relocation timeline..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-red-500 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-red-600 to-sky-600 hover:from-red-700 hover:to-sky-700 text-white font-extrabold uppercase tracking-wider rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-md active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Corporate Request</span>
                </button>
              </form>
            ) : (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
                <h3 className="text-2xl font-bold text-gray-900">Thank You, {formData.name}!</h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  Your enquiry for <strong>{formData.service}</strong> in <strong>{formData.location}</strong> has been logged. Our operations executive will call you at <strong>{formData.phone}</strong> shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 bg-gray-100 text-gray-800 rounded-xl text-xs font-bold hover:bg-gray-200"
                >
                  Submit Another Enquiry
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};

export default ContactPage;
