'use client';

import React, { ReactNode, useReducer } from 'react';
import { Vector2 } from 'three';

import { appConfigReducer } from './app-config-reducer';
import { AppConfigContext } from './app-config-context';

// Provider component for the camera configuration context
export const AppConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appConfigReducer, {
    cameraConfig: {
      position: { x: 0, y: 0, z: 2 },
      target: { x: 0, y: 0, z: 0 },
    },
    isLoaded: false,
    webglTransitionProgress: 0,
    modelOffset: new Vector2(),
    glViewport: { width: 0, height: 0 },
  });

  return <AppConfigContext.Provider value={{ state, dispatch }}>{children}</AppConfigContext.Provider>;
};
