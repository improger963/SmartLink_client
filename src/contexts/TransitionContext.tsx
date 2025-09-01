

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
    triggerBalanceUpdate: (amount: number) => void;
    balanceUpdate: { key: number; amount: number };
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export const TransitionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isHyperspaceActive, setIsHyperspaceActive] = useState(false);
    const [activeAchievement, setActiveAchievement] = useState<Achievement | null>(null);
    const [balanceUpdate, setBalanceUpdate] = useState({ key: 0, amount: 0 });

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

    const triggerBalanceUpdate = useCallback((amount: number) => {
        if (amount > 0) {
            setBalanceUpdate(prev => ({ key: prev.key + 1, amount }));
        }
    }, []);

    return (
        <TransitionContext.Provider value={{ triggerHyperspace, triggerAchievement, triggerPulse, triggerBalanceUpdate, balanceUpdate }}>
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
