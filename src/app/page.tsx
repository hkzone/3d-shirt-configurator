'use client';

import { m } from 'framer-motion';

import { siteConfig } from '@/config/site';
import { ShinyButton } from '@/components/common/shiny-button';
import { title, subtitle } from '@/components/common/primitives';
import { useAppConfig } from '@/providers/app-config';

export default function Home() {
  const { state } = useAppConfig();

  return state.isLoaded ? (
    <m.section
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          delay: 0.1,
          duration: 0.4,
        },
      }}
      className='max-md:absolute max-md:h-[calc(100*var(--vh))] max-md:bottom-0 max-md:left-0  max-md:justify-end w-full py-4 flex flex-col  items-center md:items-start justify-center h-[calc(100vh-var(--nav-height))] '
      exit={{ opacity: 0 }}
      initial={{ opacity: 0, y: -30 }}
    >
      <div className='flex flex-col max-w-lg text-center items-center md:items-start justify-center capitalize'>
        <h1 className={title({ class: 'font-title tracking-wide font-normal max-md:uppercase', size: 'lg' })}>
          Tailored&nbsp;
        </h1>
        <h1
          className={title({
            class: 'font-title tracking-wide font-normal max-md:uppercase',
            size: 'lg',
            color: 'red',
          })}
        >
          Neapolitan&nbsp;
        </h1>
        <h1 className={title({ class: 'font-title tracking-wide font-normal max-md:uppercase', size: 'lg' })}>
          shirts.
        </h1>
        <h2 className={subtitle({ class: 'mt-3 md:mt-4 capitalize text-center md:text-left', size: 'sm' })}>
          Custom made Neapolitan shirts for the gentlemen
        </h2>
      </div>

      <div className='flex gap-3 sm:pb-8 pt-1 md:pt-4'>
        <ShinyButton className='rounded-sm px-12 py-3 text-lg' href={siteConfig.navItems[1].href}>
          Design Shirt
        </ShinyButton>
      </div>
    </m.section>
  ) : (
    <></>
  );
}
