
import React, { useEffect, useState } from 'react';
import { Achievement } from '../contexts/TransitionContext.tsx';

interface AchievementUnlockedProps {
    achievement: Achievement | null;
}

const AchievementUnlocked: React.FC<AchievementUnlockedProps> = ({ achievement }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (achievement) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 3800); // Must be slightly less than the parent timeout to allow fade-out
            return () => clearTimeout(timer);
        }
    }, [achievement]);

    if (!achievement) {
        return null;
    }

    const containerClasses = `
        fixed inset-0 z-[20000] flex flex-col items-center justify-center 
        transition-opacity duration-500
        ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
    `;

    return (
        <div className={containerClasses} aria-live="polite" aria-atomic="true">
            <div 
                className="absolute inset-0 bg-gradient-to-r from-sky-900 via-indigo-900 to-purple-900"
                style={{
                    backgroundSize: '400% 400%',
                    animation: 'achievement-aurora 15s ease infinite',
                }}
            ></div>
            <div className="relative text-center p-8">
                <h2 
                    className="text-5xl md:text-7xl font-extrabold text-white uppercase tracking-widest"
                    style={{ animation: 'achievement-text-flicker 3s linear infinite' }}
                >
                    {achievement.title}
                </h2>
                <p className="mt-4 text-lg md:text-xl text-stone-300 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                    {achievement.description}
                </p>
            </div>
        </div>
    );
};

export default AchievementUnlocked;
