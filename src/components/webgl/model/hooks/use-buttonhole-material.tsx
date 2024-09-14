import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

import { useSelectedProduct } from '@/hooks/api/use-selected-product';

export const useButtonHoleMaterial = () => {
  const { selectedProduct } = useSelectedProduct();

  const texture = useTexture('./textures/buttonhole.png');

  const buttonHoleMaterial = useRef<THREE.MeshStandardMaterial>(
    new THREE.MeshStandardMaterial({
      map: texture,
      color: new THREE.Color(0xffffff),
      transparent: true,
    })
  );

  useEffect(() => {
    buttonHoleMaterial.current.color = new THREE.Color(selectedProduct?.information.mapcommoncolor ?? 0xffffff);
  }, [selectedProduct]);

  return { buttonholeMaterial: buttonHoleMaterial.current };
};
