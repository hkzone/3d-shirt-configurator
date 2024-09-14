'use client';

import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { folder, useControls } from 'leva';
import * as THREE from 'three';
import { useTheme } from 'next-themes';

import { useViewport } from '@/providers/viewport';

import { PlexusEffect } from './plexus-effect';

const INITIAL_CONFIG = {
  maxParticleCount: { mobile: 600, desktop: 800 },
  radius: 2.3,
  heightScalingFactor: 1.2,
  minDistance: 0.33,
  limitConnections: false,
  maxConnections: 5,
  uniforms: {
    uMinSize: { value: 0.2 },
    uMaxSize: { value: 1.6 },
    uOpacity: { value: 0.2 },
    uSpeed: { value: 0.5 },
    uAlpha: { value: 1 },
  },
};

export function PexusBackground() {
  const { isMobile } = useViewport();
  const { theme } = useTheme();

  const plexusEffect = useMemo(() => {
    const plexus = new PlexusEffect({
      ...INITIAL_CONFIG,
      maxParticleCount: isMobile ? INITIAL_CONFIG.maxParticleCount.mobile : INITIAL_CONFIG.maxParticleCount.desktop,
    });

    plexus.setLayers(1);

    return plexus;
  }, [isMobile]);

  const texture = useTexture({
    particle: `/textures/circle_05.png`,
  });

  texture.particle.colorSpace = THREE.SRGBColorSpace;

  useEffect(() => {
    plexusEffect.particleTexture = texture.particle;
  }, [texture, plexusEffect]);

  useEffect(() => {
    if (theme) {
      plexusEffect.lineColor = theme === 'light' ? new THREE.Color(0xffffff) : new THREE.Color(0x2c2222);
    }
  }, [theme, plexusEffect]);

  useFrame((_state, delta) => {
    plexusEffect.render(delta);
  });

  useControls('Background', {
    maxParticleCount: {
      value: isMobile ? INITIAL_CONFIG.maxParticleCount.mobile : INITIAL_CONFIG.maxParticleCount.desktop,
      min: 1,
      max: 1000,
      onEditEnd: (value: number) => {
        plexusEffect.maxParticleCount = value;
        plexusEffect.destroy();
        plexusEffect.init();
      },
    },
    radius: {
      value: INITIAL_CONFIG.radius,
      min: 0,
      max: 10,
      onEditEnd: (value: number) => {
        plexusEffect.radius = value;
        plexusEffect.destroy();
        plexusEffect.init();
      },
    },
    heightScalingFactor: {
      value: INITIAL_CONFIG.heightScalingFactor,
      min: 0,
      max: 2,
      onEditEnd: (value: number) => {
        plexusEffect.heightScalingFactor = value;
        plexusEffect.destroy();
        plexusEffect.init();
      },
    },
    minDistance: {
      value: INITIAL_CONFIG.minDistance,
      min: 0,
      max: 2,
      onEditEnd: (value: number) => {
        plexusEffect.minDistance = value;
        plexusEffect.destroy();
        plexusEffect.init();
      },
    },
    limitConnections: {
      value: INITIAL_CONFIG.limitConnections,
      onChange: (value: boolean) => (plexusEffect.limitConnections = value),
    },
    maxConnections: {
      value: 5,
      min: 0,
      max: 15,
      step: 1,
      onChange: (value: number) => (plexusEffect.maxConnections = value),
    },
    particles: folder({
      uMinSize: {
        value: INITIAL_CONFIG.uniforms.uMinSize.value,
        min: 0,
        max: 10,
        onChange: (value: number) => (plexusEffect.particleUniforms.uMinSize.value = value),
      },
      uMaxSize: {
        value: INITIAL_CONFIG.uniforms.uMaxSize.value,
        min: 0,
        max: 10,
        onChange: (value: number) => (plexusEffect.particleUniforms.uMaxSize.value = value),
      },
      uOpacity: {
        value: INITIAL_CONFIG.uniforms.uOpacity.value,
        min: 0,
        max: 1,
        onChange: (value: number) => (plexusEffect.particleUniforms.uOpacity.value = value),
      },
      uSpeed: {
        value: INITIAL_CONFIG.uniforms.uSpeed.value,
        min: 0,
        max: 2,
        onChange: (value: number) => (plexusEffect.particleUniforms.uSpeed.value = value),
      },
      uAlpha: {
        value: INITIAL_CONFIG.uniforms.uAlpha.value,
        min: 0,
        max: 1,
        onChange: (value: number) => (plexusEffect.particleUniforms.uAlpha.value = value),
      },
      uLineColor: {
        value: '#fff',
        onChange: (value: THREE.Color) => (plexusEffect.lineColor = new THREE.Color(value)),
      },
    }),
  });

  return <primitive object={plexusEffect} />;
}
