import React from 'react';

interface PlaceholderViewProps {
  title: string;
}

const PlaceholderView: React.FC<PlaceholderViewProps> = ({ title }) => {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="premium-glass text-center bg-stone-900/80 border border-stone-800 rounded-2xl p-12">
        <h2 className="text-2xl font-bold text-stone-100 mb-2">{title}</h2>
        <p className="text-stone-400">Этот раздел находится в разработке.</p>
      </div>
    </div>
  );
};

export default React.memo(PlaceholderView);