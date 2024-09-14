'use client';

import { ViewProps } from '@react-three/drei';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { useViewport } from '@/providers/viewport';
import { cn } from '@/utils/cn';

import { View } from '../canvas/view';
import { World } from '../world';

interface ViewStyles extends React.CSSProperties {
  '--tw-scale-y'?: string;
}

export function Experience(props: ViewProps) {
  const { innerHeight, isMobile, isTablet } = useViewport();
  const cssVariablesRef = useRef({ nav: 0, drawer: 0 });
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const computedStyle = window.getComputedStyle(document.body);
      const nav = computedStyle.getPropertyValue('--nav-height');
      const drawer = computedStyle.getPropertyValue('--drawer-height');

      // Get the base font size in pixels
      const fontSizePx = parseFloat(window.getComputedStyle(document.documentElement).fontSize);

      // Convert rem values to pixels
      cssVariablesRef.current = {
        nav: parseFloat(nav) * fontSizePx,
        drawer: parseFloat(drawer) * fontSizePx,
      };
    }
  }, [innerHeight]);

  const scaleY =
    pathname === '/'
      ? (innerHeight - cssVariablesRef.current.nav) / (innerHeight - cssVariablesRef.current.nav)
      : isTablet || isMobile
        ? (innerHeight * 0.35) / innerHeight
        : (innerHeight - cssVariablesRef.current.drawer - cssVariablesRef.current.nav) / innerHeight;

  const viewStyle: ViewStyles = {
    '--tw-scale-y': `${scaleY}`,
  };

  return (
    <View
      className={cn(
        'fixed top-[calc(var(--nav-height)+2.625rem)] lg:top-navbarHeight w-screen  h-[calc(100*var(--vh))] z-20 origin-top-left',
        'duration-250 delay-0 ease-in-out scale-x-100 md:scale-x-50',
        'transform-gpu will-change-transform',
        { 'pointer-events-none !scale-x-100 top-[calc(var(--nav-height))]': pathname === '/' }
      )}
      style={viewStyle}
      {...props}
    >
      <World />
    </View>
  );
}
