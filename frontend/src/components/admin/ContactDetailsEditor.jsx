import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, Phone, Mail, MapPin, MessageCircle, AlertTriangle } from 'lucide-react';
import { defaultContactInfo, toTelHref, toWhatsAppHref, toDigits } from '../../data/siteContact';

// The values the site shipped with. Anything still matching these is a placeholder that
// was never replaced with a real number, and the editor says so out loud.
const PLACEHOLDERS = new Set([
  defaultContactInfo.phonePrimary,
  defaultContactInfo.phoneSecondary,
  defaultContactInfo.whatsapp,
  defaultContactInfo.emailPrimary,
  defaultContactInfo.addressLine,
]);

const Field = ({ label, value, onChange, placeholder, hint, textarea, warn }) => (
  <div>
    <label className="block font-bold text-gray-800 uppercase mb-1.5 text-[11px] tracking-wide">
      {label}
    </label>
    {textarea ? (
      <textarea rows={2} value={value ?? ''} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 rounded-xl border font-medium text-sm resize-y ${warn ? 'border-amber-400 bg-amber-50/40' : 'border-gray-300'}`} />
    ) : (
      <input type="text" value={value ?? ''} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 rounded-xl border font-medium text-sm ${warn ? 'border-amber-400 bg-amber-50/40' : 'border-gray-300'}`} />
    )}
    {warn && (
      <p className="mt-1.5 text-[11px] font-semibold text-amber-700 flex items-center gap-1.5">
        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
        Still the sample value — replace it with the real one.
      </p>
    )}
    {!warn && hint && <p className="mt-1.5 text-[11px] text-gray-500">{hint}</p>}
  </div>
);

/**
 * Edits the phone numbers, emails and address used by the footer, contact page,
 * navbar and chat widget — all of which read the same values.
 */
const ContactDetailsEditor = ({ contactInfo, onSave, onReset, showToast }) => {
  const [draft, setDraft] = useState(contactInfo);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!dirty) setDraft(contactInfo);
  }, [contactInfo, dirty]);

  const set = (key, value) => {
    setDirty(true);
    setDraft((d) => ({ ...d, [key]: value }));
  };

  const isPlaceholder = (v) => PLACEHOLDERS.has((v || '').trim());

  const handleSave = () => {
    onSave(draft);
    setDirty(false);
    showToast?.('Contact details saved!');
  };

  const handleReset = () => {
    if (!window.confirm('Reset contact details back to the sample values?')) return;
    onReset();
    setDraft(defaultContactInfo);
    setDirty(false);
    showToast?.('Contact details reset.');
  };

  const stillSample = [
    draft.phonePrimary, draft.phoneSecondary, draft.whatsapp,
    draft.emailPrimary, draft.addressLine,
  ].filter(isPlaceholder).length;

  return (
    <div className="space-y-6">

      <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-slate-50/95 backdrop-blur border-b border-slate-200 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-black text-gray-900 truncate">Contact Details</h2>
          <p className="text-xs text-gray-500">
            {dirty ? 'You have unsaved changes' : 'Everything is saved'}
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button type="button" onClick={handleReset}
            className="px-3.5 py-2.5 rounded-xl bg-white border border-gray-300 hover:border-red-400 hover:text-red-600 text-gray-700 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer">
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button type="button" onClick={handleSave} disabled={!dirty}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold inline-flex items-center gap-2 shadow-md cursor-pointer">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>

      {stillSample > 0 && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 sm:p-5 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-bold text-amber-900">
              {stillSample} field{stillSample > 1 ? 's are' : ' is'} still showing sample data
            </p>
            <p className="text-amber-800 text-xs mt-1 leading-relaxed">
              These numbers and addresses are visible on the live website. Customers calling
              them will not reach anyone until they are replaced with the real details.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 sm:px-8 py-5 border-b border-gray-100 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-gray-900">Phone &amp; WhatsApp</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Used by the navbar call button, footer, contact page and chat widget.
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Main phone / landline" value={draft.phonePrimary}
              warn={isPlaceholder(draft.phonePrimary)}
              placeholder="+91 11 4000 0000"
              onChange={(v) => set('phonePrimary', v)} />
            <Field label="Second phone (optional)" value={draft.phoneSecondary}
              warn={isPlaceholder(draft.phoneSecondary)}
              placeholder="+91 98000 00000"
              onChange={(v) => set('phoneSecondary', v)} />
          </div>

          <Field label="WhatsApp number" value={draft.whatsapp}
            warn={isPlaceholder(draft.whatsapp)}
            placeholder="+91 98000 00000"
            hint="Include the country code. Spaces and dashes are fine — they are stripped automatically."
            onChange={(v) => set('whatsapp', v)} />

          {/* Shows exactly what the buttons will do, so a typo is obvious before saving. */}
          <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4 space-y-2 text-[11px]">
            <p className="font-bold text-gray-700 uppercase tracking-wide">Links these produce</p>
            <p className="text-gray-600 break-all">
              <Phone className="w-3 h-3 inline mr-1.5 text-sky-600" />
              {toTelHref(draft.phonePrimary)}
            </p>
            <p className="text-gray-600 break-all">
              <MessageCircle className="w-3 h-3 inline mr-1.5 text-emerald-600" />
              {toWhatsAppHref(draft.whatsapp)}
            </p>
            {toDigits(draft.whatsapp).length < 11 && draft.whatsapp && (
              <p className="text-amber-700 font-semibold">
                WhatsApp numbers need the country code (e.g. 91 for India) — this looks short.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 sm:px-8 py-5 border-b border-gray-100 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-gray-900">Email</h3>
            <p className="text-xs text-gray-500 mt-0.5">Shown publicly on the site.</p>
          </div>
        </div>
        <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Main email" value={draft.emailPrimary}
            warn={isPlaceholder(draft.emailPrimary)}
            placeholder="contact@manebz.com"
            onChange={(v) => set('emailPrimary', v)} />
          <Field label="Second email (optional)" value={draft.emailSecondary}
            placeholder="operations@manebz.com"
            onChange={(v) => set('emailSecondary', v)} />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 sm:px-8 py-5 border-b border-gray-100 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-gray-900">Address &amp; Hours</h3>
            <p className="text-xs text-gray-500 mt-0.5">Shown on the contact page and footer.</p>
          </div>
        </div>
        <div className="p-6 sm:p-8 space-y-5">
          <Field label="Office address" textarea value={draft.addressLine}
            warn={isPlaceholder(draft.addressLine)}
            placeholder="Plot 00, Sector 00, Gurugram, Haryana 122001"
            hint="The full registered address customers can actually visit or post to."
            onChange={(v) => set('addressLine', v)} />
          <Field label="Regions line" value={draft.regionsLine}
            placeholder="Delhi & NCR • Uttar Pradesh • Haryana • Uttarakhand"
            onChange={(v) => set('regionsLine', v)} />
          <Field label="Working hours" value={draft.hours}
            placeholder="24/7 Site Operations • Office: Mon–Sat, 9:30 AM – 6:30 PM"
            onChange={(v) => set('hours', v)} />
        </div>
      </div>
    </div>
  );
};

export default ContactDetailsEditor;
