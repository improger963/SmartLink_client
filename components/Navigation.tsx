import React, { useRef, useState, useLayoutEffect } from 'react';

export type View = 'dashboard' | 'my-ads' | 'monitoring' | 'contacts';

interface NavItem {
  id: View;
  label: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Главная' },
  { id: 'my-ads', label: 'Моя реклама' },
  { id: 'monitoring', label: 'Мониторинг' },
  { id: 'contacts', label: 'Контакты' },
];

interface NavigationProps {
  activeView: View;
  onNavigate: (view: View) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeView, onNavigate }) => {
  const navRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  useLayoutEffect(() => {
    const navNode = navRef.current;
    if (!navNode) return;

    const activeItem = navNode.querySelector(`[data-viewid="${activeView}"]`) as HTMLElement;
    if (activeItem) {
      setIndicatorStyle({
        left: `${activeItem.offsetLeft}px`,
        width: `${activeItem.offsetWidth}px`,
      });
    }
  }, [activeView]);

  return (
    <nav 
        ref={navRef}
        className="relative flex items-center justify-center gap-2 sm:gap-4 p-2 bg-stone-900/80 border border-stone-800 rounded-full max-w-max mx-auto"
    >
      <div 
        className="absolute top-2 bottom-2 bg-stone-700/50 rounded-full transition-all duration-300 ease-in-out"
        style={indicatorStyle}
      />
      {navItems.map((item) => (
        <a
          key={item.id}
          href="#"
          data-viewid={item.id}
          onClick={(e) => {
            e.preventDefault();
            onNavigate(item.id);
          }}
          className={`relative z-10 font-semibold transition-colors duration-300 py-2 px-5 rounded-full text-sm sm:text-base ${
            activeView === item.id ? 'text-stone-100' : 'text-stone-400 hover:text-white'
          }`}
          aria-current={activeView === item.id ? 'page' : undefined}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
};

export default React.memo(Navigation);