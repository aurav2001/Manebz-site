/**
 * Company contact details.
 *
 * These were hardcoded in three separate components, which meant a phone number change
 * had to be made in every one of them. They now live here as defaults and are edited
 * from the admin panel, so the footer, contact page and chat widget can never disagree.
 */

export const defaultContactInfo = {
  phonePrimary: '+91 11 2345 6789',
  phoneSecondary: '+91 91234 56789',
  whatsapp: '+91 91234 56789',
  emailPrimary: 'contact@manabs.com',
  emailSecondary: 'operations@manebz.com',
  addressLine: 'Delhi & NCR Hub, New Delhi / Gurugram / Noida, India',
  regionsLine: 'Delhi & NCR • Uttar Pradesh • Haryana • Uttarakhand',
  hours: '24/7/365 Site Operations • Office: Mon–Sat, 9:30 AM – 6:30 PM',
};

/**
 * Strips everything a dialler cannot use, so `tel:` and `wa.me` links stay valid however
 * the number was typed into the admin panel (spaces, dashes, brackets, leading +).
 */
export const toDigits = (value) => String(value || '').replace(/\D/g, '');

/** `tel:` href — keeps the leading + when the admin typed an international number. */
export const toTelHref = (value) => {
  const digits = toDigits(value);
  if (!digits) return '#';
  return `tel:${String(value).trim().startsWith('+') ? '+' : ''}${digits}`;
};

/** wa.me needs bare digits including the country code. */
export const toWhatsAppHref = (value, message = '') => {
  const digits = toDigits(value);
  if (!digits) return '#';
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
};

export const mergeContactInfo = (saved) =>
  saved && typeof saved === 'object'
    ? { ...defaultContactInfo, ...saved }
    : defaultContactInfo;

export default defaultContactInfo;
