'use client';

import type { DependencyList } from 'react';

import { useRef } from 'react';
import gsap from 'gsap';

import breakpoints from '@/utils/tailwind-breakpoints';
import useIsomorphicLayoutEffect from '@/hooks/utils/use-isomorphic-layout-effect';

export default function useGsapTimeline(
  callback: gsap.ContextFunc,
  scope: string | object,
  deps?: DependencyList | undefined
) {
  const timeline = useRef(gsap.timeline());
  const mmContext = useRef<gsap.Conditions>();

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: '(prefers-reduced-motion: reduce)',
          isDesktop: `(min-width: ${breakpoints.lg}px)`,
          isLarge: `(min-width: ${breakpoints.xl}px)`,
          isTablet: `(min-width: ${breakpoints.sm}px)`,
          isMobile: `(max-width: ${breakpoints.sm - 1}px)`,
          isLandscape: `(orientation: landscape)`,
          isPortrait: `(orientation: portrait)`,
        },
        (context) => {
          mmContext.current = context.conditions;
          timeline.current = gsap.timeline();

          callback(context);
        }
      );
    }, scope);

    return () => {
      ctx.revert();
    };
  }, [deps]);

  return {
    timeline: timeline.current,
    mm: mmContext.current,
  };
}
