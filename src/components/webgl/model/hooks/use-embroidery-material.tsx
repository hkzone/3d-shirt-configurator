import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

import { fontSans, fontItalic } from '@/config/fonts';
import { use3dSelectedOption } from '@/hooks/api/use-3d-selected-option';
import { useSelectedProduct } from '@/hooks/api/use-selected-product';

const CANVAS = {
  DIMENSION: { x: 236.6 * 2, y: 200 },
  MARGIN: { x: 0, y: 45 },
};

const FONT_MAP: Record<string, { font: string; fontSize: string }> = {
  Inter: {
    font: fontSans.style.fontFamily.split(',')[0].replace(/'/g, ''),
    fontSize: '48pt',
  },
  MonteCarlo: {
    font: fontItalic.style.fontFamily.split(',')[0].replace(/'/g, ''),
    fontSize: '58pt',
  },
};

export const useEmbroideryMaterial = () => {
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));

  const { selectedProduct } = useSelectedProduct();

  const { data: fontData } = use3dSelectedOption('8000');
  const { data: textData } = use3dSelectedOption('9000');
  const { data: colorData } = use3dSelectedOption('10000');

  const text = textData?.option?.value ?? '';

  const [font, fontSize] = useMemo(() => {
    if (
      fontData.option3d &&
      fontData.option3d.materialValue !== null &&
      fontData.option3d.materialValue !== undefined
    ) {
      const fontConfig = FONT_MAP[fontData.option3d.materialValue];

      return [fontConfig.font, fontConfig.fontSize];
    }

    return [null, null];
  }, [fontData]);

  const color = useMemo(() => {
    if (selectedProduct && selectedProduct.information.mapcommoncolor) {
      return colorData.option3d?.materialValue || selectedProduct.information.mapcommoncolor;
    }

    return null;
  }, [selectedProduct, colorData]);

  const texture = useMemo(() => {
    if (!color || !font || !fontSize) return null;

    const ctx = canvasRef.current.getContext('2d');

    if (ctx) {
      ctx.font = `${fontSize} ${font}`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.clearRect(0, 0, CANVAS.DIMENSION.x, CANVAS.DIMENSION.y);
      ctx.fillStyle = color;
      ctx.fillText(text, CANVAS.MARGIN.x, CANVAS.MARGIN.y);
    }

    const t = new THREE.Texture(canvasRef.current);

    t.needsUpdate = true;

    return t;
  }, [color, font, fontSize, text]);

  const embroideryMaterial = useRef<THREE.MeshBasicMaterial>(
    new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
    })
  );

  useEffect(() => {
    if (embroideryMaterial.current && texture) {
      embroideryMaterial.current.map = texture;
    }
  }, [texture]);

  return { embroideryMaterial: embroideryMaterial.current };
};
