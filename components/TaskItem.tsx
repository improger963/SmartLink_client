
import React, { useState } from 'react';
import { Task } from '../types.ts';
import HolographicTooltip from './HolographicTooltip.tsx';
import TactileButton from './TactileButton.tsx';
import { useTransitionEffects } from '../contexts/TransitionContext.tsx';


const TaskItem: React.FC<{ task: Task; className?: string; style?: React.CSSProperties; }> = ({ task, className = '', style }) => {
  const IconComponent = task.icon;
  const { triggerHyperspace, triggerPulse, triggerBalanceUpdate } = useTransitionEffects();
  const [isCompleting, setIsCompleting] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isCompleting) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent the main button from also triggering the ripple on the parent
    e.stopPropagation();
    setIsCompleting(true);
    triggerBalanceUpdate(7.50); // Simulate earning
    triggerHyperspace();
    triggerPulse('positive');
  };

  const handleAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    // Hide the element after animation to prevent it from capturing mouse events
    if (isCompleting) {
        (e.currentTarget as HTMLDivElement).style.visibility = 'hidden';
    }
  };

  return (
    <div 
        className={`premium-glass interactive-card group flex flex-col sm:flex-row sm:items-center bg-stone-900/80 border border-stone-800 rounded-xl p-4 sm:p-6 cursor-pointer hover:border-stone-700 ${className} ${isCompleting ? 'animate-task-complete' : ''}`}
        style={style}
        onMouseMove={handleMouseMove}
        onAnimationEnd={handleAnimationEnd}
    >
      <div className="flex items-center flex-grow mb-4 sm:mb-0 sm:mr-4">
        <div className={`w-10 h-10 mr-4 sm:mr-6 shrink-0 flex items-center justify-center rounded-lg ${task.iconBgColorClass} task-item-lift`}>
          <IconComponent className={`w-6 h-6 ${task.iconColorClass}`} />
        </div>
        <div className="flex-grow task-item-lift" style={{ transitionDelay: '50ms' }}>
          <div className="font-semibold text-base sm:text-lg text-stone-100 transition-all duration-300 group-hover:text-white group-hover:[text-shadow:0_0_8px_rgba(255,255,255,0.3)]">{task.title}</div>
          <div className="text-sm text-stone-400">{task.meta}</div>
        </div>
      </div>
      <div className="w-full sm:w-auto shrink-0">
        <HolographicTooltip tooltipText="Начать задание">
            <TactileButton 
              onClick={handleButtonClick}
              className="w-full sm:w-auto relative overflow-hidden border border-stone-700 rounded-lg px-6 py-3 font-semibold cursor-pointer text-sm whitespace-nowrap text-stone-200 bg-stone-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),_0_2px_8px_rgba(0,0,0,0.4)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),_0_4px_15px_rgba(0,0,0,0.5)] hover:border-stone-600 hover:bg-stone-700"
            >
              <span className="relative z-20">{task.buttonText}</span>
              <span className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAUVBMVEWFhYWDg4N3d3dtbW17e3t1dXVweHh7e3t4eHhmZmZ3d3dsbGxjaGmpqahxZmZobGxpZ2Zna2tvam1obGxwZ2Zxa2trZ2ZsanFwa3N+f39sZ2YmC3pXAAAAA3RSTlMAAQIDPL0wAAAA+klEQVRIx+3NBxLCQBAAwz0h7f//b897wSg4R2fyhggZgBf2cHES3s7fAW2ljr2sXff8F8E3mMm3mMm3mMm3mMm3mMm3mMm3mMm3mMm3mMm3mMm3mMm3mMm3mMm3mP1YLlXDiS2S5zsfYg4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4g4h48WjEwAABqyQ5j9f4L0/p8i3mMm3mMm3mMm3mMm3mMm3mMm3mMm3mMm3mMm3mMm3mMm3mMm3mMm3mMm3mMm3mMm3mN/Vs4kE82f42n8A253WbWz3/wEAAAAASUVORKCYII=')] bg-repeat opacity-[0.08] pointer-events-none z-10"></span>
              <span className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_180deg_at_50%_50%,rgba(255,255,255,0)_0%,rgba(255,255,255,0.2)_5%,rgba(255,255,255,0.4)_7%,rgba(255,255,255,0.2)_10%,rgba(255,255,255,0)_35%,rgba(255,255,255,0)_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-[spin_4s_linear_infinite] pointer-events-none z-0"></span>
            </TactileButton>
        </HolographicTooltip>
      </div>
    </div>
  );
};

export default React.memo(TaskItem);