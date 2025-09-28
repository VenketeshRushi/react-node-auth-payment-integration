import { useEffect, useState } from 'react';
import { ThemeProviderContext } from './ThemeContext';
import type {
  Theme,
  ThemeProviderProps,
  ThemeProviderContextType,
} from '@/types/theme';

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const allThemes: Theme[] = [
      'system',
      'light',
      'dark',
      'light-violet',
      'dark-violet',
      'light-green',
      'dark-green',
      'light-blue',
      'dark-blue',
    ];

    root.classList.remove(...allThemes);

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem(storageKey, newTheme);
    setThemeState(newTheme);
  };

  const value: ThemeProviderContextType = { theme, setTheme };

  return (
    <ThemeProviderContext.Provider value={value} {...props}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
