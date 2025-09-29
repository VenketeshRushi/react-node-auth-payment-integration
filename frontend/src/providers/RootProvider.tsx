import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store/store';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { MachineIdProvider } from '@/providers/MachineIdProvider';
import { Toaster } from 'react-hot-toast';

interface RootProviderProps {
  children: React.ReactNode;
}

const toasterConfig = {
  position: 'top-right' as const,
  reverseOrder: false,
  gutter: 8,
  toastOptions: {
    duration: 4000,
    style: {
      background: 'var(--background)',
      color: 'var(--foreground)',
      borderRadius: '8px',
      padding: '12px 16px',
      border: '1px solid var(--border)',
      fontSize: '14px',
    },
  },
};

export default function RootProvider({ children }: RootProviderProps) {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider defaultTheme='system' storageKey='app-ui-theme'>
        <MachineIdProvider>{children}</MachineIdProvider>
      </ThemeProvider>
      <Toaster {...toasterConfig} />
    </ReduxProvider>
  );
}
