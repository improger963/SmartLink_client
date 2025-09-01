import React, { useEffect, useRef } from 'react';

interface MousePos {
    x: number;
    y: number;
}

interface HolographicGridProps {
    mousePos: MousePos;
}

const HolographicGrid: React.FC<HolographicGridProps> = ({ mousePos }) => {
    const gridRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (!gridRef.current) return;
        const { x, y } = mousePos;
        const halfWidth = window.innerWidth / 2;
        const halfHeight = window.innerHeight / 2;
        
        // Using a CSS variable for depth for consistency with the CSS file
        const depth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--parallax-depth-3'));

        const offsetX = (x - halfWidth) / halfWidth * depth;
        const offsetY = (y - halfHeight) / halfHeight * depth;

        gridRef.current.style.transform = `translate3d(${-offsetX}px, ${-offsetY}px, 0)`;

    }, [mousePos]);

    return <div 
        id="holographic-grid-layer"
        ref={gridRef}
        className="parallax-layer"
        style={{
            backgroundImage: `
                linear-gradient(var(--color-primary-border) 1px, transparent 1px),
                linear-gradient(to right, var(--color-primary-border) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            opacity: 0.1,
            maskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black 40%, transparent 100%)',
            animation: `scroll-grid calc(5s * var(--speed-multiplier)) linear infinite`
        }} 
    />;
};

// Keyframes for the animation need to be in the main CSS file to access the speed-multiplier variable.
// I've added a fallback here just in case, but the main definition is in index.html
const keyframes = `
  @keyframes scroll-grid {
    from { background-position: 0 0; }
    to { background-position: 0 -100px; }
  }
`;

// Inject keyframes into the document head
if (typeof window !== 'undefined') {
    const styleSheet = document.styleSheets[0];
    try {
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
    } catch (e) {
        // This might fail in some environments (e.g. if the stylesheet is cross-origin)
        // or if the rule already exists. We can safely ignore these errors.
    }
}


export default React.memo(HolographicGrid);