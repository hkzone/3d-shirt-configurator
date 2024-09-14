'use client';

import React, { useRef, useState, useCallback, useMemo } from 'react';
import { Controller, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide, SwiperClass } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';

import breakpoints from '@/utils/tailwind-breakpoints';
import { useViewport } from '@/providers/viewport';
import { CloudinaryImage } from '@/components/common/cloudinary-image';

import SliderNavButton from '../slider-nav-button';
import SingleSlider from '../single-slider';

export type SliderDataItem = {
  alt: string;
  src: string;
};

export type SliderData = {
  data: SliderDataItem[];
};

const commonSwiperConfig = {
  loop: true,
  parallax: true,
  grabCursor: false,
  modules: [Controller],
  simulateTouch: false,
  slidesPerView: 1,
  speed: 1200,
};

const SideSlider: React.FC<{
  data: SliderDataItem[];
  onSwiper: (swiper: SwiperClass) => void;
  direction: 'left' | 'right';
}> = ({ data, onSwiper, direction }) => (
  <Swiper {...commonSwiperConfig} onSwiper={onSwiper}>
    {data.map((el, idx) => (
      <SwiperSlide key={`${el.src}-${idx}-${direction}`}>
        <div className='h-[calc((100vw-4rem-2rem)/2*1.5)] lg:h-[min(60vh,48vw)] w-[100%] relative'>
          <CloudinaryImage
            fill
            alt={el.alt}
            sizes={`min-width: ${breakpoints.md}px 30vw, 24vw`}
            src={el.src}
            style={{ objectFit: 'cover' }}
          />
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
);

export function CoverFlowSlider({ data }: SliderData) {
  const gsapRef = useRef<HTMLDivElement>(null);
  const mainSwiperRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useViewport();

  const [leftSwiper, setLeftSwiper] = useState<SwiperClass>();
  const [rightSwiper, setRightSwiper] = useState<SwiperClass>();

  const leftSliderData = useMemo(() => data.slice(-1).concat(data.slice(0, -1)), [data]);
  const rightSliderData = useMemo(() => data.slice(1).concat(data.slice(0, 1)), [data]);

  const handleSetLeftSwiper = useCallback((swiper: SwiperClass) => setLeftSwiper(swiper), []);
  const handleSetRightSwiper = useCallback((swiper: SwiperClass) => setRightSwiper(swiper), []);

  return (
    <div ref={gsapRef} className='relative grid grid-cols-8 gap-4 items-end justify-center'>
      <div className='max-sm:absolute max-sm:top-1/2 max-sm:left-0 col-span-2 block pb-[2.25em]'>
        <div className='max-sm:h-full max-sm:w-full'>
          {!isMobile && <SideSlider data={leftSliderData} direction='left' onSwiper={handleSetLeftSwiper} />}
          <div className='ua-swiper-prev-button sm:absolute relative left-0 top-0 z-[2] h-full w-full'>
            <SliderNavButton aria-label='previous' className='left-3 scale-x-[-1]' />
          </div>
        </div>
      </div>
      <div className='relative col-span-8 sm:col-span-4 block'>
        <SingleSlider
          ref={mainSwiperRef}
          controller={{
            control: mainSwiperRef.current && !isMobile ? ([leftSwiper, rightSwiper] as SwiperClass[]) : undefined,
          }}
          modules={[Controller, Pagination, Navigation]}
          navigation={{ nextEl: '.ua-swiper-next-button', prevEl: '.ua-swiper-prev-button' }}
        >
          {data.map((el, idx) => (
            <SwiperSlide key={`${el.src}-${idx}-main`} className='' data-swiper-parallax='25%'>
              <div className='h-[calc((100vw-3rem)*1.5)] sm:h-[calc((100vw-4rem-2rem)/2*1.5)] lg:h-[min(60vh,48vw)] w-[100%] relative'>
                <CloudinaryImage
                  fill
                  alt={el.alt}
                  sizes={`min-width: ${breakpoints.md}px 30vw, 24vw`}
                  src={el.src}
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </SwiperSlide>
          ))}
        </SingleSlider>
      </div>
      <div className='max-sm:absolute max-sm:top-1/2 max-sm:right-0 relative col-span-2 block sm:pb-[2.25em]'>
        <div className='max-sm:h-full max-sm:w-full'>
          {!isMobile && <SideSlider data={rightSliderData} direction='right' onSwiper={handleSetRightSwiper} />}
          <div className='ua-swiper-next-button absolute left-0 top-0 z-[2] h-full w-full'>
            <SliderNavButton aria-label='next' className='right-3' />
          </div>
        </div>
      </div>
    </div>
  );
}
