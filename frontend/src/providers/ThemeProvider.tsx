import { useCallback, useEffect, useState } from 'react';
import {
  ThemeContext,
  type Theme,
  type ThemeContextType,
} from '@/providers/ThemeContext';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('system');
  const [actualTheme, setActualTheme] = useState<string>('light');

  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  };

  const applyTheme = useCallback((newTheme: Theme) => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    const allThemes = [
      'light',
      'dark',
      'light-green',
      'dark-green',
      'light-blue',
      'dark-blue',
      'light-violet',
      'dark-violet',
    ];

    root.classList.remove(...allThemes);

    let resolvedTheme: string;
    if (newTheme === 'system') {
      resolvedTheme = getSystemTheme();
    } else {
      resolvedTheme = newTheme;
    }

    // Add the new theme class
    root.classList.add(resolvedTheme);
    setActualTheme(resolvedTheme);
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () =>
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [theme, applyTheme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const value: ThemeContextType = {
    theme,
    setTheme,
    actualTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
