import React, { createContext, useState, useEffect, useContext, ReactNode, useMemo } from 'react';

export type PerformanceTier = 'low' | 'medium' | 'high';

interface PerformanceContextType {
  tier: PerformanceTier;
}

export const PerformanceContext = createContext<PerformanceContextType>({
  tier: 'high',
});

// Settings for each tier
const tierSettings = {
  high: { fpsThreshold: 60 },
  medium: { fpsThreshold: 45 },
  low: { fpsThreshold: 0 }, // Anything below 'medium' is 'low'
};

const MONITORING_DURATION = 3000; // ms

export const PerformanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Default to high and let the monitor downgrade if necessary
  const [tier, setTier] = useState<PerformanceTier>('high');

  useEffect(() => {
    // Respect user's preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setTier('low');
      return;
    }

    let animationFrameId: number;
    const frameTimes: number[] = [];
    let startTime = performance.now();

    const checkPerformance = (time: number) => {
        frameTimes.push(time);
        
        // Remove times older than 1 second to calculate current FPS
        while (frameTimes.length > 0 && frameTimes[0] <= time - 1000) {
            frameTimes.shift();
        }

        // If monitoring period is over, determine the final tier
        if (time > startTime + MONITORING_DURATION) {
            const averageFps = frameTimes.length;
            
            if (averageFps >= tierSettings.high.fpsThreshold) {
                setTier('high');
            } else if (averageFps >= tierSettings.medium.fpsThreshold) {
                setTier('medium');
            } else {
                setTier('low');
            }
            // Stop monitoring
            return; 
        }

        animationFrameId = requestAnimationFrame(checkPerformance);
    };
    
    animationFrameId = requestAnimationFrame(checkPerformance);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []); // Run only once on mount

  useEffect(() => {
    document.body.setAttribute('data-performance-tier', tier);
  }, [tier]);

  const value = useMemo(() => ({ tier }), [tier]);

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
};

export const usePerformance = () => useContext(PerformanceContext);