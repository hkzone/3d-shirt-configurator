import { useRef, useMemo, useImperativeHandle, useCallback, useState } from 'react';
import { PerspectiveCameraProps, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { degToRad, lerp } from 'three/src/math/MathUtils';
import { PerspectiveCamera } from '@react-three/drei';
import { PerspectiveCamera as PerspectiveCameraType } from 'three';
import React from 'react';
import gsap from 'gsap';
import { useControls } from 'leva';

import { CAMERA_FOV } from '@/config/camera';

import { usePointer } from '../../helpers/pointer-provider';

const INITIAL_POSITION = [0, 0.37, 1.04];

export type CameraRefType = {
  container: THREE.Object3D | null;
  camera: THREE.PerspectiveCamera | null;
  enable: () => void;
  disable: () => void;
  animateIntro: () => gsap.core.Timeline;
};

const Camera = React.forwardRef<CameraRefType, PerspectiveCameraProps>(function Camera(props, ref) {
  const { size } = useThree();
  const pointer = usePointer();
  const offsetY = useRef(0);
  const [enabled, setEnabled] = useState(true);

  const config = useControls('Camera', {
    x: { value: INITIAL_POSITION[0], min: -2, max: 2, step: 0.01 },
    y: { value: INITIAL_POSITION[1], min: -2, max: 2, step: 0.01 },
    z: { value: INITIAL_POSITION[2], min: 0, max: 10, step: 0.01 },
    angle: { value: 15.7, min: -90, max: 90, step: 0.01, label: 'angle' },
  });

  useImperativeHandle(ref, () => {
    return {
      container: angleContainerRef.current,
      camera: cameraRef.current,
      enable() {
        setEnabled(true);
      },
      disable() {
        setEnabled(false);
      },
      animateIntro() {
        const timeline = gsap.timeline();

        timeline.fromTo(
          config,
          { z: INITIAL_POSITION[2] + 2, y: INITIAL_POSITION[1] - 1 },
          { duration: 3, y: INITIAL_POSITION[1], z: INITIAL_POSITION[2], ease: 'power2.out' },
          0
        );

        return timeline;
      },
    };
  }, []);

  const cameraRef = useRef<PerspectiveCameraType>(null);
  const mouseContainerRef = useRef<THREE.Group>(null);
  const angleContainerRef = useRef<THREE.Group>(null);

  const [angle, settings, center, mouseRotation, zoomRadius] = useMemo(() => {
    const angle = { previous: 0, current: 0 };
    const settings = {
      mouse: { strength: new THREE.Vector2(4, 3), damping: 1.0 },
      angle: { damping: 0.1 },
    };
    const center = new THREE.Vector3(0, 0, 0);
    const mouseRotation = { current: new THREE.Vector2(), target: new THREE.Vector2() };
    const zoomRadius = 0;

    return [angle, settings, center, mouseRotation, zoomRadius];
  }, []);

  useFrame((_state, delta) => {
    if (!enabled) return;

    updateAngle();
    updatePosition();
    updateMouseRotation(delta);
  });

  const updateAngle = useCallback(() => {
    angle.previous = angle.current;

    angle.current = lerp(angle.current, degToRad(config.angle), settings.angle.damping);
  }, [config.angle]);

  const updatePosition = () => {
    if (!angleContainerRef.current) return;

    angleContainerRef.current.position.x = (config.z + zoomRadius) * Math.sin(angle.current);
    angleContainerRef.current.position.z = (config.z + zoomRadius) * Math.cos(angle.current);
    angleContainerRef.current.position.y = config.y;
    angleContainerRef.current.lookAt(center);
  };

  const updateMouseRotation = (delta: number) => {
    if (!mouseContainerRef.current || !cameraRef.current) return;

    mouseRotation.target.set(
      pointer.x * 0.08 * settings.mouse.strength.x,
      pointer.y * 0.08 * settings.mouse.strength.y
    );

    mouseRotation.current.lerp(mouseRotation.target, settings.mouse.damping * delta);

    cameraRef.current.position.x = -mouseRotation.current.x;
    cameraRef.current.position.y = mouseRotation.current.y + offsetY.current;
    cameraRef.current.position.z = 0;
    cameraRef.current.lookAt(center);
  };

  return (
    <group ref={angleContainerRef}>
      <group ref={mouseContainerRef}>
        <PerspectiveCamera
          ref={cameraRef}
          aspect={size.width / size.height}
          far={100}
          fov={CAMERA_FOV}
          makeDefault={enabled}
          name='mainCamera'
          near={0.1}
          {...props}
        />
      </group>
    </group>
  );
});

export { Camera };
