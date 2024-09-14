import '@/styles/globals.css';

import clsx from 'clsx';
import { Metadata, Viewport } from 'next';
import { Suspense } from 'react';

import { fontSans, fontDisplay } from '@/config/fonts';
import { Navbar } from '@/components/layout/navbar';
import { siteConfig } from '@/config/site';
import { WebGlLayout } from '@/components/webgl/dom/webgl-layout';
import { Experience } from '@/components/webgl/experience';
import { LoadingScreen } from '@/components/webgl/components/loading-screen';

import Template from './template';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning className='overscroll-none overflow-hidden' lang='en'>
      <head />
      <body className={clsx('bg-background font-sans antialiased', fontSans.variable, fontDisplay.variable)}>
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'light' }}>
          <Suspense>
            <WebGlLayout>
              <Experience />
            </WebGlLayout>
          </Suspense>
          <LoadingScreen />
          <div className='relative flex flex-col h-[calc(100*var(--vh,1vh))] overflow-hidden'>
            <Navbar />
            <main className='max-w-[min(95vw,120rem)] mx-auto w-full  px-3 flex-grow z-[1]'>
              <Template>{children}</Template>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
