
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { usePerformance } from '../contexts/PerformanceContext.tsx';

interface HyperspaceEffectProps {
    isActive: boolean;
}

const HyperspaceEffect: React.FC<HyperspaceEffectProps> = ({ isActive }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const { tier } = usePerformance();

    const numStars = useMemo(() => {
        switch (tier) {
            case 'low': return 250;
            case 'medium': return 500;
            case 'high':
            default: return 1000;
        }
    }, [tier]);

    useEffect(() => {
        if (isActive) {
            setIsVisible(true);
        } else if (isVisible) {
            // Start fade out but keep component mounted for animation
            const timer = setTimeout(() => setIsVisible(false), 500);
            return () => clearTimeout(timer);
        }
    }, [isActive, isVisible]);
    
    useEffect(() => {
        if (!isVisible) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim();

        const stars = Array.from({ length: numStars }, () => ({
            x: (Math.random() - 0.5) * width * 2,
            y: (Math.random() - 0.5) * height * 2,
            z: Math.random() * width,
            pz: Math.random() * width,
        }));

        const speed = 15;
        let animationFrameId: number;

        const animate = () => {
            if (!ctx) return;
            
            ctx.fillStyle = 'rgba(12, 10, 9, 0.2)'; // Faint trail effect
            ctx.fillRect(0, 0, width, height);
            
            ctx.save();
            ctx.translate(width / 2, height / 2);

            stars.forEach(star => {
                star.z -= speed;
                if (star.z <= 0) {
                    star.x = (Math.random() - 0.5) * width * 2;
                    star.y = (Math.random() - 0.5) * height * 2;
                    star.z = width;
                    star.pz = width;
                }

                const sx = (star.x / star.z) * width;
                const sy = (star.y / star.z) * height;

                const psx = (star.x / star.pz) * width;
                const psy = (star.y / star.pz) * height;

                const radius = (1 - star.z / width) * 2;

                ctx.beginPath();
                ctx.moveTo(psx, psy);
                ctx.lineTo(sx, sy);
                ctx.lineWidth = radius;
                ctx.strokeStyle = primaryColor;
                ctx.stroke();

                star.pz = star.z;
            });
            
            ctx.restore();
            animationFrameId = requestAnimationFrame(animate);
        };
        
        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [isVisible, numStars]);
    
    const containerClasses = `
        fixed inset-0 z-[20000] bg-stone-950
        transition-opacity duration-500
        ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}
    `;

    if(!isVisible) return null;

    return (
        <div className={containerClasses}>
            <canvas ref={canvasRef} className="w-full h-full" />
        </div>
    );
};

export default React.memo(HyperspaceEffect);