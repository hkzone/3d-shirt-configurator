'use client';

import { Vector2 } from 'three';

import { CameraConfig } from '@/types/product';

import { AppConfigState } from './app-config-context';

// Define the action types
export type Action =
  | { type: 'UPDATE_CAMERA'; payload: { cameraConfig: CameraConfig } }
  | { type: 'SET_LOADED' }
  | { type: 'SET_WEBGL_TRANSITION_PROGRESS'; payload: { webglTransitionProgress: number } }
  | { type: 'SET_MODEL_OFFSET'; payload: { modelOffset: Vector2 } }
  | { type: 'SET_GL_VIEWPORT'; payload: { glViewport: { width: number; height: number } } };

// Reducer function to manage the state
export const appConfigReducer = (state: AppConfigState, action: Action): AppConfigState => {
  switch (action.type) {
    case 'UPDATE_CAMERA':
      return { ...state, cameraConfig: action.payload.cameraConfig };
    case 'SET_LOADED':
      return { ...state, isLoaded: true };
    case 'SET_WEBGL_TRANSITION_PROGRESS':
      return { ...state, webglTransitionProgress: action.payload.webglTransitionProgress };
    case 'SET_MODEL_OFFSET':
      return { ...state, modelOffset: action.payload.modelOffset };
    case 'SET_GL_VIEWPORT':
      return { ...state, glViewport: action.payload.glViewport };
    default:
      return state;
  }
};
