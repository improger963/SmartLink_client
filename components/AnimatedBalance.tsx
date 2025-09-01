import React, { useEffect, useState, useRef } from 'react';
import { useTransitionEffects } from '../contexts/TransitionContext.tsx';

const easeOutCubic = (t: number): number => --t * t * t + 1;

interface AnimatedBalanceProps {
  value: number;
}

const AnimatedBalance: React.FC<AnimatedBalanceProps> = ({ value }) => {
  const { balanceUpdate } = useTransitionEffects();
  const [totalBalance, setTotalBalance] = useState(value);
  const [displayValue, setDisplayValue] = useState(value);
  const [isGlitching, setIsGlitching] = useState(false);
  const frameRef = useRef<number>(0);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const startValue = prevValueRef.current;
    const endValue = totalBalance;
    prevValueRef.current = totalBalance;

    let startTime: number | null = null;
    
    const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const duration = 1500;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easedProgress = easeOutCubic(progress);

        const currentValue = startValue + (endValue - startValue) * easedProgress;
        setDisplayValue(currentValue);

        if (progress < 1) {
            frameRef.current = requestAnimationFrame(animate);
        }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if(frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [totalBalance]);

  useEffect(() => {
    if (balanceUpdate.key > 0) {
        setTotalBalance(prev => prev + balanceUpdate.amount);
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 300); // match animation duration
    }
  }, [balanceUpdate]);

  return (
    <div className={`text-5xl font-bold text-primary leading-tight text-shadow-balance ${isGlitching ? 'balance-glitch-active' : ''}`}>
      {displayValue.toFixed(2)} ₽
    </div>
  );
};

export default React.memo(AnimatedBalance);