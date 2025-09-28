import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store/store';
import { ThemeProvider } from './ThemeProvider';
import { MachineIdProvider } from './MachineIdProvider';
import { Toaster } from 'react-hot-toast';

interface RootProviderProps {
  children: React.ReactNode;
}

export default function RootProvider({ children }: RootProviderProps) {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider>
        <MachineIdProvider>
          {children}
          <Toaster
            position='top-right'
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--background)',
                color: 'var(--foreground)',
                borderRadius: '8px',
                padding: '12px 16px',
                border: '1px solid var(--border)',
                fontSize: '14px',
              },
            }}
          />
        </MachineIdProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}
