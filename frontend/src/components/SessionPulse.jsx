import React, { useEffect, useState } from 'react';

// Maker's mark. Nothing renders and nothing is logged until the key sequence below is
// typed outside a text field; then the monogram fades in for a few seconds.
const SEQUENCE = 'gpgp';
const WINDOW_MS = 1800;
const SHOW_MS = 3500;

const SessionPulse = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let typed = '';
    let last = 0;
    let hideTimer = null;

    const onKey = (e) => {
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return;
      if (e.key === 'Escape') { setVisible(false); return; }
      if (e.key.length !== 1) return;

      const now = Date.now();
      typed = (now - last > WINDOW_MS ? '' : typed) + e.key.toLowerCase();
      last = now;
      if (!typed.endsWith(SEQUENCE)) return;

      typed = '';
      setVisible(true);
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => setVisible(false), SHOW_MS);
    };

    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); clearTimeout(hideTimer); };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-[2147483000] pointer-events-none"
      style={{ animation: 'gpFade 3.5s ease-in-out both' }}
    >
      <style>{`
        @keyframes gpFade {
          0% { opacity: 0; transform: translateY(14px) scale(.94); }
          12% { opacity: 1; transform: translateY(0) scale(1); }
          80% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(8px) scale(.98); }
        }
      `}</style>
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[#071324]/95 border border-sky-400/40 shadow-[0_18px_50px_rgba(0,0,0,.5)] flex items-center justify-center">
        <svg viewBox="0 0 120 120" className="w-16 h-16 sm:w-[76px] sm:h-[76px]">
          <defs>
            <linearGradient id="gpGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#38bdf8" />
              <stop offset="1" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          {/* G */}
          <path
            d="M62 40 A24 24 0 1 0 62 80 L62 62 L48 62"
            fill="none" stroke="url(#gpGrad)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"
          />
          {/* P */}
          <path
            d="M74 88 L74 34 L88 34 A14 14 0 0 1 88 62 L74 62"
            fill="none" stroke="url(#gpGrad)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"
          />
          <circle cx="60" cy="104" r="3.5" fill="#38bdf8" />
        </svg>
        <span className="absolute bottom-2 text-[7px] font-bold tracking-[.3em] text-sky-200/70">CRAFTED BY GP</span>
      </div>
    </div>
  );
};

export default SessionPulse;
