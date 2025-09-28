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
  actualTheme: string;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  attribute?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  enableColorScheme?: boolean;
}
