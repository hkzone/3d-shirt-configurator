'use client';

import { PropsWithChildren, useContext, useRef } from 'react';
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { usePathname } from 'next/navigation';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';

import { PAGE_TRANSITION_SECONDS } from '@/config/page-transition';

export function FrozenRouter(props: PropsWithChildren<{}>) {
  const context = useContext(LayoutRouterContext);
  const frozen = useRef(context).current;

  return <LayoutRouterContext.Provider value={frozen}>{props.children}</LayoutRouterContext.Provider>;
}

export default function Template({ children }: { children: React.ReactNode }) {
  let pathname = usePathname();

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence initial={true} mode={'wait'}>
        <m.div
          key={pathname}
          animate='animate'
          exit='exit'
          initial='initial'
          transition={{ duration: PAGE_TRANSITION_SECONDS }}
          variants={{
            animate: { opacity: 1 },
            exit: { opacity: 0.999 },
            initial: { opacity: 0.999 },
          }}
          onAnimationStart={(animation) => {
            if (animation === 'exit') {
              const event = new Event('page-transition');

              window.dispatchEvent(event);
            }
          }}
        >
          {/*  Completing page exit animation and load new page */}
          <FrozenRouter>{children}</FrozenRouter>
        </m.div>
      </AnimatePresence>
    </LazyMotion>
  );
}
