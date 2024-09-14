'use client';

import { forwardRef, Ref, Suspense, useEffect, useImperativeHandle, useRef } from 'react';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useControls } from 'leva';
import { useTheme } from 'next-themes';
import { useThree } from '@react-three/fiber';

import { Three } from '@/components/webgl/helpers/components/three';

import { CustomView as ViewImpl } from '../components/custom-view';

export const Common = () => {
  const config = useControls('Environment', {
    rotationY: { value: -45, min: -90, max: 90 },
    intencity: { value: 2, min: 0, max: 20 },
  });

  const gl = useThree((s) => s.gl);
  const { theme } = useTheme();

  useEffect(() => {
    gl.setClearColor(theme === 'light' ? 0xefefef : 0x0b0b24);
  }, [theme]);

  return (
    <Suspense fallback={null}>
      <Environment
        environmentIntensity={0.9}
        environmentRotation={[0, THREE.MathUtils.degToRad(config.rotationY), 0]}
        files='./envMaps/citrus_orchard_road_0.2k.hdr'
      />
      <pointLight decay={0} intensity={config.intencity} position={[0, 4, -10]} />
    </Suspense>
  );
};

export const View = forwardRef(
  <E extends HTMLDivElement, P extends React.PropsWithChildren<{ orbit?: boolean } & React.HTMLAttributes<E>>>(
    { children, ...props }: P,
    ref: Ref<E>
  ) => {
    const localRef = useRef<E>(null!);

    useImperativeHandle(ref, () => localRef.current);

    return (
      <>
        <div ref={localRef} {...props} />
        <Three>
          <ViewImpl track={localRef}>{children}</ViewImpl>
        </Three>
      </>
    );
  }
);

View.displayName = 'View';
