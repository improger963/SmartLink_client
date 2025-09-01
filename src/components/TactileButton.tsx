import React from 'react';

// FIX: Added `onClick` prop to support click events, resolving an error in SettingsPanel.tsx.
const TactileButton: React.FC<{ 
  children: React.ReactNode, 
  className?: string, 
  onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void,
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void 
}> = ({ children, className = '', onMouseDown, onClick }) => {
  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const rect = button.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add("ripple");
    
    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) {
        ripple.remove();
    }
    
    button.appendChild(circle);
    if(onMouseDown) onMouseDown(event);
  };

  return (
    <button className={`tactile-button ${className}`} onMouseDown={createRipple} onClick={onClick}>
      {children}
    </button>
  );
};

export default React.memo(TactileButton);
