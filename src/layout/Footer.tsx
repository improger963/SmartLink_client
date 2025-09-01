import React, { useState, useEffect, useMemo } from 'react';

const Footer: React.FC = () => {
    const [statusText, setStatusText] = useState('All systems nominal.');
    const statusMessages = useMemo(() => [
        'All systems nominal.',
        'Quantum link stable.',
        'Data stream optimal.',
        'Awaiting user input.',
        'Heuristics matrix aligned.',
    ], []);

    useEffect(() => {
        const interval = setInterval(() => {
            setStatusText(prev => {
                const currentIndex = statusMessages.indexOf(prev);
                const nextIndex = (currentIndex + 1) % statusMessages.length;
                return statusMessages[nextIndex];
            });
        }, 5000);
        return () => clearInterval(interval);
    }, [statusMessages]);

    return (
        <footer className="w-full flex justify-between items-center text-stone-400 text-sm p-6 mt-8 border-t border-stone-800/50">
            <div>Copyright © 2024. Все права защищены.</div>
            <div className="hidden md:flex items-center">
                <span className="status-indicator"></span>
                <span key={statusText} className="animate-fade-in text-stone-500 font-mono text-xs">{statusText}</span>
            </div>
        </footer>
    );
};

export default Footer;
