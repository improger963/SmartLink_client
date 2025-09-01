import React, { useState, useEffect, useCallback } from 'react';

interface CarouselItem {
  src: string;
  alt: string;
}

interface AdCarouselProps {
  items: CarouselItem[];
  autoPlayInterval?: number;
  className?: string;
  style?: React.CSSProperties;
  onMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const AdCarousel: React.FC<AdCarouselProps> = ({ items, autoPlayInterval = 5000, className, style, onMouseMove }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === items.length - 1 ? 0 : prevIndex + 1));
  }, [items.length]);

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (autoPlayInterval) {
      const timer = setInterval(goToNext, autoPlayInterval);
      return () => clearInterval(timer);
    }
  }, [goToNext, autoPlayInterval]);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div 
        className={`premium-glass interactive-card group relative bg-stone-900/80 border border-stone-800 rounded-2xl overflow-hidden cursor-pointer ${className}`}
        style={style}
        onMouseMove={onMouseMove}
    >
      <div className="relative w-full overflow-hidden">
        {/* Carousel Wrapper */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <img src={item.src} alt={item.alt} className="w-full h-auto block" />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrev}
          className="absolute top-1/2 left-2 -translate-y-1/2 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/50 focus:outline-none focus:ring-2 focus-ring-primary z-10"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <button
          onClick={goToNext}
          className="absolute top-1/2 right-2 -translate-y-1/2 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/50 focus:outline-none focus:ring-2 focus-ring-primary z-10"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {items.map((_, index) => (
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

export default React.memo(AdCarousel);
