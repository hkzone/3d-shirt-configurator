'use client';

import { Dispatch, createContext, useContext } from 'react';
import { Vector2 } from 'three';

import { CameraConfig } from '@/types/product';

import { Action } from './app-config-reducer';

export interface AppConfigState {
  cameraConfig: CameraConfig;
  isLoaded: boolean;
  webglTransitionProgress: number;
  modelOffset: Vector2;
  glViewport: { width: number; height: number };
}

interface AppConfigContextType {
  state: AppConfigState;
  dispatch: Dispatch<Action>;
}

// Create context
export const AppConfigContext = createContext<AppConfigContextType | undefined>(undefined);

// Custom hook to use the app configuration context
export const useAppConfig = () => {
  const context = useContext(AppConfigContext);

  if (!context) {
    throw new Error('useAppConfig must be used within an AppConfigProvider');
  }

  return context;
};
