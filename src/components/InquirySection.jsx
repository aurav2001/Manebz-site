import React, { useState } from 'react';
import { 
  PhoneCall, 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  Clock, 
  ShieldCheck,
  Navigation,
  Globe2
} from 'lucide-react';
import confetti from 'canvas-confetti';

const InquirySection = () => {
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    company: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [refCode, setRefCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inquiryForm.name || !inquiryForm.email || !inquiryForm.message) return;

    const ref = `MNZ-INQ-${Math.floor(10000 + Math.random() * 90000)}`;
    setRefCode(ref);

    try {
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00F2FE', '#3B82F6', '#10B981']
      });
    } catch (err) {
      console.log(err);
    }

    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      
      {/* Glow */}
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-300">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Connect with National & Global Teams</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-white">
            Initiate a High-Impact Dialogue <br />
            <span className="text-gradient">With Menabz Architects</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Whether you are modernizing core banking mainframes, migrating multi-petabyte datasets, or seeking sovereign AI advisory, our senior engineering partners are ready.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: HQ Details & Interactive Google Maps Preview */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl glass-panel border border-cyan-500/30 shadow-2xl flex flex-col justify-between space-y-6">
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-bold border border-cyan-500/30">
                  Global Headquarters
                </span>
                <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  24/7 Operations Open
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-display font-bold text-white">
                  Menabz Cyber Tower
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Cyber City, Phase-2, DLF CyberHub Sector, Gurugram / New Delhi NCR 122002, India</span>
                </p>
              </div>

              {/* Direct Contacts */}
              <div className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <PhoneCall className="w-4 h-4 text-cyan-400" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Direct Phone line</span>
                    <a href="tel:+911149823000" className="hover:text-cyan-300 font-medium">+91 11 4982 3000 / +91 80 4455 8800</a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Official Enterprise Inquiries</span>
                    <a href="mailto:inquiry@menabz.com" className="hover:text-cyan-300 font-medium">inquiry@menabz.com / enterprise@menabz.com</a>
                  </div>
                </div>
              </div>

              {/* Google Map Embed Preview */}
              <div className="rounded-2xl overflow-hidden border border-white/10 relative h-48 sm:h-56 bg-black/50">
                <iframe
                  title="Menabz HQ Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14032.531238622839!2d77.08638063955077!3d28.490574000000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d19383675037d%3A0xb6966f9166f2c398!2sDLF%20Cyber%20City%2C%20DLF%20Phase%202%2C%20Sector%2024%2C%20Gurugram%2C%20Haryana%20122002!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(1.2)' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <a
                  href="https://maps.google.com/?q=DLF+Cyber+City+Gurugram"
                  target="_blank"
                  rel="noreferrer"
                  className="absolute bottom-2 right-2 px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md text-cyan-300 text-[10px] font-bold border border-cyan-500/30 flex items-center gap-1 hover:bg-black"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Open Maps</span>
                </a>
              </div>

            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span>National HQ & AI Command Center</span>
              <span className="text-cyan-300 font-semibold">Tier-IV Secure Facility</span>
            </div>

          </div>

          {/* Right Column: General Inquiry Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl glass-panel border border-cyan-500/30 shadow-2xl flex flex-col justify-between">
            
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-2xl font-display font-bold text-white">
                    General Inquiry & Architecture Request
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Fill out the form below. An enterprise partner will acknowledge within 4 business hours.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Your Full Name <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Sharma"
                      value={inquiryForm.name}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-xs text-white placeholder-slate-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Business Email Address <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. vikram@enterprise.com"
                      value={inquiryForm.email}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-xs text-white placeholder-slate-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Phone Number <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={inquiryForm.phone}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-xs text-white placeholder-slate-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Organization / Company
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Reliance / HDFC / Global Corp"
                      value={inquiryForm.company}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, company: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-xs text-white placeholder-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Subject / Discussion Area <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Multi-Cloud Mesh Migration / Private AI Cluster / Cybersecurity Audit"
                    value={inquiryForm.subject}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-xs text-white placeholder-slate-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Detailed Message & Specific Requirements <span className="text-cyan-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Please outline your technical stack, project timeline, SLA goals, or specific architectural hurdles..."
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-xs text-white placeholder-slate-400 focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400 text-black font-extrabold text-xs shadow-lg shadow-cyan-500/25 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Enterprise Inquiry</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Thank you modal state */
              <div className="text-center py-12 space-y-6 animate-in zoom-in-95 duration-300 my-auto">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-2xl shadow-emerald-500/40">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono">
                    Reference Code: #{refCode}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-display font-black text-white mt-1">
                    Thank You, {inquiryForm.name}!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
                    Your inquiry has been successfully recorded in our central enterprise CRM. A designated Senior Enterprise Architect will review your requirements and reach out via email or direct call shortly.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 max-w-sm mx-auto text-left text-xs space-y-1.5 text-slate-300">
                  <div><span className="text-slate-400">Subject:</span> <span className="text-white font-medium">{inquiryForm.subject}</span></div>
                  <div><span className="text-slate-400">Confirmation Sent:</span> <span className="text-emerald-400">{inquiryForm.email}</span></div>
                  <div><span className="text-slate-400">SLA Acknowledgment:</span> <span className="text-cyan-300">&lt; 4 Hours Business Hours</span></div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setInquiryForm({
                        name: '',
                        email: '',
                        phone: '',
                        subject: '',
                        company: '',
                        message: '',
                      });
                    }}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-bold text-xs shadow-md shadow-cyan-500/20"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};

export default InquirySection;
