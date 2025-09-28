import { createContext } from 'react';
import type { ThemeContextType } from '@/types/theme';

export const ThemeProviderContext = createContext<ThemeContextType | undefined>(
  undefined
);
