import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

interface HolographicTooltipProps {
  // FIX: Explicitly type children's props as `any` to allow cloning with event handlers.
  // This resolves TypeScript errors about unknown properties on the child element.
  children: React.ReactElement<any>;
  tooltipText: string;
}

const HolographicTooltip: React.FC<HolographicTooltipProps> = ({ children, tooltipText }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [opacity, setOpacity] = useState(0);

  const handleMouseEnter = (event: React.MouseEvent) => {
    children.props.onMouseEnter?.(event);
    setIsVisible(true);
    // Use timeout to allow CSS transition to play
    setTimeout(() => setOpacity(1), 10);
  };

  const handleMouseLeave = (event: React.MouseEvent) => {
    children.props.onMouseLeave?.(event);
    setOpacity(0);
    // Remove from DOM after transition
    setTimeout(() => setIsVisible(false), 200); 
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    children.props.onMouseMove?.(event);
    if (!tooltipRef.current) {
        setPosition({ x: event.clientX, y: event.clientY });
        return;
    };

    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const tooltipWidth = tooltipRect.width;
    const tooltipHeight = tooltipRect.height;
    
    let x = event.clientX;
    let y = event.clientY;

    // Adjust to keep tooltip inside viewport
    if (x + tooltipWidth / 2 > window.innerWidth) {
        x = window.innerWidth - tooltipWidth / 2 - 10;
    }
    if (x - tooltipWidth / 2 < 0) {
        x = tooltipWidth / 2 + 10;
    }
    // Prioritize showing above the cursor
    if (y - tooltipHeight - 10 < 0) {
        y = event.clientY + 20; // Show below if no space above
    } else {
        y = event.clientY;
    }

    setPosition({ x, y });
  };
  
  // The original implementation had several issues:
  // 1. It tried to pass a `ref` to a functional component child, which is not allowed unless
  //    the component uses `React.forwardRef`. This caused the error.
  // 2. It used a `useEffect` with brittle logic, accessing private React properties (`_owner`)
  //    to get a DOM node, which is unsafe and can break between React versions.
  //
  // This revised implementation fixes these issues by using a more idiomatic React pattern:
  // - It uses `React.cloneElement` to add `onMouseEnter`, `onMouseLeave`, and `onMouseMove` props
  //   to the child element directly.
  // - This removes the need for `ref`s and the problematic `useEffect`.
  // - It preserves any existing mouse event handlers on the child by calling them within the new handlers.
  // - It's cleaner, safer, and correctly implements the desired functionality.

  const tooltip = isVisible ? createPortal(
    <div
      className="holographic-tooltip-portal"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        opacity: opacity,
      }}
    >
      <div className="holographic-tooltip-content" ref={tooltipRef}>
        {tooltipText}
      </div>
    </div>,
    document.body
  ) : null;
  
  return (
    <>
      {React.cloneElement(children, {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onMouseMove: handleMouseMove,
      })}
      {tooltip}
    </>
  );
};

export default HolographicTooltip;