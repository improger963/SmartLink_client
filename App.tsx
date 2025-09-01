
import React, { useState, useTransition, useCallback, memo, CSSProperties, useEffect, useMemo } from 'react';
import { Task, ParallaxInput } from './types.ts';
import TaskItem from './components/TaskItem.tsx';
import { CloudIcon, ServerIcon, DollarSignIcon, CodeIcon, SunIcon, InfoIcon, UsersIcon, HelpCircleIcon, SettingsIcon } from './components/icons.tsx';
import HolographicTooltip from './components/HolographicTooltip.tsx';
import AdCarousel from './components/AdCarousel.tsx';
import PromoCarousel, { PromoSlide } from './components/PromoCarousel.tsx';
import CosmicBackground from './components/CosmicBackground.tsx';
import Navigation, { View } from './components/Navigation.tsx';
import PlaceholderView from './components/PlaceholderView.tsx';
import TactileButton from './components/TactileButton.tsx';
import { SettingsProvider, useSettings } from './contexts/SettingsContext.tsx';
import SettingsPanel from './components/SettingsPanel.tsx';
import { TransitionProvider, useTransitionEffects } from './contexts/TransitionContext.tsx';
import StartupTransition from './components/StartupTransition.tsx';
import { PerformanceProvider } from './contexts/PerformanceContext.tsx';
import AnimatedBalance from './components/AnimatedBalance.tsx';
import HolographicGrid from './components/HolographicGrid.tsx';


const tasksData: Task[] = [
  {
    id: 1,
    icon: CloudIcon,
    iconColorClass: "stroke-primary",
    iconBgColorClass: "bg-primary-10",
    title: "Экономическая игра «Фермер»",
    meta: "Переходов: 14",
    buttonText: "Рекомендую",
  },
  {
    id: 2,
    icon: ServerIcon,
    iconColorClass: "stroke-primary",
    iconBgColorClass: "bg-primary-10",
    title: "Мы не являемся буксом, но предоставляем аналогичны",
    meta: "Переходов: 30",
    buttonText: "Заходи",
  },
  {
    id: 3,
    icon: DollarSignIcon,
    iconColorClass: "stroke-primary",
    iconBgColorClass: "bg-primary-10",
    title: "+ 7000 рублей каждый день!",
    meta: "Переходов: 19",
    buttonText: "Заработок",
  },
  {
    id: 4,
    icon: CodeIcon,
    iconColorClass: "stroke-primary",
    iconBgColorClass: "bg-primary-10",
    title: "1 КЛИК = 50 РУБЛЕЙ",
    meta: "Переходов: 24",
    buttonText: "Розыгрыш",
  },
  {
    id: 5,
    icon: SunIcon,
    iconColorClass: "stroke-primary",
    iconBgColorClass: "bg-primary-10",
    title: "Майнинг Solana",
    meta: "Переходов: 27",
    buttonText: "$жми$",
  },
];

const adsData = [
  { src: "https://i.ibb.co/3s6K8vT/Redbux-Banner.png", alt: "REDBUX Banner" },
  { src: "https://i.ibb.co/L5gqX1J/Surfoi-Banner.png", alt: "SURFOI Banner" },
];

const promoSlidesData: PromoSlide[] = [
    {
      title: "Присоединяйтесь к тысячам пользователей",
      subtitle: "Начните зарабатывать на проверенных заданиях уже сегодня.",
      buttonText: "Начать сейчас",
      buttonTooltip: "Начать зарабатывать"
    },
    {
      title: "Приглашайте друзей — получайте бонусы",
      subtitle: "Получайте 15% от заработка ваших рефералов пожизненно.",
      buttonText: "Узнать больше",
      buttonTooltip: "Подробнее о реферальной программе"
    },
    {
      title: "Моментальные выплаты",
      subtitle: "Выводите заработанные средства в любое время без комиссий.",
      buttonText: "К выплатам",
      buttonTooltip: "Перейти на страницу выплат"
    }
];

