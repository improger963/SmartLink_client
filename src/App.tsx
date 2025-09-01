
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router/index.tsx';
import { SettingsProvider } from './contexts/SettingsContext.tsx';
import { PerformanceProvider } from './contexts/PerformanceContext.tsx';
import { TransitionProvider } from './contexts/TransitionContext.tsx';

const App: React.FC = () => {
    return (
        <SettingsProvider>
            <PerformanceProvider>
                <TransitionProvider>
                    <RouterProvider router={router} />
                </TransitionProvider>
            </PerformanceProvider>
        </SettingsProvider>
    );
};

export default App;