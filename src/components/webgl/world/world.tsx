'use client';

import { useThree } from '@react-three/fiber';
import { useControls } from 'leva';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { ForwardedRef, Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';

import { PAGE_TRANSITION_MS } from '@/config/page-transition';
import { useAppConfig } from '@/providers/app-config';
import { useViewport } from '@/providers/viewport';

import { Common } from '../canvas/view';
import { Camera, CameraRefType } from '../components/camera';
import { CameraControls, CameraControlsRefType } from '../components/camera-controls';
import { PexusBackground } from '../components/plexus-background';

interface ModelRef extends THREE.Group {
  size: { width: number; height: number };
}

interface ModelJSProps extends Omit<JSX.IntrinsicElements['group'], 'ref'> {
  forwardedRef: ForwardedRef<ModelRef>;
}

const Model = dynamic(
  async () => {
    const { Model } = await import('@/components/webgl/model');

    const ModelJS = ({ forwardedRef, ...props }: ModelJSProps) => <Model ref={forwardedRef} {...props} />;

    return ModelJS;
  },
  {
    ssr: false,
  }
);

function World() {
  const config = useControls('Position', {
    x: { value: 0, min: -2, max: 2, step: 0.001 },
    yDesktop: { value: -0.15, min: -1, max: 1, step: 0.001 },
    yTablet: { value: -0.06, min: -1, max: 1, step: 0.001 },
    z: { value: 0, min: -1, max: 1, step: 0.001 },
  });
  const cameraRef = useRef<CameraRefType>(null);
  const cameraControlsRef = useRef<CameraControlsRefType>(null);
  const pathname = usePathname();

  const groupRef = useRef<THREE.Group>(null!);
  const modelRef = useRef<ModelRef>(null!);
  const isInitialPositionDone = useRef(false);

  const { viewport } = useThree();
  const { getCurrentViewport } = useThree((state) => state.viewport);
  const { isTablet } = useViewport();
  const { state, dispatch } = useAppConfig();

  const updatePositionAndScale = () => {
    if (!modelRef.current || !groupRef.current || !cameraRef.current?.camera) return;

    const { width: modelWidth, height: modelHeight } = modelRef.current.size;

    const scaleRatio = isTablet ? 2 : 1.5;

    if (pathname === '/') {
      const { width, height } = getCurrentViewport(cameraRef.current.camera, [0, 0, 0]);
      const scale = isTablet
        ? height > modelHeight * scaleRatio
          ? 1
          : height / modelHeight / scaleRatio
        : width > modelWidth * scaleRatio
          ? 1
          : width / modelWidth / scaleRatio;

      const yPosition = isTablet ? config.yTablet : config.yDesktop;

      groupRef.current.scale.set(scale, scale, scale);
      groupRef.current.position.x = config.x;
      groupRef.current.position.z = config.z;

      groupRef.current.position.y = (height - modelHeight * scale + yPosition) / 2;

      groupRef.current.updateMatrixWorld();
    } else {
      groupRef.current.position.set(0, 0, 0);
      groupRef.current.scale.set(1, 1, 1);
    }
  };

  useEffect(() => {
    dispatch({
      type: 'SET_MODEL_OFFSET',
      payload: { modelOffset: isTablet || pathname !== '/' ? new THREE.Vector2(0, 0) : new THREE.Vector2(-0.2, 0) },
    });
  }, [isTablet, pathname]);

  useEffect(() => {
    if (state.isLoaded && cameraRef.current) cameraRef.current.animateIntro();
  }, [state.isLoaded]);

  useEffect(() => {
    if (!cameraRef.current?.camera) return;

    if (pathname === '/') {
      cameraControlsRef.current?.disable();
      cameraRef.current?.enable();
      updatePositionAndScale();
    }
    if (pathname === '/configurator') {
      cameraRef.current?.disable();
      cameraControlsRef.current?.enable();
      updatePositionAndScale();
    }

    isInitialPositionDone.current = true;
  }, [cameraRef.current?.camera, modelRef.current?.size]);

  useEffect(() => {
    if (!cameraRef.current || !cameraControlsRef.current || !isInitialPositionDone.current) return;

    let timeoutId: NodeJS.Timeout;

    const duration = PAGE_TRANSITION_MS / 2;

    if (pathname === '/') {
      timeoutId = setTimeout(() => {
        cameraControlsRef.current?.disable();
        cameraRef.current?.enable();
        updatePositionAndScale();
      }, duration);
    }
    if (pathname === '/configurator') {
      timeoutId = setTimeout(() => {
        cameraRef.current?.disable();
        cameraControlsRef.current?.enable();
        updatePositionAndScale();
      }, duration);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [pathname]);

  useEffect(() => {
    updatePositionAndScale();
  }, [config, viewport]);

  return (
    <Suspense fallback={null}>
      <group ref={groupRef}>
        <Model forwardedRef={modelRef} />
      </group>
      <PexusBackground />
      <Common />
      <Camera ref={cameraRef} />
      <CameraControls ref={cameraControlsRef} />
    </Suspense>
  );
}

export { World };