const usefulLinksData = [
    { icon: InfoIcon, text: 'Новости проекта', href: '#' },
    { icon: UsersIcon, text: 'Наша группа VK', href: '#', animationClass: 'icon-jiggle-on-hover' },
    { icon: HelpCircleIcon, text: 'Техническая поддержка', href: '#' },
    { icon: InfoIcon, text: 'Правила сервиса', href: '#' },
];


const DevTools: React.FC<{ onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void; className?: string; style?: React.CSSProperties; }> = memo(({ onMouseMove, className, style }) => {
    const { triggerHyperspace, triggerAchievement } = useTransitionEffects();
    const { theme, setTheme } = useSettings();

    const handleThemeToggle = useCallback(() => {
        document.body.classList.add('red-alert-transition');
        setTheme(theme === 'red-alert' ? null : 'red-alert');
        setTimeout(() => {
            document.body.classList.remove('red-alert-transition');
        }, 500); // Duration of the flash animation
    }, [theme, setTheme]);

    return (
        <div
            className={`premium-glass interactive-card bg-stone-900/80 border border-stone-800 rounded-2xl p-6 texture-carbon-fiber ${className}`}
            style={style}
            onMouseMove={onMouseMove}
        >
            <h3 className="text-lg font-semibold text-stone-200 mb-4">Dev Tools</h3>
            <div className="space-y-3 flex flex-col">
                <TactileButton onClick={triggerHyperspace} className="text-sm font-semibold bg-stone-800/80 text-stone-300 border border-stone-700 rounded-lg px-4 py-2 hover:bg-stone-700/80 hover:text-white">
                   Trigger Hyperspace
                </TactileButton>
                <TactileButton onClick={() => triggerAchievement({ title: 'Системный Интегратор', description: 'Вы успешно вошли в систему' })} className="text-sm font-semibold bg-stone-800/80 text-stone-300 border border-stone-700 rounded-lg px-4 py-2 hover:bg-stone-700/80 hover:text-white">
                   Unlock Achievement
                </TactileButton>
                <TactileButton onClick={handleThemeToggle} className="text-sm font-semibold bg-stone-800/80 text-stone-300 border border-stone-700 rounded-lg px-4 py-2 hover:bg-stone-700/80 hover:text-white">
                   Toggle '{theme === 'red-alert' ? 'Normal' : 'Red Alert'}' Theme
                </TactileButton>
            </div>
        </div>
    );
});


const DashboardView: React.FC = memo(() => {
    const handleCardMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    }, []);
    const { triggerHyperspace } = useTransitionEffects();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            <main className="lg:col-span-3 xl:col-span-4 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="dashboard-title font-bold text-stone-100 animate-fade-in-up animate-neon-pulse" style={{ animationDelay: '100ms' }}>Панель Возможностей</h1>
                    <PromoCarousel
                        slides={promoSlidesData}
                        className="animate-fade-in-up texture-hexagon"
                        style={{ animationDelay: '200ms' }}
                    />
                </div>
                <div className="flex flex-col gap-4">
                    {tasksData.map((task, index) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            className="animate-fade-in-up"
                            style={{ animationDelay: `${300 + index * 100}ms` }}
                        />
                    ))}
                </div>
            </main>
            <aside className="lg:col-span-1 xl:col-span-1 flex flex-col gap-8">
                <div
                    className="premium-glass interactive-card bg-stone-900/80 border border-stone-800 rounded-2xl p-6 animate-fade-in-up"
                    style={{ animationDelay: '300ms' }}
                    onMouseMove={handleCardMouseMove}
                >
                    <div className="text-center mb-6">
                        <AnimatedBalance value={900} />
                        <div className="text-stone-400 text-sm">Текущий баланс</div>
                    </div>
                    <HolographicTooltip tooltipText="Перейти к выплатам">
                        <TactileButton onClick={triggerHyperspace} className="w-full material-metallic relative overflow-hidden border-none rounded-lg px-6 py-3 font-semibold cursor-pointer transition-all duration-300 ease-in-out text-base whitespace-nowrap bg-primary text-stone-950 shadow-primary-md hover:-translate-y-0.5 hover-shadow-primary-xl hover:brightness-110">
                            Вывести средства
                        </TactileButton>
                    </HolographicTooltip>
                </div>
                <div
                    className="premium-glass interactive-card bg-stone-900/80 border border-stone-800 rounded-2xl p-6 animate-fade-in-up"
                    style={{ animationDelay: '400ms' }}
                    onMouseMove={handleCardMouseMove}
                >
                    <h3 className="text-lg font-semibold text-stone-200 mb-4">Полезные ссылки</h3>
                    <ul className="space-y-3">
                        {usefulLinksData.map((link, index) => (
                            <li key={index}>
                                <a href={link.href} className="group flex items-center text-stone-400 hover:text-primary transition-colors duration-200">
                                    <link.icon className={`w-5 h-5 mr-3 shrink-0 text-stone-500 group-hover-stroke-primary transition-colors duration-200 ${link.animationClass ?? ''}`} />
                                    <span className="font-medium text-sm">{link.text}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                 <AdCarousel
                    items={adsData}
                    className="animate-fade-in-up"
                    style={{ animationDelay: '500ms' }}
                    onMouseMove={handleCardMouseMove}
                />
                <DevTools
                  className="animate-fade-in-up"
                  style={{ animationDelay: '600ms' }}
                  onMouseMove={handleCardMouseMove}
                />
            </aside>
        </div>
    );
});

