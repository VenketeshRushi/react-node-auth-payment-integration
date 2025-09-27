import { createContext } from 'react';
import type { ThemeProviderContextType } from '@/types/theme';

export const ThemeProviderContext = createContext<
  ThemeProviderContextType | undefined
>(undefined);
