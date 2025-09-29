import { createContext } from 'react';

export type Theme =
  | 'system'
  | 'light'
  | 'dark'
  | 'light-green'
  | 'dark-green'
  | 'light-blue'
  | 'dark-blue'
  | 'light-violet'
  | 'dark-violet';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);