interface MousePos {
  x: number;
  y: number;
}

const AppContent: React.FC = () => {
    const [activeView, setActiveView] = useState<View>('dashboard');
    const [displayedView, setDisplayedView] = useState<View>(activeView);
    const [isExiting, setIsExiting] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { triggerHyperspace } = useTransitionEffects();
    const { setViewTheme } = useSettings();

    // --- Advanced Parallax States ---
    const [mousePos, setMousePos] = useState<MousePos>({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    const [orientation, setOrientation] = useState<{ beta: number | null; gamma: number | null }>({ beta: null, gamma: null });

    // --- Gyroscope Event Listener ---
    useEffect(() => {
        const handleOrientation = (event: DeviceOrientationEvent) => {
            // event.beta: front-to-back tilt (-180 to 180)
            // event.gamma: left-to-right tilt (-90 to 90)
            if (event.beta !== null && event.gamma !== null) {
                setOrientation({ beta: event.beta, gamma: event.gamma });
            }
        };
        window.addEventListener('deviceorientation', handleOrientation);
        return () => window.removeEventListener('deviceorientation', handleOrientation);
    }, []);

    const parallaxInput = useMemo<ParallaxInput>(() => {
        const hasGyro = orientation.beta !== null && orientation.gamma !== null;
        const halfWidth = window.innerWidth / 2;
        const halfHeight = window.innerHeight / 2;

        if (hasGyro) {
            // Use gyroscope data on mobile
            // Normalize gamma (-90 to 90) -> (-1 to 1) for x-axis
            const normalizedX = Math.max(-1, Math.min(1, (orientation.gamma ?? 0) / 45)); 
            // Normalize beta (-180 to 180) -> (-1 to 1) for y-axis. We'll cap it.
            const normalizedY = Math.max(-1, Math.min(1, (orientation.beta ?? 90 - 90) / 45)); 
            return { x: normalizedX, y: normalizedY };
        } else {
            // Use mouse data on desktop
            const normalizedX = (mousePos.x - halfWidth) / halfWidth;
            const normalizedY = (mousePos.y - halfHeight) / halfHeight;
            return { x: normalizedX, y: normalizedY };
        }
    }, [mousePos, orientation]);


    const handleNavigate = useCallback((view: View) => {
        if (view === activeView) return;
        
        setViewTheme(view); // Context-aware theme change

        setIsExiting(true);
        setTimeout(() => {
            startTransition(() => {
                setActiveView(view);
                setDisplayedView(view);
                setIsExiting(false);
            });
        }, 400); // Match animation duration
    }, [activeView, startTransition, setViewTheme]);
    
    const handleCloseSettings = useCallback(() => {
        setIsSettingsOpen(false);
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        setMousePos({ x: e.clientX, y: e.clientY });
    };

    const renderView = () => {
        switch (displayedView) {
            case 'dashboard':
                return <DashboardView />;
            case 'my-ads':
                return <PlaceholderView title="Моя реклама" />;
            case 'monitoring':
                return <PlaceholderView title="Мониторинг" />;
            case 'contacts':
                return <PlaceholderView title="Контакты" />;
            default:
                return <DashboardView />;
        }
    };
    
    const viewContainerClass = `view-container ${isExiting ? 'exiting' : 'entering'}`;

    return (
        <div 
          className="relative min-h-screen bg-stone-950 text-stone-200 overflow-x-hidden"
          onMouseMove={handleMouseMove}
        >
            <StartupTransition />
            
            {/* Background & Lighting Layers */}
            <div id="global-light-source" style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }} />
            <CosmicBackground parallaxInput={parallaxInput} />
            <HolographicGrid parallaxInput={parallaxInput} />
            
            <div className="relative z-10 mx-auto page-padding perspective-container pb-24 md:pb-0">
                <header className="col-span-full flex justify-between items-center border-b border-stone-800/50 py-4">
                    <div className="text-4xl font-extrabold text-white text-shadow-header animate-float-jitter">
                        SmartLink
                    </div>
                     <div className='flex items-center gap-4'>
                        <div className="hidden lg:flex items-center justify-center w-[468px] h-[60px] bg-stone-900/60 border-2 border-dashed border-stone-700/80 rounded-lg">
                            <span className="text-stone-500 text-sm font-medium">Место для баннера 468x60</span>
                        </div>
                        <HolographicTooltip tooltipText="Настройки интерфейса">
                           <button 
                             onClick={() => setIsSettingsOpen(true)}
                             className="group p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                             aria-label="Открыть настройки интерфейса"
                           >
                               <SettingsIcon className="w-6 h-6 icon-jiggle-on-hover" />
                           </button>
                        </HolographicTooltip>
                    </div>
                </header>

                {/* Desktop Navigation */}
                <div className="hidden md:block w-full my-6 animate-fade-in-up" style={{ animationDelay: '50ms' }}>
                   <Navigation activeView={activeView} onNavigate={handleNavigate} />
                </div>
                
                {activeView === 'dashboard' && (
                    <div 
                        className="premium-glass bg-stone-900/80 border border-stone-800 rounded-2xl p-4 mb-8 animate-fade-in-up"
                        style={{ animationDelay: '150ms' }}
                    >
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                            <h3 className="text-base font-semibold text-stone-200">Следующее действие</h3>
                        </div>
                        <div className="flex items-center gap-3">
                            <HolographicTooltip tooltipText="Перейти к выплатам">
                                <TactileButton onClick={triggerHyperspace} className="text-sm font-semibold bg-stone-800/80 text-stone-300 border border-stone-700 rounded-lg px-4 py-2 hover:bg-stone-700/80 hover:text-white">Вывести средства</TactileButton>
                            </HolographicTooltip>
                            <HolographicTooltip tooltipText="Узнать о реферальной программе">
                                 <TactileButton onClick={triggerHyperspace} className="text-sm font-semibold bg-stone-800/80 text-stone-300 border border-stone-700 rounded-lg px-4 py-2 hover:bg-stone-700/80 hover:text-white">Пригласить друга</TactileButton>
                            </HolographicTooltip>
                        </div>
                      </div>
                    </div>
                )}

                <div key={displayedView} className={viewContainerClass}>
                    {renderView()}
                </div>

                <footer className="col-span-full text-center text-stone-400 text-sm pt-6 mt-8 border-t border-stone-800/50">
                    Copyright © 2024. Все права защищены.
                </footer>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-20 animate-fade-in-up" style={{ animationDelay: '50ms' }}>
                <Navigation activeView={activeView} onNavigate={handleNavigate} />
            </div>

            <SettingsPanel isOpen={isSettingsOpen} onClose={handleCloseSettings} />
        </div>
    );
};


const App: React.FC = () => {
    return (
        <SettingsProvider>
            <PerformanceProvider>
                <TransitionProvider>
                    <AppContent />
                </TransitionProvider>
            </PerformanceProvider>
        </SettingsProvider>
    );
};


export default App;