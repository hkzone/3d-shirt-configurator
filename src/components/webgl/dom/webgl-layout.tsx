'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';

import { Debugger } from '@/components/webgl/helpers/debugger';

const Scene = dynamic(() => import('@/components/webgl/canvas/scene'), { ssr: false });

const WebGlLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null!);

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: ' 100%',
        height: '100%',
        overflow: 'auto',
        touchAction: 'auto',
      }}
    >
      {children}
      <Scene
        eventPrefix='client'
        eventSource={ref}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: 'calc(100*var(--vh))',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <Debugger />
    </div>
  );
};

export { WebGlLayout };
