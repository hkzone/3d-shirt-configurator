'use client';

import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import * as THREE from 'three';
import { useSearchParams } from 'next/navigation';

import { PointerProvider } from '@/components/webgl/helpers/pointer-provider';
import { Perf } from '@/components/webgl/helpers/perf';
import { r3f } from '@/components/webgl/helpers/global';

export default function Scene({ ...props }) {
  const searchParams = useSearchParams();
  const debug = searchParams.has('debug');
  // Everything defined in here will persist between route changes, only children are swapped

  return (
    <Canvas {...props} onCreated={(state: any) => (state.gl.toneMapping = THREE.NoToneMapping)}>
      <PointerProvider>
        {/* @ts-ignore */}
        <r3f.Out />
        <Preload all />
        {debug && <Perf className='!top-navbarHeight' position='top-left' />}
      </PointerProvider>
    </Canvas>
  );
}
