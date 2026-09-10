import React, { useState, useEffect, useRef } from 'react';
import { 
  Star, 
  Quote, 
  ChevronLeft, 
  ChevronRight, 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Award, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { testimonialsData } from '../data/companyData';
import { useCompany } from '../context/CompanyContext';

const TestimonialsSlider = ({ onNavigate }) => {
  const { testimonials: dynamicTestimonials } = useCompany();
  const testimonialsList = dynamicTestimonials && dynamicTestimonials.length > 0 ? dynamicTestimonials : testimonialsData;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const totalSlides = testimonialsList.length;

  // Auto-slide effect every 4.5 seconds
  useEffect(() => {
    if (isPaused || totalSlides === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused, totalSlides]);

  const handlePrev = () => {
    if (totalSlides === 0) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    if (totalSlides === 0) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const currentItem = testimonialsList[currentIndex] || testimonialsList[0];
  // Next item for side-by-side card preview
  const nextItem = testimonialsList[(currentIndex + 1) % totalSlides] || testimonialsList[0];

  if (!currentItem) return null;

  return (
    <section 
      className="py-20 bg-white relative overflow-hidden" 
      id="testimonials"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-sky-100/50 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-red-100/40 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header with Auto-Play Badge & Navigation Arrows */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-red-600" />
              <span>Client Endorsements & Trust</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              What Corporate Leaders Say About <span className="text-sky-600">MANABS</span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-red-600 to-sky-600 rounded-full" />
            <p className="text-xs sm:text-sm text-gray-500 pt-1">
              Trusted by commercial tech parks, multi-city logistics hubs, and manufacturing facilities across India since 2014.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-gray-400 font-semibold hidden sm:inline mr-2">
              {isPaused ? '⏸️ Paused (Hovered)' : '▶️ Auto-Sliding'}
            </span>
            <button
              onClick={handlePrev}
              className="w-11 h-11 rounded-2xl bg-gray-100 hover:bg-red-600 hover:text-white text-gray-700 flex items-center justify-center transition-all shadow-sm active:scale-95"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="w-11 h-11 rounded-2xl bg-gray-100 hover:bg-sky-600 hover:text-white text-gray-700 flex items-center justify-center transition-all shadow-sm active:scale-95"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2-Card Sliding Carousel Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Main Primary Active Slide */}
          <div className="bg-gradient-to-br from-white to-sky-50/40 p-8 sm:p-10 rounded-3xl border-2 border-sky-200 shadow-xl relative flex flex-col justify-between transition-all duration-500 animate-in fade-in slide-in-from-right-4">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                {/* 5 Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(currentItem.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Metric Badge */}
                <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {currentItem.metric}
                </span>
              </div>

              {/* Quote text */}
              <div className="relative pt-2">
                <Quote className="w-10 h-10 text-sky-200 absolute -top-3 -left-2 -z-10 opacity-70" />
                <p className="text-sm sm:text-base text-gray-800 font-medium leading-relaxed italic">
                  "{currentItem.quote}"
                </p>
              </div>

              {/* Service Tag */}
              <div className="pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-100/70 px-2.5 py-0.5 rounded-md">
                  Vertical: {currentItem.serviceUsed}
                </span>
              </div>
            </div>

            {/* Client Profile Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-red-500 text-white font-extrabold text-base flex items-center justify-center shadow-md">
                  {(currentItem?.clientName || 'C').charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-gray-900 leading-snug">
                    {currentItem?.clientName || 'Enterprise Partner'}
                  </h4>
                  <p className="text-xs text-gray-500">{currentItem?.designation}</p>
                  <p className="text-xs font-semibold text-gray-700 flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3 h-3 text-red-500" />
                    <span>{currentItem?.company}</span>
                  </p>
                </div>
              </div>

              <div className="text-right hidden sm:block">
                <span className="text-[10px] text-gray-400 font-semibold block flex items-center gap-1 justify-end">
                  <MapPin className="w-3 h-3 text-red-500" />
                  {currentItem?.location}
                </span>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md mt-1 inline-block">
                  ✓ Verified Client
                </span>
              </div>
            </div>

          </div>

          {/* Secondary Preview Slide (for smooth 2-column aesthetic) */}
          <div 
            onClick={handleNext}
            className="hidden lg:flex bg-gray-50/90 p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-sm flex-col justify-between cursor-pointer hover:border-sky-400 hover:shadow-md transition-all group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 opacity-80">
                  {[...Array(nextItem?.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-gray-200 text-gray-700">
                  {nextItem?.metric}
                </span>
              </div>

              <div className="relative pt-2">
                <Quote className="w-8 h-8 text-gray-300 absolute -top-3 -left-2 -z-10" />
                <p className="text-sm text-gray-600 font-normal leading-relaxed line-clamp-4 italic">
                  "{nextItem?.quote}"
                </p>
              </div>

              <div className="pt-2">
                <span className="text-[10px] font-semibold text-gray-500 bg-white px-2 py-0.5 rounded-md border border-gray-200">
                  {nextItem?.serviceUsed}
                </span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gray-200 text-gray-700 font-bold text-sm flex items-center justify-center">
                  {(nextItem?.clientName || 'C').charAt(0)}
                </div>
                <div>
                  <h5 className="text-sm font-bold text-gray-800 group-hover:text-sky-600 transition-colors">
                    {nextItem?.clientName || 'Enterprise Partner'}
                  </h5>
                  <p className="text-xs text-gray-500">{nextItem?.company}</p>
                </div>
              </div>

              <span className="text-xs font-bold text-sky-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Next Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

        </div>

        {/* Dynamic Dot Indicators */}
        <div className="flex items-center justify-center gap-2 mt-10">
          {testimonialsList.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentIndex === idx 
                  ? 'w-8 bg-gradient-to-r from-red-600 to-sky-600 shadow-sm' 
                  : 'w-2.5 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSlider;
