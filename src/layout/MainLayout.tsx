import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.tsx';
import Header from './Header.tsx';
import Footer from './Footer.tsx';

const MainLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-stone-950 text-stone-200 flex">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                {/* The main content area where pages will be rendered */}
                <main className="flex-1 flex flex-col">
                    {/* Header can go here if it's part of the scrollable content */}
                    {/* <Header /> */}
                    <Outlet />
                </main>
                 {/* Footer can go here if it should be at the bottom of the content */}
                 {/* <Footer /> */}
            </div>
        </div>
    );
};

export default MainLayout;
