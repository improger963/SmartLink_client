import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="w-full flex items-center justify-between p-6">
            <div>
                 {/* Can be used for breadcrumbs or page titles */}
            </div>
             <div className="hidden lg:flex items-center justify-center w-[468px] h-[60px] bg-stone-900/60 border-2 border-dashed border-stone-700/80 rounded-lg">
                <span className="text-stone-500 text-sm font-medium">Место для баннера 468x60</span>
            </div>
        </header>
    );
};

export default Header;
