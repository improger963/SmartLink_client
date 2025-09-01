
import React, { useRef, useEffect, useMemo, CSSProperties } from 'react';
import { usePerformance } from '../contexts/PerformanceContext.tsx';
import { ParallaxInput } from '../types.ts';

interface CosmicBackgroundProps {
    parallaxInput: ParallaxInput;
}

const CosmicBackground: React.FC<CosmicBackgroundProps> = ({ parallaxInput }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { tier } = usePerformance();
    const containerRef = useRef<HTMLDivElement>(null);

    const qualitySettings = useMemo(() => {
        switch (tier) {
            case 'low':
                return { particleCount: 50, nebulaCount: 2, enableNebulaRotation: false, cometCount: 1 };
            case 'medium':
                return { particleCount: 150, nebulaCount: 4, enableNebulaRotation: false, cometCount: 2 };
            case 'high':
            default:
                return { particleCount: 300, nebulaCount: 7, enableNebulaRotation: true, cometCount: 3 };
        }
    }, [tier]);
    
    useEffect(() => {
      if (!containerRef.current) return;
      const { x, y } = parallaxInput;
      
      // Using a CSS variable for depth for consistency with the CSS file
      const depth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--parallax-depth-1'));
      
      // The input is already normalized from -1 to 1.
      const offsetX = x * depth;
      const offsetY = y * depth;
      
      // Apply transform to the container, not the canvas, to avoid re-paints.
      // Negative offset makes it move away from the cursor/tilt direction.
      containerRef.current.style.transform = `translate3d(${-offsetX}px, ${-offsetY}px, 0)`;
      
    }, [parallaxInput]);


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        let animationFrameId: number;

        // --- Configuration ---
        const { particleCount, nebulaCount, enableNebulaRotation, cometCount } = qualitySettings;
        const COLOR_CYCLE_DURATION = 20 * 60 * 1000; // 20 minutes

        // --- Particles (formerly Stars) ---
        const particles = Array.from({ length: particleCount }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            z: Math.random() * width,
            vx: (Math.random() - 0.5) * 0.05,
            vy: (Math.random() - 0.5) * 0.05,
            size: Math.random() * 1.5 + 0.2,
            baseOpacity: Math.random() * 0.3 + 0.2,
            twinkleSpeed: Math.random() * 0.0005 + 0.0002,
            twinklePhase: Math.random() * Math.PI * 2,
        }));
        
        // --- Comets ---
        const comets = Array.from({ length: cometCount }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 4 + 2,
            vy: (Math.random() - 0.5) * 4 + 2,
            len: Math.random() * 100 + 50,
            opacity: Math.random() * 0.2 + 0.1,
            reset: function() {
                this.x = Math.random() * width;
                this.y = Math.random() * height * 2 - height;
                this.opacity = Math.random() * 0.2 + 0.1;
            }
        }));

        // --- Nebulas ---
        const nebulaColors = [
            { r: 10, g: 14, b: 23 },   // #0A0E17 - Base dark
            { r: 76, g: 29, b: 149 }, // Deep purple
            { r: 29, g: 78, b: 216 }, // Bright blue
            { r: 13, g: 24, b: 37 },  // #131825 - Other dark
            { r: 139, g: 92, b: 246 },// Light purple/violet
            { r: 21, g: 94, b: 117 }, // Teal
            { r: 99, g: 102, b: 241}, // Indigo
        ];
        
        const nebulas = Array.from({ length: nebulaCount }, () => ({
            x: Math.random() * width * 1.5 - width * 0.25,
            y: Math.random() * height * 1.5 - height * 0.25,
            radius: Math.random() * (width / 1.5) + (width / 3),
            vx: (Math.random() - 0.5) * 0.08,
            vy: (Math.random() - 0.5) * 0.08,
            colorIndex: Math.floor(Math.random() * nebulaColors.length),
            opacity: Math.random() * 0.1 + 0.1,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.0001
        }));
        
        const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t;

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            if(canvas) {
                canvas.width = width;
                canvas.height = height;
            }
        };
        
        window.addEventListener('resize', handleResize);

        const startTime = Date.now();

        const animate = () => {
            if (!ctx) return;
            // --- Background Gradient ---
            const bgGradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) / 1.5);
            bgGradient.addColorStop(0, '#131825');
            bgGradient.addColorStop(1, '#0A0E17');
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, width, height);

            const elapsedTime = Date.now() - startTime;
            const cycleProgress = (elapsedTime % COLOR_CYCLE_DURATION) / COLOR_CYCLE_DURATION;
            
            ctx.globalCompositeOperation = 'lighter';

            // --- Animate and Draw Nebulas ---
            nebulas.forEach(nebula => {
                nebula.x += nebula.vx;
                nebula.y += nebula.vy;

                if (enableNebulaRotation) {
                    nebula.rotation += nebula.rotationSpeed;
                }

                if (nebula.x - nebula.radius > width) nebula.x = -nebula.radius;
                if (nebula.x + nebula.radius < 0) nebula.x = width + nebula.radius;
                if (nebula.y - nebula.radius > height) nebula.y = -nebula.radius;
                if (nebula.y + nebula.radius < 0) nebula.y = height + nebula.radius;
                
                const c1 = nebulaColors[nebula.colorIndex];
                const c2 = nebulaColors[(nebula.colorIndex + 1) % nebulaColors.length];
                const r = Math.round(lerp(c1.r, c2.r, cycleProgress));
                const g = Math.round(lerp(c1.g, c2.g, cycleProgress));
                const b = Math.round(lerp(c1.b, c2.b, cycleProgress));
                
                ctx.save();
                ctx.translate(nebula.x, nebula.y);
                ctx.rotate(nebula.rotation);
                
                const nebulaGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, nebula.radius);
                nebulaGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${nebula.opacity})`);
                nebulaGradient.addColorStop(0.8, `rgba(${r}, ${g}, ${b}, 0)`);
                
                ctx.fillStyle = nebulaGradient;
                ctx.fillRect(-nebula.radius, -nebula.radius, nebula.radius * 2, nebula.radius * 2);
                ctx.restore();
            });
            
            ctx.globalCompositeOperation = 'source-over';

            // --- Animate and Draw Particles ---
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = width; if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;
                
                const twinkle = (Math.sin(p.twinklePhase + elapsedTime * p.twinkleSpeed) + 1) / 2;
                
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
                ctx.fillStyle = `rgba(200, 220, 255, ${p.baseOpacity * twinkle})`;
                ctx.fill();
            });
            
            // --- Animate and Draw Comets ---
            comets.forEach(comet => {
                comet.x += comet.vx;
                comet.y += comet.vy;
                if (comet.x > width || comet.y > height) {
                    comet.reset();
                }
                const gradient = ctx.createLinearGradient(comet.x, comet.y, comet.x - comet.vx * comet.len, comet.y - comet.vy * comet.len);
                gradient.addColorStop(0, `rgba(200, 220, 255, ${comet.opacity})`);
                gradient.addColorStop(1, 'rgba(200, 220, 255, 0)');
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(comet.x, comet.y);
                ctx.lineTo(comet.x - comet.vx * comet.len, comet.y - comet.vy * comet.len);
                ctx.stroke();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, [qualitySettings]);

    return (
        <div id="cosmic-background-layer" ref={containerRef} className="parallax-layer">
            <canvas ref={canvasRef} className="w-full h-full bg-[#0A0E17]" />
        </div>
    );
};

export default React.memo(CosmicBackground);
