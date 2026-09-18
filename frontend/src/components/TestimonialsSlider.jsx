import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Building2,
  MapPin,
  Award,
  CheckCircle2
} from 'lucide-react';
import { testimonialsData } from '../data/companyData';
import { useCompany } from '../context/CompanyContext';

const AUTOPLAY_MS = 6000;

// On wide screens each slide is narrower than the viewport so the neighbouring cards
// peek in at the edges — that, plus the dimmed scale on inactive cards, is what reads
// as a carousel rather than a box whose contents change. Phones get the full width
// instead, where a peek would only squeeze the quote. The width lives in a CSS variable
// so the media query drives both the slide size and the track offset, and the two can
// never disagree.
const SLIDE_WIDTH_CSS = `
  #testimonials .manebz-track { --slide-w: 100%; }
  @media (min-width: 640px) {
    #testimonials .manebz-track { --slide-w: 88%; }
  }
`;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Left panel: the client photo when one is set, otherwise a branded gradient carrying
 * their initial — so a testimonial without an image still looks deliberate rather than
 * broken. A photo that fails to load falls back to the same panel.
 */
const CardVisual = ({ item }) => {
  const [failed, setFailed] = useState(false);
  const src = item.image || item.avatar;
  const showImage = src && !failed;

  return (
    <div className="relative shrink-0 overflow-hidden bg-slate-900
                    w-full h-48 sm:h-56 lg:h-auto lg:w-[38%] lg:min-h-[420px]">
      {showImage ? (
        <>
          <img
            src={src}
            alt={item.clientName ? `${item.clientName}, ${item.company || ''}`.trim() : 'Client'}
            loading="lazy"
            onError={() => setFailed(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent
                          lg:bg-gradient-to-t lg:from-slate-950/80 lg:via-slate-950/10 lg:to-transparent" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-sky-600 via-blue-700 to-red-600">
          <div className="absolute inset-0 opacity-20"
               style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, white 0%, transparent 55%)' }} />
          {/* Bottom padding keeps the initial clear of the name plate, which sits lower
              on the stacked mobile layout than it does in the tall desktop panel. */}
          <span className="absolute inset-0 flex items-center justify-center pb-16 lg:pb-20
                           text-white/95 font-black text-6xl lg:text-7xl select-none">
            {(item.clientName || 'C').charAt(0)}
          </span>
        </div>
      )}

      {/* Name plate reads over both the photo and the gradient fallback */}
      <div className="absolute inset-x-0 bottom-0 p-5 lg:p-6">
        <h4 className="text-white font-extrabold text-base leading-snug drop-shadow-sm truncate">
          {item.clientName || 'Enterprise Partner'}
        </h4>
        {item.designation && (
          <p className="text-white/75 text-xs mt-0.5 truncate">{item.designation}</p>
        )}
        {item.company && (
          <p className="text-white/95 text-xs font-semibold flex items-center gap-1.5 mt-1.5 truncate">
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{item.company}</span>
          </p>
        )}
      </div>
    </div>
  );
};

const TestimonialCard = ({ item, isActive }) => (
  <article
    className={`h-full rounded-[28px] bg-white border border-slate-200/70 overflow-hidden flex flex-col
                transition-[transform,opacity,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
                ${isActive
                  ? 'opacity-100 scale-100 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.45)]'
                  : 'opacity-45 scale-[0.93] shadow-none'}`}
  >
    {/* Brand rail */}
    <div className="h-1.5 bg-gradient-to-r from-sky-500 via-blue-600 to-red-500 shrink-0" />

    <div className="flex flex-col lg:flex-row flex-1 min-h-0">
      <CardVisual item={item} />

      <div className="relative p-7 sm:p-9 lg:p-10 flex flex-col flex-1 gap-6 min-w-0">
      {/* Oversized watermark glyph */}
      <Quote
        className="absolute top-5 right-6 w-24 h-24 text-slate-900/[0.035] pointer-events-none"
        aria-hidden="true"
      />

      {/* Rating + outcome metric */}
      <div className="flex items-center justify-between gap-3 relative">
        <div className="flex items-center gap-1">
          {[...Array(Number(item.rating) || 5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 fill-amber-400 text-amber-400 transition-all duration-500
                          ${isActive ? 'opacity-100 translate-y-0' : 'opacity-70'}`}
              style={isActive ? { transitionDelay: `${120 + i * 60}ms` } : undefined}
            />
          ))}
        </div>

        {item.metric && (
          <span className="text-[10px] font-extrabold uppercase tracking-wide px-3 py-1.5 rounded-full
                           bg-emerald-50 text-emerald-700 border border-emerald-200/80
                           inline-flex items-center gap-1.5 shrink-0">
            <CheckCircle2 className="w-3 h-3 shrink-0" />
            {item.metric}
          </span>
        )}
      </div>

      {/* The quote — the hero of the card */}
      <blockquote
        className={`relative text-[15px] sm:text-lg lg:text-xl text-slate-800 font-medium leading-relaxed
                    transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
                    ${isActive ? 'opacity-100 translate-y-0' : 'opacity-80 translate-y-1'}`}
        style={isActive ? { transitionDelay: '90ms' } : undefined}
      >
        <span className="text-sky-500/70 text-2xl leading-none align-top mr-0.5">&ldquo;</span>
        {item.quote}
        <span className="text-sky-500/70 text-2xl leading-none align-bottom ml-0.5">&rdquo;</span>
      </blockquote>

      {item.serviceUsed && (
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700
                           bg-sky-50 border border-sky-100 px-2.5 py-1 rounded-lg">
            {item.serviceUsed}
          </span>
        </div>
      )}

        {/* Location and verification. The name, role and company now live on the
            visual panel, so this row carries only what is left. */}
        <div className="mt-auto pt-6 border-t border-slate-200/80 flex items-center justify-between gap-4 flex-wrap">
          {item.location ? (
            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span className="truncate">{item.location}</span>
            </span>
          ) : <span />}

          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200/80
                           px-2.5 py-1 rounded-md shrink-0">
            ✓ Verified Client
          </span>
        </div>
      </div>
    </div>
  </article>
);

const TestimonialsSlider = ({ onNavigate }) => {
  const { testimonials: dynamicTestimonials } = useCompany();
  const items = dynamicTestimonials?.length > 0 ? dynamicTestimonials : testimonialsData;
  const total = items.length;

  // A clone of the last slide sits before the first and a clone of the first sits after
  // the last, so wrapping around slides onward instead of rewinding through every card.
  const slides = useMemo(
    () => (total > 1 ? [items[total - 1], ...items, items[0]] : items),
    [items, total]
  );
  const isLooped = total > 1;

  const [index, setIndex] = useState(isLooped ? 1 : 0);
  const [animate, setAnimate] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const reduced = useRef(false);
  const dragX = useRef(null);

  useEffect(() => { reduced.current = prefersReducedMotion(); }, []);

  // Keep the index valid if the admin adds or removes testimonials at runtime.
  useEffect(() => { setIndex(isLooped ? 1 : 0); }, [total, isLooped]);

  const realIndex = isLooped ? (index - 1 + total) % total : 0;

  const goTo = useCallback((next) => {
    setAnimate(true);
    setIndex(next);
  }, []);

  const handleNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const handlePrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const goToReal = (i) => goTo(isLooped ? i + 1 : i);

  // Autoplay
  useEffect(() => {
    if (isPaused || !isLooped) return;
    const timer = setInterval(() => {
      setAnimate(true);
      setIndex((prev) => prev + 1);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [isPaused, isLooped]);

  // When a clone finishes sliding in, jump silently to its real twin.
  const handleTransitionEnd = () => {
    if (!isLooped) return;
    if (index === slides.length - 1) {
      setAnimate(false);
      setIndex(1);
    } else if (index === 0) {
      setAnimate(false);
      setIndex(total);
    }
  };

  // Restore the transition only after the silent jump has painted.
  useEffect(() => {
    if (animate) return;
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
    return () => cancelAnimationFrame(raf);
  }, [animate]);

  // Swipe on touch, drag on desktop
  const onPointerDown = (e) => { dragX.current = e.clientX; };
  const onPointerUp = (e) => {
    if (dragX.current === null) return;
    const delta = e.clientX - dragX.current;
    dragX.current = null;
    if (Math.abs(delta) < 50 || !isLooped) return;
    if (delta < 0) handleNext(); else handlePrev();
  };

  if (total === 0) return null;

  const duration = reduced.current ? 0 : 700;

  return (
    <section
      className="py-20 bg-gradient-to-b from-white via-slate-50/60 to-white relative overflow-hidden"
      id="testimonials"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Client testimonials"
    >
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-sky-100/50 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-red-100/40 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-red-600" />
              <span>Client Endorsements &amp; Trust</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              What Corporate Leaders Say About <span className="text-sky-600">MANEBZ</span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-red-600 to-sky-600 rounded-full" />
            <p className="text-xs sm:text-sm text-gray-500 pt-1">
              Trusted by commercial tech parks, multi-city logistics hubs, and manufacturing facilities across India since 2014.
            </p>
          </div>

          {isLooped && (
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-slate-400 font-semibold tabular-nums hidden sm:inline mr-1">
                {String(realIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>
              <button
                onClick={handlePrev}
                className="w-11 h-11 rounded-2xl bg-white border border-slate-200 hover:bg-red-600 hover:border-red-600 hover:text-white text-slate-700 flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="w-11 h-11 rounded-2xl bg-white border border-slate-200 hover:bg-sky-600 hover:border-sky-600 hover:text-white text-slate-700 flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Sliding track. Padding on the viewport lets the neighbouring cards peek through. */}
        <div
          className="overflow-hidden -mx-4 px-4 sm:-mx-6 sm:px-6 py-3 touch-pan-y select-none"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => { dragX.current = null; }}
        >
          <div
            className="manebz-track flex items-stretch will-change-transform"
            style={{
              transform: `translate3d(calc(var(--slide-w) * ${-index} + (100% - var(--slide-w)) / 2), 0, 0)`,
              transition: animate ? `transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)` : 'none',
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {slides.map((item, i) => (
              <div
                key={`${item?.id ?? 'slide'}-${i}`}
                className="shrink-0 px-2 sm:px-3"
                style={{ width: 'var(--slide-w)' }}
                aria-hidden={i !== index}
              >
                <TestimonialCard item={item} isActive={i === index} />
              </div>
            ))}
          </div>
        </div>

        {/* Dots with an autoplay progress bar on the active one */}
        {isLooped && (
          <div className="flex items-center justify-center gap-2 mt-10">
            {items.map((_, idx) => {
              const active = realIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => goToReal(idx)}
                  className={`h-2.5 rounded-full transition-all duration-500 ease-out cursor-pointer overflow-hidden
                              ${active ? 'w-10 bg-slate-200' : 'w-2.5 bg-slate-300 hover:bg-slate-400'}`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                  aria-current={active}
                >
                  {active && (
                    <span
                      key={`${idx}-${isPaused}`}
                      className="block h-full rounded-full bg-gradient-to-r from-red-600 to-sky-600"
                      style={{
                        animation: reduced.current
                          ? 'none'
                          : `manebzDotFill ${AUTOPLAY_MS}ms linear forwards`,
                        animationPlayState: isPaused ? 'paused' : 'running',
                        width: reduced.current ? '100%' : undefined,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}

        <style>{`
          ${SLIDE_WIDTH_CSS}
          @keyframes manebzDotFill {
            from { width: 0%; }
            to   { width: 100%; }
          }
        `}</style>

      </div>
    </section>
  );
};

export default TestimonialsSlider;
