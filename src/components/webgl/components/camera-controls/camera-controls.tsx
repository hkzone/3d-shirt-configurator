import * as THREE from 'three';
import React, { useEffect, useRef, useImperativeHandle, useState } from 'react';
import { CameraControls as CameraControlsImpl, CameraControlsProps, PerspectiveCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';

import { useAppConfig } from '@/providers/app-config';
import { CAMERA_FOV } from '@/config/camera';

export interface CameraControlsRefType {
  enable: () => void;
  disable: () => void;
}

const CameraControls = React.forwardRef<CameraControlsRefType, CameraControlsProps>(
  function CameraControls(props, ref) {
    const controlsRef = useRef<CameraControlsImpl>(null!);
    const cameraRef = useRef<THREE.PerspectiveCamera>(null!);
    const [enabled, setEnabled] = useState(false);

    const { state } = useAppConfig();
    const { size } = useThree();

    const updateCameraControl = (immediately: boolean) => {
      if (!controlsRef.current) return;

      const { position, target } = state.cameraConfig;

      controlsRef.current.setLookAt(position.x, position.y, position.z, target.x, target.y, target.z, immediately);
    };

    useImperativeHandle(
      ref,
      () => ({
        enable() {
          setEnabled(true);
          updateCameraControl(false);
        },
        disable() {
          setEnabled(false);
        },
      }),
      []
    );

    useEffect(() => {
      updateCameraControl(true);
    }, [state.cameraConfig]);

    return (
      <>
        <PerspectiveCamera
          ref={cameraRef}
          aspect={size.width / size.height}
          far={100}
          fov={CAMERA_FOV}
          makeDefault={enabled}
          near={0.1}
        />
        <CameraControlsImpl
          ref={controlsRef}
          camera={cameraRef.current}
          enabled={enabled}
          maxDistance={2.5}
          maxPolarAngle={THREE.MathUtils.degToRad(135)}
          minDistance={0.55}
          minPolarAngle={THREE.MathUtils.degToRad(45)}
          truckSpeed={0}
          {...props}
        />
      </>
    );
  }
);

export { CameraControls };
