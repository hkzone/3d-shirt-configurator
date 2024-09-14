import { useEffect, useRef } from 'react';
import { useControls } from 'leva';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

import { Product } from '@/types/product';

export const useFabricMaterial = (data: Product | null) => {
  const config = useControls('Fabric Material', {
    roughness: { value: 1, min: 0, max: 1 },
    metalness: { value: 0, min: 0, max: 1 },
    reflectivity: { value: 0, min: 0, max: 1 },
  });

  const texturePath = '/textures/default/';

  const texture = useTexture({
    map: data?.information.maps.color ?? `${texturePath}COLOR.jpg`,
    normalMap: data?.information.maps.normal ?? `${texturePath}NORMAL.jpg`,
    roughnessMap: data?.information.maps.roughness ?? `${texturePath}ROUGHNESS.jpg`,
    specularMap: data?.information.maps.specular ?? `${texturePath}SPECULAR.jpg`,
  });

  const fabricMaterial = useRef<THREE.MeshPhysicalMaterial>(
    new THREE.MeshPhysicalMaterial({
      side: THREE.DoubleSide,
    })
  );

  useEffect(() => {
    if (!fabricMaterial.current || !data || !texture) return;

    // Update material properties
    Object.assign(fabricMaterial.current, {
      metalness: config.metalness,
      roughness: config.roughness,
      reflectivity: config.reflectivity,
    });

    // Update maps with a helper function
    const updateMap = (
      map: THREE.Texture | undefined,
      mapName: 'map' | 'roughnessMap' | 'normalMap' | 'specularIntensityMap'
    ) => {
      if (!map) return;

      fabricMaterial.current[mapName] = map;
      map.wrapS = THREE.RepeatWrapping;
      map.wrapT = THREE.RepeatWrapping;
      map.repeat.set(data.information.mapsizewidth, data.information.mapsizeheight);
      map.needsUpdate = true;

      if (mapName === 'map') {
        map.colorSpace = THREE.SRGBColorSpace;
      }
    };

    updateMap(texture.map, 'map');
    updateMap(texture.roughnessMap, 'roughnessMap');
    updateMap(texture.normalMap, 'normalMap');
    updateMap(texture.specularMap, 'specularIntensityMap'); // Note: specularMap is used for specularIntensityMap

    fabricMaterial.current.needsUpdate = true;
  }, [texture, config, data]);

  return { fabricMaterial: fabricMaterial.current };
};
