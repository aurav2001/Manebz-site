import React, { useState } from 'react';
import {
  Building2, Users, MapPin, IndianRupee, Calendar, Send, CheckCircle2,
  AlertCircle, Loader2, Briefcase, Zap
} from 'lucide-react';
import api from '../api/client';

const URGENCIES = [
  { value: 'Standard', label: 'Standard', hint: 'Within 2–4 weeks' },
  { value: 'Urgent', label: 'Urgent', hint: 'Within a week' },
  { value: 'Immediate', label: 'Immediate', hint: 'Right away' },
];

const BLANK = {
  companyName: '', contactPerson: '', phone: '', email: '',
  roleTitle: '', headcount: 1, location: '', experience: '',
  salaryRange: '', startDate: '', urgency: 'Standard', notes: '',
};

const Field = ({ label, icon: Icon, required, children, hint }) => (
  <div>
    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
      {Icon && <Icon className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5 text-sky-600" />}
      {label}{required ? ' *' : ''}
    </label>
    {children}
    {hint && <p className="mt-1 text-[11px] text-slate-400">{hint}</p>}
  </div>
);

const inputClass = 'w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:border-sky-500 transition-colors';

/**
 * Lets a client company post a staffing requirement straight from the website.
 *
 * It lands in the same queue Admin and HR work from, so there is no re-typing after a
 * phone call, and recruiters can be assigned to it immediately.
 */
const HiringRequestForm = ({ onNavigate }) => {
  const [form, setForm] = useState(BLANK);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError('');
    try {
      await api.hiringRequests.create({ ...form, headcount: Number(form.headcount) || 1 });
      setSent(true);
    } catch (err) {
      setError(err.message || 'Could not send your requirement. Please try again or call us.');
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8" id="hiring-request">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-emerald-200 shadow-lg p-8 sm:p-12 text-center">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">Requirement received</h3>
          <p className="text-sm text-slate-600 mt-2.5 leading-relaxed max-w-md mx-auto">
            Our resourcing team has your request for{' '}
            <strong className="text-slate-900">{form.headcount} × {form.roleTitle}</strong>{' '}
            and will call you on <strong className="text-slate-900">{form.phone}</strong> shortly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-7">
            <button
              onClick={() => { setForm(BLANK); setSent(false); }}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Post another requirement
            </button>
            {onNavigate && (
              <button
                onClick={() => onNavigate('home')}
                className="px-6 py-3 rounded-xl bg-white border border-slate-300 hover:border-sky-400 text-slate-700 text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Back to home
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 border-y border-slate-200" id="hiring-request">
      <div className="max-w-3xl mx-auto">

        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Hire Staff</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Tell us who you need
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-red-600 to-sky-600 mx-auto rounded-full" />
          <p className="text-sm text-slate-600 leading-relaxed">
            Post your staffing requirement and our resourcing team will come back with
            screened, compliance-cleared candidates.
          </p>
        </div>

        <form onSubmit={submit} className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-9 space-y-6">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Company name" icon={Building2} required>
              <input type="text" required value={form.companyName} onChange={set('companyName')}
                placeholder="Apex Tower & Business Parks" className={inputClass} />
            </Field>
            <Field label="Contact person">
              <input type="text" value={form.contactPerson} onChange={set('contactPerson')}
                placeholder="Your name" className={inputClass} />
            </Field>
            <Field label="Phone" required>
              <input type="tel" required value={form.phone} onChange={set('phone')}
                placeholder="+91 …" className={inputClass} />
            </Field>
            <Field label="Email">
              <input type="email" value={form.email} onChange={set('email')}
                placeholder="you@company.com" className={inputClass} />
            </Field>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-5">
              <div className="sm:col-span-2">
                <Field label="Role you need" icon={Briefcase} required>
                  <input type="text" required value={form.roleTitle} onChange={set('roleTitle')}
                    placeholder="Security Guard / Housekeeping Supervisor" className={inputClass} />
                </Field>
              </div>
              <Field label="How many" icon={Users} required>
                <input type="number" required min="1" max="999" value={form.headcount}
                  onChange={set('headcount')} className={inputClass} />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
              <Field label="Site location" icon={MapPin}>
                <input type="text" value={form.location} onChange={set('location')}
                  placeholder="Noida Sector 62" className={inputClass} />
              </Field>
              <Field label="Experience needed">
                <input type="text" value={form.experience} onChange={set('experience')}
                  placeholder="2–3 years" className={inputClass} />
              </Field>
              <Field label="Salary range" icon={IndianRupee}>
                <input type="text" value={form.salaryRange} onChange={set('salaryRange')}
                  placeholder="₹18,000 – ₹22,000 / month" className={inputClass} />
              </Field>
              <Field label="Required from" icon={Calendar}>
                <input type="text" value={form.startDate} onChange={set('startDate')}
                  placeholder="1st of next month" className={inputClass} />
              </Field>
            </div>
          </div>

          <Field label="How soon" icon={Zap}>
            <div className="grid grid-cols-3 gap-2.5">
              {URGENCIES.map((u) => (
                <button
                  key={u.value}
                  type="button"
                  onClick={() => setForm({ ...form, urgency: u.value })}
                  className={`px-3 py-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    form.urgency === u.value
                      ? 'border-sky-500 bg-sky-50 text-sky-900'
                      : 'border-slate-300 hover:border-slate-400 text-slate-700'
                  }`}
                >
                  <span className="block text-xs font-bold">{u.label}</span>
                  <span className="block text-[10px] text-slate-500 mt-0.5">{u.hint}</span>
                </button>
              ))}
            </div>
          </Field>

          <Field label="Anything else">
            <textarea rows={3} value={form.notes} onChange={set('notes')}
              placeholder="Shift timings, uniform, police verification, specific skills…"
              className={`${inputClass} resize-y`} />
          </Field>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-px" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={sending}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-sky-600 hover:from-red-500 hover:to-sky-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {sending ? 'Sending…' : 'Send requirement'}
          </button>

          <p className="text-[11px] text-slate-400 text-center">
            Your details go straight to our resourcing desk — we never share them.
          </p>
        </form>
      </div>
    </section>
  );
};

export default HiringRequestForm;
