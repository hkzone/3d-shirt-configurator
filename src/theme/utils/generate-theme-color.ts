//github.com/xylish7/nextui-theme-generator/blob/main/src/lib/colors.ts
/// <reference path="./index.d.ts" />

import { readableColor } from 'color2k';
import Values from 'values.js';
import * as d3 from 'd3-color';

import { swapColorValues } from './swap-color-values';

const COLOR_WEIGHT = 17.5;

export function generateThemeColor(color: string, theme: Theme): ThemeColor {
  const values = new Values(color);
  const colorValues = values.all(COLOR_WEIGHT);
  const shades = colorValues.slice(0, colorValues.length - 1).reduce((acc, shadeValue, index) => {
    const d3Color = d3.color(shadeValue.rgbString());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (acc as any)[index === 0 ? 50 : index * 100] = d3Color!.formatHex();

    return acc;
  }, {} as ColorShades);

  return {
    ...(theme === 'light' ? shades : swapColorValues(shades)),
    foreground: readableColor(shades[500]),
    DEFAULT: shades[500],
  };
}
