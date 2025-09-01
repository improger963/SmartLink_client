
import React, { useState, useEffect, useCallback } from 'react';
import HolographicTooltip from './HolographicTooltip.tsx';
import TactileButton from './TactileButton.tsx';

export interface PromoSlide {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonTooltip: string;
}

interface PromoCarouselProps {
  slides: PromoSlide[];
  autoPlayInterval?: number;
  className?: string;
  style?: React.CSSProperties;
}

const PromoCarousel: React.FC<PromoCarouselProps> = ({ slides, autoPlayInterval = 7000, className, style }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (autoPlayInterval) {
      const timer = setInterval(goToNext, autoPlayInterval);
      return () => clearInterval(timer);
    }
  }, [goToNext, autoPlayInterval]);

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <div 
        className={`promo-banner premium-glass relative rounded-2xl border border-stone-800 overflow-hidden ${className}`}
        style={style}
    >
      <div className="relative w-full overflow-hidden">
        {/* Carousel Wrapper */}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="w-full flex-shrink-0 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
               <div className="flex-grow text-center sm:text-left">
                  <h2 className="text-xl font-bold text-white [text-shadow:0_0_10px_rgba(255,255,255,0.2)]">{slide.title}</h2>
                  <p className="text-stone-400 mt-1">{slide.subtitle}</p>
                </div>
                <HolographicTooltip tooltipText={slide.buttonTooltip}>
                    <TactileButton className="w-full sm:w-auto relative overflow-hidden border-none rounded-lg px-6 py-3 font-semibold cursor-pointer transition-all duration-300 ease-in-out text-base whitespace-nowrap bg-primary text-stone-950 shadow-primary-md hover:-translate-y-0.5 hover-shadow-primary-xl hover:brightness-110">
                      {slide.buttonText}
                    </TactileButton>
                </HolographicTooltip>
            </div>
          ))}
        </div>

        {/* Dot Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                currentIndex === index ? 'dot-indicator-active scale-125' : 'bg-white/40 backdrop-blur-sm hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(PromoCarousel);
