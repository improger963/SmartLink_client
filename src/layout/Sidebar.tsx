import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    HomeIcon,
    GlobeIcon,
    MegaphoneIcon,
    WalletIcon,
    MessageSquareIcon,
    NewspaperIcon,
    StarIcon,
    TicketIcon,
    UserCircleIcon,
} from '../components/icons.tsx';

const navLinks = [
    { to: '/', text: 'Главная', icon: HomeIcon },
    { to: '/sites', text: 'Управление сайтами', icon: GlobeIcon },
    { to: '/campaigns', text: 'Рекламные кампании', icon: MegaphoneIcon },
    { to: '/balance', text: 'Финансы', icon: WalletIcon },
    { to: '/chat', text: 'Чат', icon: MessageSquareIcon },
    { to: '/news', text: 'Новости', icon: NewspaperIcon },
    { to: '/reviews', text: 'Отзывы', icon: StarIcon },
    { to: '/tickets', text: 'Поддержка', icon: TicketIcon },
    { to: '/profile', text: 'Профиль', icon: UserCircleIcon },
];

const Sidebar: React.FC = () => {
    return (
        <aside className="w-64 flex-shrink-0 bg-stone-900/80 border-r border-stone-800/50 flex flex-col">
            <div className="p-6 border-b border-stone-800/50">
                 <div className="text-4xl font-extrabold text-white text-shadow-header animate-float-jitter">
                    <span className="logo-shimmer">SmartLink</span>
                </div>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {navLinks.map(({ to, text, icon: Icon }) => (
                     <NavLink
                        key={to}
                        to={to}
                        end // Use `end` for the home link to prevent it from matching every route
                        className={({ isActive }) =>
                            `sidebar-link flex items-center px-4 py-3 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                                isActive 
                                ? 'active' 
                                : 'text-stone-400 hover:bg-stone-800/50 hover:text-stone-200'
                            }`
                        }
                    >
                        <Icon className="w-5 h-5 mr-4" />
                        <span>{text}</span>
                    </NavLink>
                ))}
            </nav>
            <div className="p-6 border-t border-stone-800/50">
                <NavLink to="/login" className="w-full text-center text-sm font-semibold bg-stone-800/80 text-stone-300 border border-stone-700 rounded-lg px-4 py-2 block hover:bg-stone-700/80 hover:text-white">
                    Выход
                </NavLink>
            </div>
        </aside>
    );
};

export default Sidebar;
