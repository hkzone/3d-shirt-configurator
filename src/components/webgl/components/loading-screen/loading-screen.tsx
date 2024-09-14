'use client';

import { useProgress } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useDebouncedCallback } from 'use-debounce';

import lerp from '@/components/webgl/helpers/math/lerp';
import { PAGE_TRANSITION_SECONDS } from '@/config/page-transition';
import { useAppConfig } from '@/providers/app-config';
import Logo from '@/assets/svgs/logo.svg';

const COMPLETION_THRESHOLD = 500;

export function LoadingScreen() {
  const ref = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const animationProgress = useRef(0);
  const [isComplete, setIsComplete] = useState(false);

  const { progress } = useProgress();
  const { dispatch } = useAppConfig();

  const debounced = useDebouncedCallback(() => {
    setIsComplete(true);
  }, COMPLETION_THRESHOLD);

  useEffect(() => {
    if (progress === 100 && !isComplete) {
      debounced();
    }
  }, [progress, isComplete, debounced]);

  useEffect(() => {
    const ticker = () => {
      if (progress > animationProgress.current) {
        animationProgress.current = lerp(animationProgress.current, progress, 0.2);
      }

      if (isComplete && Math.abs(progress - animationProgress.current) < 0.1) {
        animationProgress.current = 100;
        gsap.ticker.remove(ticker);
      }

      gsap.to('#theGradient stop', {
        attr: { offset: `${animationProgress.current}%` },
        ease: 'none',
      });

      if (animationProgress.current === 100) {
        const tl = gsap.timeline();

        tl.to(logoRef.current, {
          duration: 0.5,
          opacity: 0,
        }).to(
          ref.current,
          {
            duration: PAGE_TRANSITION_SECONDS,
            opacity: 0,
            onStart: () => {
              dispatch({ type: 'SET_LOADED' });
            },
            onComplete: () => {
              if (ref.current) ref.current.style.display = 'none';
            },
          },
          0.2
        );
      }
    };

    gsap.ticker.add(ticker);

    return () => {
      gsap.ticker.remove(ticker);
    };
  }, [progress, isComplete, dispatch]);

  return (
    <div ref={ref} className='fixed top-0 left-0 w-screen h-screen flex flex-col items-center z-[1999] bg-black'>
      <div ref={logoRef} className='mt-[calc(50vh-4rem)]'>
        <Logo className='h-16' />
      </div>

      <div className='z-10 flex pt-20 items-center justify-center'>
        <p className='mx-auto max-w-md text-neutral-400/70 animate-shimmer bg-clip-text bg-no-repeat [background-position:var(--shimmer-width)_0] [background-size:var(--shimmer-width)_100%] [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite] bg-gradient-to-r from-transparent via-50% to-transparent via-white/80 inline-flex items-center justify-center px-4 py-1 transition ease-out hover:duration-300 hover:text-neutral-400'>
          <span className='text-xs'>Loading... please wait</span>
        </p>
      </div>
    </div>
  );
}
