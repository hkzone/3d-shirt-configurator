import type { ScreensConfig } from 'tailwindcss/types/config';

import resolveConfig from 'tailwindcss/resolveConfig';

import tailwindConfig from '@/../tailwind.config';

const fullConfig = resolveConfig(tailwindConfig as any);

type ExtendedScreensConfig = ScreensConfig & {
  lg?: string;
  md?: string;
  sm?: string;
  xl?: string;
  xs?: string;
  xxl?: string;
  xxs?: string;
};

const screens = fullConfig?.theme?.screens as ExtendedScreensConfig;

const breakpoints = {
  xxs: Number.parseInt(screens?.xxs ?? '380', 10),
  xs: Number.parseInt(screens?.xs ?? '480', 10),
  sm: Number.parseInt(screens?.sm ?? '640', 10),
  md: Number.parseInt(screens?.md ?? '768', 10),
  lg: Number.parseInt(screens?.lg ?? '1024', 10),
  xl: Number.parseInt(screens?.xl ?? '1280', 10),
  xxl: Number.parseInt(screens?.xxl ?? '1536', 10),
} as const;

export default breakpoints;
