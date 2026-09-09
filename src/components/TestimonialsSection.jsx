import React, { useState, useEffect } from 'react';
import { 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Quote, 
  ShieldCheck, 
  Sparkles,
  Award,
  CheckCircle2
} from 'lucide-react';
import { testimonialsData } from '../data/companyData';

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonialsData.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextTestimonial();
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, currentIndex]);

  const current = testimonialsData[currentIndex];

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden bg-black/40">
      
      {/* Background glow */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-300">
            <Award className="w-3.5 h-3.5" />
            <span>Proven Enterprise Impact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-white">
            Trusted by Leaders <br />
            <span className="text-gradient">Powering High-Stakes Operations</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Read how India's most demanding enterprises scale seamlessly with Menabz 3D infrastructure and AI pipelines.
          </p>
        </div>

        {/* Testimonial Showcase Carousel */}
        <div 
          className="max-w-4xl mx-auto relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Main Card */}
          <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-cyan-500/30 shadow-2xl shadow-cyan-950/40 relative overflow-hidden transition-all duration-500">
            
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
            <Quote className="absolute top-8 right-8 w-16 h-16 text-cyan-500/10 pointer-events-none" />

            <div className="relative z-10 space-y-8">
              
              {/* Top rating & verified badge */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-2 text-xs font-bold text-white">5.0 / 5.0 Enterprise Review</span>
                </div>

                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified CXO Partner</span>
                </div>
              </div>

              {/* Quote Text */}
              <blockquote className="text-lg sm:text-2xl font-display font-medium text-slate-100 leading-relaxed italic">
                "{current.quote}"
              </blockquote>

              {/* Client Details & Impact Metric */}
              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                
                <div className="flex items-center gap-4">
                  <img 
                    src={current.avatar} 
                    alt={current.name} 
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400 shadow-md"
                  />
                  <div>
                    <h4 className="text-lg font-bold text-white">
                      {current.name}
                    </h4>
                    <p className="text-xs text-cyan-400 font-medium">
                      {current.designation}
                    </p>
                    <p className="text-xs text-slate-400">
                      {current.company}
                    </p>
                  </div>
                </div>

                {/* Metric pill */}
                <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-left sm:text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Measurable Outcome</div>
                  <div className="text-base font-bold text-cyan-300 font-display mt-0.5">
                    {current.metric}
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* Carousel Controls */}
          <div className="flex items-center justify-between mt-8">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonialsData.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    currentIndex === idx 
                      ? 'w-8 bg-cyan-400 shadow-md shadow-cyan-400/50' 
                      : 'w-2.5 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Prev/Next Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={prevTestimonial}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-cyan-500/40 hover:bg-white/10 transition-all active:scale-95"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextTestimonial}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-cyan-500/40 hover:bg-white/10 transition-all active:scale-95"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;
