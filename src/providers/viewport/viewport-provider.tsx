import { useEffect, useState, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import resolveConfig from 'tailwindcss/resolveConfig';

import tailwindConfig from '@/../tailwind.config';

import ViewportContext from './viewport-context';

const breakpoints = resolveConfig(tailwindConfig as any).theme.screens;

const DEBOUNCE_TIMEOUT = 100; // milliseconds

const ViewportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [matchMediaQueries, setMatchMediaQueries] = useState<{ [key: string]: boolean } | undefined>(undefined);
  const [sizes, setSizes] = useState<{ [key: string]: number } | undefined>(undefined);

  const createGhostElement = useCallback((): HTMLDivElement => {
    const element = document.createElement('div');

    element.style.width = '100%';
    element.style.height = '100vh';
    element.style.position = 'absolute';
    element.style.top = '0';
    element.style.left = '0';
    element.style.pointerEvents = 'none';

    return element;
  }, []);

  const updateViewportState = useCallback(() => {
    const innerGhostElement = createGhostElement();

    document.body.appendChild(innerGhostElement);
    const fullWidth = innerGhostElement.offsetWidth;
    const fullHeight = innerGhostElement.offsetHeight;

    document.body.removeChild(innerGhostElement);

    setSizes({
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      fullWidth,
      fullHeight,
    });

    // Update CSS variables
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    document.documentElement.style.setProperty('--vw', `${window.innerWidth * 0.01}px`);
    document.documentElement.style.setProperty('--scrollbar-width', `${fullWidth - window.innerWidth}px`);
  }, [createGhostElement]);

  const debounce = useDebouncedCallback(updateViewportState, DEBOUNCE_TIMEOUT);

  useEffect(() => {
    updateViewportState(); // Initial update

    window.addEventListener('resize', debounce);
    window.addEventListener('orientationchange', debounce);

    return () => {
      window.removeEventListener('resize', debounce);
      window.removeEventListener('orientationchange', debounce);
    };
  }, [updateViewportState, debounce]);

  useEffect(() => {
    const queries: { [key: string]: string } = {
      isMobile: `(max-width: ${parseInt(breakpoints.sm, 10) - 1}px)`,
      isTablet: `(max-width: ${parseInt(breakpoints.md, 10) - 1}px)`,
      isDesktop: `(min-width: ${breakpoints.xxxl})`,
      isLandscape: `(orientation: landscape)`,
      isPortrait: `(orientation: portrait)`,
      isTouch: `(pointer: coarse)`,
    };

    const mediaQueries: { [key: string]: boolean } = {};
    const listeners: { [key: string]: () => void } = {};

    Object.entries(queries).forEach(([key, value]) => {
      const mediaQueryList = window.matchMedia(value);

      listeners[key] = () => {
        mediaQueries[key] = mediaQueryList.matches;
        setMatchMediaQueries({ ...mediaQueries });
      };

      mediaQueryList.addEventListener('change', listeners[key]);
      mediaQueries[key] = mediaQueryList.matches;
    });

    setMatchMediaQueries(mediaQueries);

    return () => {
      Object.entries(queries).forEach(([key, value]) => {
        const mediaQueryList = window.matchMedia(value);

        mediaQueryList.removeEventListener('change', listeners[key]);
      });
    };
  }, []);

  const { isMobile, isTablet, isLandscape, isPortrait, isDesktop, isTouch } = matchMediaQueries || {
    isMobile: false,
    isTablet: false,
    isLandscape: false,
    isPortrait: false,
    isDesktop: false,
    isTouch: false,
  };

  const { innerWidth, innerHeight, fullWidth, fullHeight } = sizes || {
    innerWidth: 0,
    innerHeight: 0,
    fullWidth: 0,
    fullHeight: 0,
  };

  return (
    <ViewportContext.Provider
      value={{
        isMobile,
        isTablet,
        isLandscape,
        isPortrait,
        isDesktop,
        isTouch,
        innerWidth,
        innerHeight,
        fullWidth,
        fullHeight,
      }}
    >
      {children}
    </ViewportContext.Provider>
  );
};

export { ViewportProvider };
