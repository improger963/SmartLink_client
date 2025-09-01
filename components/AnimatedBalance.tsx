import React, { useEffect, useState, useRef } from 'react';

const easeOutCubic = (t: number): number => --t * t * t + 1;

interface AnimatedBalanceProps {
  value: number;
}

const AnimatedBalance: React.FC<AnimatedBalanceProps> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);
  // FIX: Removed unused `animationRef`. Its declaration `useRef<number>()` was causing an error, and `frameRef` is already used for managing the animation frame.
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const startAnimation = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const duration = 1500; // ms
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      const easedProgress = easeOutCubic(progress);
      
      const currentValue = easedProgress * value;
      setDisplayValue(currentValue);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(startAnimation);
      }
    };

    frameRef.current = requestAnimationFrame(startAnimation);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [value]);

  return (
    <div className="text-5xl font-bold text-primary leading-tight text-shadow-balance">
      {displayValue.toFixed(2)} ₽
    </div>
  );
};

export default React.memo(AnimatedBalance);
