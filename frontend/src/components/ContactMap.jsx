import React from 'react';
import { MapPin, Navigation, Phone, Clock } from 'lucide-react';
import { useCompany } from '../context/CompanyContext';
import { toMapEmbedSrc, toDirectionsHref, toTelHref } from '../data/siteContact';

/**
 * Office location map for the contact page. The embed comes from the admin panel
 * (Contact Details → Google Maps link) and falls back to a map of the office address.
 */
const ContactMap = () => {
  const { contactInfo } = useCompany();
  const src = toMapEmbedSrc(contactInfo);

  return (
    <section className="bg-gray-50 border-t border-gray-200 py-14 sm:py-20" id="office-map">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-extrabold text-red-600 uppercase tracking-wider mb-2">
              <MapPin className="w-4 h-4" />
              <span>Find us</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Visit Our Office</h2>
            <p className="text-sm text-gray-600 mt-1 max-w-xl">
              Walk-ins are welcome during office hours. Call ahead and our operations desk will have someone ready to meet you.
            </p>
          </div>
          <a
            href={toDirectionsHref(contactInfo)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-colors shrink-0"
          >
            <Navigation className="w-4 h-4" />
            <span>Get Directions</span>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Address card */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-5 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-gray-900 font-bold">Head Office</strong>
                <span className="whitespace-pre-line">{contactInfo.addressLine}</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-gray-900 font-bold">Landline</strong>
                <a href={toTelHref(contactInfo.phonePrimary)} className="hover:text-red-600 transition-colors">
                  {contactInfo.phonePrimary}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-gray-900 font-bold">Hours</strong>
                <span>{contactInfo.hours}</span>
              </div>
            </div>
            {contactInfo.regionsLine && (
              <p className="pt-4 border-t border-gray-100 text-xs text-gray-500">
                Operational coverage: {contactInfo.regionsLine}
              </p>
            )}
          </div>

          {/* Map */}
          <div className="lg:col-span-8 rounded-3xl overflow-hidden border border-gray-200 shadow-sm bg-gray-200 min-h-[320px]">
            <iframe
              title="MANEBZ office location"
              src={src}
              className="w-full h-full min-h-[320px] sm:min-h-[420px] block"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMap;
