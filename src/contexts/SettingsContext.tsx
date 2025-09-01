

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { View } from '../components/Navigation.tsx';

export interface AppSettings {
  transparency: number; // 0-100
  depth: number;        // 0-100
  glow: number;         // 0-100
  speed: number;        // 0-100
  tactile: number;      // 0-100
  temperature: number;  // 0-100
}

export const defaultSettings: AppSettings = {
  transparency: 60,
  depth: 50,
  glow: 50,
  speed: 50,
  tactile: 50,
  temperature: 50,
};

// --- Theming using OKLCH Color Space ---
type ThemeName = 'red-alert';
interface Theme {
    '--primary-l': string;
    '--primary-c': string;
    '--primary-h': string;
}
const themes: Record<ThemeName, Theme> = {
    'red-alert': {
        '--primary-l': '0.63', // ~63% lightness
        '--primary-c': '0.22', // ~0.22 chroma
        '--primary-h': '25',   // red hue
    },
};

// --- Context-Aware Theming ---
const viewThemes: Partial<Record<View, { hue: number }>> = {
    'my-ads': { hue: 190 },     // Cyan
    'monitoring': { hue: 90 }, // Yellow-Green
    'contacts': { hue: 250 },   // Purple
};


interface SettingsContextType {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  resetSettings: () => void;
  theme: ThemeName | null;
  setTheme: (theme: ThemeName | null) => void;
  setViewTheme: (view: View) => void;
}

export const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  setSettings: () => {},
  resetSettings: () => {},
  theme: null,
  setTheme: () => {},
  setViewTheme: () => {},
});

const SETTINGS_STORAGE_KEY = 'smartlink-app-settings';

// Helper function to map a value from one range to another
const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number): number => {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
    } catch (error) {
      console.error("Failed to parse settings from localStorage", error);
      return defaultSettings;
    }
  });

  const [theme, setTheme] = useState<ThemeName | null>(null);
  const [viewTheme, setViewThemeState] = useState<View | null>('dashboard');

  const setViewTheme = (view: View) => {
    setViewThemeState(view);
  };

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings to localStorage", error);
    }

    const root = document.documentElement;
    
    // Calculate hue from user's temperature setting
    const temperatureHue = Math.round(mapRange(settings.temperature, 0, 100, 220, 40));
    // Check if the current view has a specific theme override
    const viewThemeHue = viewTheme ? viewThemes[viewTheme]?.hue : null;

    // Apply base settings
    const baseStyles = {
        '--material-opacity': mapRange(settings.transparency, 0, 100, 0.95, 0.4).toFixed(2),
        '--material-blur-px': `${mapRange(settings.transparency, 0, 100, 20, 4).toFixed(2)}px`,
        '--spatial-perspective-px': `${Math.round(mapRange(settings.depth, 0, 100, 3000, 1000))}px`,
        '--spatial-z-px': `${Math.round(mapRange(settings.depth, 0, 100, 10, 80))}px`,
        '--spatial-shadow-opacity': mapRange(settings.depth, 0, 100, 0.2, 0.7).toFixed(2),
        '--_glow-multiplier-base': mapRange(settings.glow, 0, 100, 0.5, 2.0).toFixed(2), // Store base glow
        '--glow-multiplier': `calc(var(--_glow-multiplier-base, 1.0) * var(--glow-multiplier-pulse, 1.0))`, // Use base glow
        '--speed-multiplier': mapRange(settings.speed, 0, 100, 2.0, 0.5).toFixed(2),
        '--tactile-scale': mapRange(settings.tactile, 0, 100, 0.99, 0.94).toFixed(2),
        '--tactile-shadow-opacity': mapRange(settings.tactile, 0, 100, 0.2, 0.6).toFixed(2),
        // OKLCH Defaults. Temperature slider controls hue.
        '--primary-l': '0.88',
        '--primary-c': '0.23',
        // Prioritize view theme hue > dashboard/user temperature hue
        '--primary-h': `${viewThemeHue ?? temperatureHue}`,
    };
    
    // Get theme overrides if a theme is active
    const themeOverrides = theme ? themes[theme] : {};

    const combinedStyles = { ...baseStyles, ...themeOverrides };
    
    // Apply all styles to the root element
    Object.entries(combinedStyles).forEach(([key, value]) => {
        root.style.setProperty(key, String(value));
    });

  }, [settings, theme, viewTheme]);

  const resetSettings = () => {
      setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, setSettings, resetSettings, theme, setTheme, setViewTheme }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
