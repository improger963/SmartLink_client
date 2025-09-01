import React, { useState, useEffect } from 'react';

const StartupTransition: React.FC = () => {
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const contentTimer = setTimeout(() => setShowContent(true), 100);
        const fadeOutTimer = setTimeout(() => setIsFadingOut(true), 2800);
        const finishTimer = setTimeout(() => setIsFinished(true), 3500);

        return () => {
            clearTimeout(contentTimer);
            clearTimeout(fadeOutTimer);
            clearTimeout(finishTimer);
        };
    }, []);

    if (isFinished) {
        return null;
    }

    const containerClasses = `
        fixed inset-0 z-[30000] bg-[#0c0a09] flex items-center justify-center
        transition-opacity duration-700
        ${isFadingOut ? 'opacity-0' : 'opacity-100'}
        ${!showContent ? 'opacity-0' : 'opacity-100'}
    `;

    return (
        <div className={containerClasses}>
            <svg viewBox="0 0 400 400" className="w-64 h-64 text-primary">
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <g fill="none" stroke="currentColor" strokeWidth="2" filter="url(#glow)">
                    {/* Center scaling element */}
                    <g style={{ animation: 'startup-center-scale 1s cubic-bezier(0.22, 1, 0.36, 1) 0.2s forwards', opacity: 0 }}>
                        <circle cx="200" cy="200" r="30" />
                        <path d="M200,170 V150 M200,230 V250 M170,200 H150 M230,200 H250" />
                    </g>
                    
                    {/* Rotating elements */}
                    <g style={{ transformOrigin: 'center', animation: 'spin 10s linear infinite' }}>
                        <circle cx="200" cy="200" r="60" strokeDasharray="5 10" style={{ strokeDasharray: 377, strokeDashoffset: 377, animation: 'startup-svg-draw 1.5s ease-out 0.5s forwards' }} />
                        <circle cx="200" cy="200" r="90" style={{ strokeDasharray: 565, strokeDashoffset: 565, animation: 'startup-svg-draw 2s ease-out 0.8s forwards' }} />
                    </g>

                    {/* Outer unfolding elements */}
                    {[0, 90, 180, 270].map(angle => (
                        <path
                            key={angle}
                            d="M100,110 V20 H20 V110"
                            transform={`rotate(${angle} 200 200)`}
                            style={{ 
                                strokeDasharray: 270, 
                                strokeDashoffset: 270, 
                                animation: 'startup-svg-draw 1.2s ease-in-out 1.2s forwards' 
                            }}
                        />
                    ))}

                    {/* HUD flicker text */}
                    <text x="140" y="380" fill="currentColor" fontSize="12" style={{ opacity: 0, animation: 'startup-hud-flicker 1s steps(2, start) 1.8s infinite' }}>
                        SYSTEM BOOT...
                    </text>
                </g>
            </svg>
        </div>
    );
};

export default StartupTransition;
