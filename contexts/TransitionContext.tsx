
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import HyperspaceEffect from '../components/HyperspaceEffect.tsx';
import AchievementUnlocked from '../components/AchievementUnlocked.tsx';

export interface Achievement {
    title: string;
    description: string;
}

type PulseType = 'positive' | 'negative';

interface TransitionContextType {
    triggerHyperspace: () => void;
    triggerAchievement: (achievement: Achievement) => void;
    triggerPulse: (type: PulseType) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export const TransitionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isHyperspaceActive, setIsHyperspaceActive] = useState(false);
    const [activeAchievement, setActiveAchievement] = useState<Achievement | null>(null);

    const triggerHyperspace = useCallback(() => {
        if (isHyperspaceActive) return;
        setIsHyperspaceActive(true);
        setTimeout(() => {
            setIsHyperspaceActive(false);
        }, 1500); // Duration of the effect
    }, [isHyperspaceActive]);

    const triggerAchievement = useCallback((achievement: Achievement) => {
        if (activeAchievement) return;
        setActiveAchievement(achievement);
        setTimeout(() => {
            setActiveAchievement(null);
        }, 4000); // Duration of the achievement screen
    }, [activeAchievement]);
    
    const triggerPulse = useCallback((type: PulseType) => {
        const className = `body-pulse-${type}`;
        document.body.classList.add(className);
        setTimeout(() => {
            document.body.classList.remove(className);
        }, 800); // Duration of the pulse animation in index.html
    }, []);

    return (
        <TransitionContext.Provider value={{ triggerHyperspace, triggerAchievement, triggerPulse }}>
            {children}
            <HyperspaceEffect isActive={isHyperspaceActive} />
            <AchievementUnlocked achievement={activeAchievement} />
        </TransitionContext.Provider>
    );
};

export const useTransitionEffects = (): TransitionContextType => {
    const context = useContext(TransitionContext);
    if (context === undefined) {
        throw new Error('useTransitionEffects must be used within a TransitionProvider');
    }
    return context;
};