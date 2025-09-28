export type Theme =
  | 'system'
  | 'light'
  | 'dark'
  | 'light-violet'
  | 'dark-violet'
  | 'light-green'
  | 'dark-green'
  | 'light-blue'
  | 'dark-blue';

export interface ThemeProviderContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
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
