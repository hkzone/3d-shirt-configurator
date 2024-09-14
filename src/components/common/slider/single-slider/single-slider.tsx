'use client';

import type { SwiperOptions } from 'swiper/types';
import type { PaginationOptions, SwiperModule } from 'swiper/types';

import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import gsap from 'gsap';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperClass } from 'swiper/react';

import { cn } from '@/utils/cn';
import useGsapTimeline from '@/hooks/utils/use-gsap-timeline';
import useIsomorphicLayoutEffect from '@/hooks/utils/use-isomorphic-layout-effect';

import pagination from '../pagination';

import 'swiper/css';

interface Props extends SwiperOptions {
  children: React.ReactNode;
  modules: SwiperModule[];
}

const SingleSlider = forwardRef(({ children, modules, ...props }: Props, ref) => {
  const [mainSwiper, setMainSwiper] = useState<SwiperClass>();
  const paginationRef = useRef<HTMLDivElement>(null);
  const gsapRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline>();

  useImperativeHandle(ref, () => ({
    swiper: mainSwiper,
  }));

  const pauseTimeline = () => {
    timelineRef?.current?.pause();
  };
  const resumeTimeline = () => {
    timelineRef?.current?.resume();
  };

  useGsapTimeline(
    (context) => {
      if (!mainSwiper) return;
      const duration = context.conditions?.reduceMotion ? 0 : 5;

      // GSAP Animation Progress Bar (Will trigger slider to slide)
      const tl = gsap.timeline({ paused: false });

      timelineRef.current = tl;

      // Retrigger Animation on Slide Change
      function singleSwiperSliderEnd() {
        mainSwiper?.slideNext();
      }

      tl.to('.progress', {
        duration,
        scaleX: 1,
        ease: 'Power1.easeInOut',
        onComplete: singleSwiperSliderEnd,
      });

      // Reset Progress Bar On Slide Change
      mainSwiper.on('slideChange', () => {
        tl.restart();
      });
    },
    gsapRef,
    [mainSwiper]
  );

  useIsomorphicLayoutEffect(() => {
    const paginationElement = paginationRef.current;

    if (!paginationElement) return;

    // Pause Carousel/Progress Bar On Hover
    paginationElement.addEventListener('mouseenter', pauseTimeline);
    paginationElement.addEventListener('mouseleave', resumeTimeline);

    return () => {
      // Clear
      paginationElement.removeEventListener('mouseenter', pauseTimeline);
      paginationElement.removeEventListener('mouseleave', resumeTimeline);
    };
  }, []);

  return (
    <div ref={gsapRef}>
      <Swiper
        loop
        parallax
        grabCursor={false}
        modules={Array.from(new Set([Pagination, ...modules]))}
        pagination={pagination}
        simulateTouch={false}
        slidesPerView={1}
        speed={1200}
        onSwiper={setMainSwiper}
        {...props}
        onBeforeInit={(swiper) => {
          if (paginationRef && swiper?.params?.pagination) {
            const paginationOptns = swiper.params.pagination;

            (paginationOptns as PaginationOptions).el = paginationRef.current;
          }
        }}
      >
        {children}
      </Swiper>
      <div ref={paginationRef} className={cn(`swiper-pagination`, 'relative mt-[1.25em] flex w-full gap-[1em]')} />
    </div>
  );
});

SingleSlider.displayName = 'SingleSlider';

export default SingleSlider;
