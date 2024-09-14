import { useGLTF } from '@react-three/drei';
import { useEffect } from 'react';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

import { use3dSelectedOption } from '@/hooks/api/use-3d-selected-option';

type GLTFResult = GLTF & {
  nodes: {
    Buttonhole: THREE.Mesh;
    Button: THREE.Mesh;
    ButtonThread: THREE.Mesh;
    Fabric001: THREE.Mesh;
    Fabric002: THREE.Mesh;
    Buttonhole001: THREE.Mesh;
    Button001: THREE.Mesh;
    ButtonThread002: THREE.Mesh;
    Button002: THREE.Mesh;
    ButtonThread003: THREE.Mesh;
    Buttonhole002: THREE.Mesh;
    Fabric003: THREE.Mesh;
    Button003: THREE.Mesh;
    ButtonThread004: THREE.Mesh;
    Fabric004: THREE.Mesh;
    Buttonhole003: THREE.Mesh;
    Button004: THREE.Mesh;
    Tessuto: THREE.Mesh;
    Tessuto_1: THREE.Mesh;
    Buttonhole004: THREE.Mesh;
    ButtonThread005: THREE.Mesh;
    Button005: THREE.Mesh;
    Fabric005: THREE.Mesh;
    ButtonThread006: THREE.Mesh;
    Buttonhole005: THREE.Mesh;
    ButtonThread007: THREE.Mesh;
    Buttonhole006: THREE.Mesh;
    Button006: THREE.Mesh;
    Fabric006: THREE.Mesh;
    Fabric007: THREE.Mesh;
    Buttonhole007: THREE.Mesh;
    ButtonThread008: THREE.Mesh;
    Button007: THREE.Mesh;
    Buttonhole008: THREE.Mesh;
    Button008: THREE.Mesh;
    ButtonThread009: THREE.Mesh;
    Fabric008: THREE.Mesh;
    Fabric009: THREE.Mesh;
    Button009: THREE.Mesh;
    ButtonThread010: THREE.Mesh;
    Embroidery3: THREE.Mesh;
    Buttonhole009: THREE.Mesh;
    Embroidery4: THREE.Mesh;
    Fabric010: THREE.Mesh;
    Embroidery3001: THREE.Mesh;
    Embroidery4001: THREE.Mesh;
    Button010: THREE.Mesh;
    Buttonhole010: THREE.Mesh;
    ButtonThread011: THREE.Mesh;
    Button011: THREE.Mesh;
    ButtonThread012: THREE.Mesh;
    Fabric011: THREE.Mesh;
    Buttonhole011: THREE.Mesh;
    Embroidery3002: THREE.Mesh;
    Embroidery4002: THREE.Mesh;
    ButtonThread013: THREE.Mesh;
    Fabric012: THREE.Mesh;
    Cufflinks: THREE.Mesh;
    Embroidery3003: THREE.Mesh;
    Embroidery4003: THREE.Mesh;
    Button012: THREE.Mesh;
    Cufflinks001: THREE.Mesh;
    Button013: THREE.Mesh;
    Embroidery3004: THREE.Mesh;
    Embroidery4004: THREE.Mesh;
    ButtonThread014: THREE.Mesh;
    Fabric013: THREE.Mesh;
    Cufflinks002: THREE.Mesh;
    ButtonThread015: THREE.Mesh;
    Embroidery4005: THREE.Mesh;
    Fabric014: THREE.Mesh;
    Embroidery3005: THREE.Mesh;
    Button014: THREE.Mesh;
    Fabric015: THREE.Mesh;
    Cufflinks003: THREE.Mesh;
    ButtonThread016: THREE.Mesh;
    Embroidery3006: THREE.Mesh;
    Embroidery4006: THREE.Mesh;
    Button015: THREE.Mesh;
    Fabric016: THREE.Mesh;
    Buttonhole012: THREE.Mesh;
    Button016: THREE.Mesh;
    Embroidery2: THREE.Mesh;
    ButtonThread017: THREE.Mesh;
    Embroidery1: THREE.Mesh;
    ButtonThread018: THREE.Mesh;
    Fabric017: THREE.Mesh;
    Button017: THREE.Mesh;
    Buttonhole013: THREE.Mesh;
    Embroidery2001: THREE.Mesh;
    Embroidery1001: THREE.Mesh;
    Fabric018: THREE.Mesh;
    Button018: THREE.Mesh;
    Buttonhole014: THREE.Mesh;
    ButtonThread019: THREE.Mesh;
    Embroidery2002: THREE.Mesh;
    Embroidery1002: THREE.Mesh;
    Fabric019: THREE.Mesh;
    Button019: THREE.Mesh;
    Buttonhole015: THREE.Mesh;
    ButtonThread001: THREE.Mesh;
    Embroidery2003: THREE.Mesh;
    Embroidery1003: THREE.Mesh;
    Fabric021: THREE.Mesh;
    Fabric020: THREE.Mesh;
    Label: THREE.Mesh;
    Fabric: THREE.Mesh;
  };
  materials: {
    ButtonholeMaterial: THREE.MeshStandardMaterial;
    ButtonMaterial: THREE.MeshStandardMaterial;
    ButtonThreadMaterial: THREE.MeshStandardMaterial;
    FabricMaterial: THREE.MeshStandardMaterial;
    EmbroideryMaterial: THREE.MeshStandardMaterial;
    CufflinksMaterial: THREE.MeshStandardMaterial;
    LabelMaterial: THREE.MeshStandardMaterial;
  };
};

export const useModel = () => {
  const { nodes, materials } = useGLTF('/gltf/shirt.glb') as GLTFResult;

  const activeButtons = use3dSelectedOption('5700');
  const activeButtonThreadColor = use3dSelectedOption('5800');
  const activeThreadColor = use3dSelectedOption('10000');

  // Material updates based on selected options
  useEffect(() => {
    materials.ButtonMaterial.color.set(
      activeButtons.data?.option3d?.materialValue && activeButtons.data.option3d.materialValue !== 'null'
        ? activeButtons.data.option3d.materialValue
        : '#fff'
    );
    materials.ButtonThreadMaterial.color.set(
      activeButtonThreadColor?.data?.option3d?.materialValue &&
        activeButtonThreadColor?.data?.option3d.materialValue !== 'null'
        ? activeButtonThreadColor.data.option3d.materialValue
        : '#fff'
    );
    materials.EmbroideryMaterial.color.set(
      activeThreadColor?.data?.option3d?.materialValue && activeThreadColor.data.option3d.materialValue !== 'null'
        ? activeThreadColor.data.option3d.materialValue
        : '#fff'
    );
  }, [activeButtons, activeButtonThreadColor, activeThreadColor]);

  return { nodes, materials };
};

useGLTF.preload('/gltf/shirt.glb');
