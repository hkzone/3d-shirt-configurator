/** @type {import('tailwindcss').Config} */
import { nextui } from '@nextui-org/theme';
import plugin from 'tailwindcss/plugin';

import { theme } from './src/theme/theme';
import { PAGE_TRANSITION_SECONDS } from './src/config/page-transition';

const config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/components/(accordion|button|card|chip|divider|input|link|navbar|popover|toggle|ripple|spinner).js',
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '840px',
      lg: '1024px',
      xl: '1280px',
      xxl: '1536px',
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        title: ['var(--font-display)'],
        mono: ['var(--font-geist-mono)'],
      },
      spacing: {
        gap: 'max(1em, 3.5vw)',
        navbarHeight: 'var(--nav-height)',
        drawerHeight: 'var(--drawer-height)',
      },
      screens: {
        xs: '480px',
        xxs: '380px',
        xxxl: '1680px',
      },
      animation: {
        'shimmer': 'shimmer 4s infinite 1s;',
      },
      keyframes: {
        'shimmer': {
          '100%': {
            transform: 'none!important',
          },
          '0%, 100%': {
            backgroundPosition: 'calc(-100% - 100px) 0',
          },
          ' 60%': {
            backgroundPosition: 'calc(100% + 100px) 0',
          },
        },
      },
      transitionDelay: {
        pageTransition: `${PAGE_TRANSITION_SECONDS}s`,
      },
    },
  },
  darkMode: 'class',
  plugins: [
    require('postcss-100vh-fix'),
    plugin(function ({ addComponents }) {
      addComponents({
        //https://nextjs.org/docs/pages/api-reference/components/image#known-browser-bugs
        '@supports (font: -apple-system-body) and (-webkit-appearance: none)': {
          'img[loading="lazy"]': {
            'clip-path': 'inset(0.6px)',
          },
        },
      });
    }),
    nextui(theme as any),
    require('tailwind-scrollbar-hide'),
  ],
};

export default config;
