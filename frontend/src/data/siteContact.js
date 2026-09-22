/**
 * Company contact details.
 *
 * These were hardcoded in three separate components, which meant a phone number change
 * had to be made in every one of them. They now live here as defaults and are edited
 * from the admin panel, so the footer, contact page and chat widget can never disagree.
 */

export const defaultContactInfo = {
  phonePrimary: '0120 4253056', // office landline
  phoneSecondary: '',
  emailPrimary: 'info@manebz.com',
  emailSecondary: 'operations@manebz.com',
  addressLine: 'E-171, E Block, Sector 63, Noida, Uttar Pradesh 201309',
  regionsLine: 'Delhi & NCR • Uttar Pradesh • Haryana • Uttarakhand',
  hours: '24/7/365 Site Operations • Office: Mon–Sat, 9:30 AM – 6:30 PM',
  // Google Maps "Embed a map" src (or the whole <iframe> — see toMapEmbedSrc). Empty
  // means the map is built from the address text instead. This CID is the
  // "MANABS SOURCING SOLUTIONS PVT. LTD." listing at 28.623051, 77.3870092.
  mapEmbedUrl: 'https://maps.google.com/maps?cid=4658594637833069781&output=embed&hl=en',
};

/** Google place ID of the same listing — lets "Get directions" target the pin, not a text search. */
export const OFFICE_PLACE_ID = 'ChIJb69iYgTlDDkR1WSUDCSnpkA';

/**
 * Strips everything a dialler cannot use, so `tel:` links stay valid however
 * the number was typed into the admin panel (spaces, dashes, brackets, leading +).
 */
export const toDigits = (value) => String(value || '').replace(/\D/g, '');

/** `tel:` href — keeps the leading + when the admin typed an international number. */
export const toTelHref = (value) => {
  const digits = toDigits(value);
  if (!digits) return '#';
  return `tel:${String(value).trim().startsWith('+') ? '+' : ''}${digits}`;
};

/** mailto: link with an optional pre-filled subject and body. */
export const toMailtoHref = (email, subject = '', body = '') => {
  const address = String(email || '').trim();
  if (!address) return '#';
  const params = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${address}${params.length ? `?${params.join('&')}` : ''}`;
};

/**
 * Values the site originally shipped with. A saved copy still holding one of these was
 * never edited by anyone, so it must not shadow the real default that replaced it.
 */
export const LEGACY_PLACEHOLDERS = {
  phonePrimary: ['+91 11 2345 6789'],
  phoneSecondary: ['+91 91234 56789'],
  whatsapp: ['+91 91234 56789'],
  emailPrimary: ['contact@manabs.com', 'contact@manebz.com'],
  emailSecondary: ['operations@manabs.com'],
  addressLine: ['Delhi & NCR Hub, New Delhi / Gurugram / Noida, India'],
};

export const isLegacyPlaceholder = (field, value) =>
  (LEGACY_PLACEHOLDERS[field] || []).includes(String(value || '').trim());

/**
 * Accepts whatever the admin pasted from Google Maps → Share → "Embed a map": the bare
 * src URL or the full <iframe …> snippet. Anything that is not a Google Maps embed is
 * ignored and the address-based map is used instead, so a bad paste cannot break the page.
 */
export const toMapEmbedSrc = (contactInfo) => {
  const raw = String(contactInfo?.mapEmbedUrl || '').trim();
  if (raw) {
    const src = raw.startsWith('<') ? (raw.match(/src=["']([^"']+)["']/i) || [])[1] : raw;
    if (src && /^https:\/\/(www\.|maps\.)?google\.[a-z.]+\/maps/i.test(src)) return src;
  }
  const query = contactInfo?.addressLine || 'Noida, Uttar Pradesh, India';
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
};

/** Opens Google Maps directions to the office in a new tab. */
export const toDirectionsHref = (contactInfo) => {
  const address = contactInfo?.addressLine || defaultContactInfo.addressLine;
  // Only pin the place ID while the address is still the office it belongs to.
  const placeId = address === defaultContactInfo.addressLine ? `&destination_place_id=${OFFICE_PLACE_ID}` : '';
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}${placeId}`;
};

export const mergeContactInfo = (saved) => {
  if (!saved || typeof saved !== 'object') return defaultContactInfo;
  const cleaned = {};
  for (const [key, value] of Object.entries(saved)) {
    if (!isLegacyPlaceholder(key, value)) cleaned[key] = value;
  }
  return { ...defaultContactInfo, ...cleaned };
};

export default defaultContactInfo;
