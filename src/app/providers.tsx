'use client';

import * as React from 'react';
import { NextUIProvider } from '@nextui-org/system';
import { useRouter } from 'next/navigation';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ThemeProviderProps } from 'next-themes/dist/types';

import { ViewportProvider } from '@/providers/viewport';
import { ReactQueryClientProvider } from '@/providers/react-query-client-provider';
import { AppConfigProvider } from '@/providers/app-config';

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <AppConfigProvider>
      <ReactQueryClientProvider>
        <NextUIProvider navigate={router.push}>
          <NextThemesProvider {...themeProps}>
            <ViewportProvider>{children}</ViewportProvider>
          </NextThemesProvider>
        </NextUIProvider>
      </ReactQueryClientProvider>
    </AppConfigProvider>
  );
}
