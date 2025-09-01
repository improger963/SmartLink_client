
import React from 'react';
import { useSettings } from '../contexts/SettingsContext.tsx';
import { CloseIcon } from './icons.tsx';
import TactileButton from './TactileButton.tsx';

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SliderProps {
    id: keyof ReturnType<typeof useSettings>['settings'];
    label: string;
    minLabel: string;
    maxLabel: string;
}

const sliders: SliderProps[] = [
    { id: 'transparency', label: 'Прозрачность материалов', minLabel: 'Матовая', maxLabel: 'Стекло' },
    { id: 'depth', label: 'Глубина пространства', minLabel: 'Плоская', maxLabel: 'Глубокая' },
    { id: 'glow', label: 'Интенсивность свечения', minLabel: 'Тусклое', maxLabel: 'Яркое' },
    { id: 'speed', label: 'Скорость анимаций', minLabel: 'Медленно', maxLabel: 'Быстро' },
    { id: 'tactile', label: 'Тактильная отдача', minLabel: 'Мягкая', maxLabel: 'Четкая' },
    { id: 'temperature', label: 'Цветовая температура', minLabel: 'Холодная', maxLabel: 'Теплая' },
];

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
    const { settings, setSettings, resetSettings } = useSettings();

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: Number(value) }));
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
            style={{ animationDuration: '0.3s' }}
            onClick={onClose}
        >
            <div
                className="premium-glass animate-settings-panel-enter relative w-full max-w-md m-4 border border-stone-700 rounded-2xl p-6 shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-stone-100">Настройки интерфейса</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors" aria-label="Закрыть настройки">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-6">
                    {sliders.map(({ id, label, minLabel, maxLabel }) => (
                        <div key={id}>
                            <div className="flex justify-between items-center mb-2">
                               <label htmlFor={id} className="block text-sm font-medium text-stone-300">{label}</label>
                               <span className="text-xs font-mono text-stone-400 bg-stone-900/50 px-2 py-0.5 rounded">{settings[id]}</span>
                            </div>
                            <input
                                type="range"
                                id={id}
                                name={id}
                                min="0"
                                max="100"
                                value={settings[id]}
                                onChange={handleSliderChange}
                                className="settings-slider w-full"
                            />
                            <div className="flex justify-between text-xs text-stone-500 mt-1">
                                <span>{minLabel}</span>
                                <span>{maxLabel}</span>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-8 border-t border-stone-700/50 pt-6">
                   <TactileButton 
                     onClick={resetSettings}
                     className="w-full text-sm font-semibold bg-stone-800/80 text-stone-300 border border-stone-700 rounded-lg px-4 py-2 hover:bg-stone-700/80 hover:text-white"
                   >
                     Сбросить по умолчанию
                   </TactileButton>
                </div>
            </div>
        </div>
    );
};

export default React.memo(SettingsPanel);