import { useRef } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

export const useLabelMaterial = () => {
  const texture = useTexture('./textures/label.png');

  const labelMaterial = useRef<THREE.MeshStandardMaterial>(
    new THREE.MeshStandardMaterial({
      map: texture,
    })
  );

  return { labelMaterial: labelMaterial.current };
};
