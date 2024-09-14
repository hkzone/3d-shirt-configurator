import { generateThemeColor } from './utils';

//convert shadcn style theme to nextui theme
const light = {
  'background': '0 0% 100%',
  'foreground': '0 0% 15%',
  'muted': ' 240 3.83% 46.08%',
  'muted-foreground': '0 0% 15%',
  'popover': '0 0% 100%',
  'popover-foreground': ' 240 10% 3.9%',
  'card': '0 0% 100%',
  'card-foreground': ' 240 10% 3.9%',
  'card2': '0 0% 0%,0',
  'card2-foreground': ' 240 10% 3.9%',
  'border': '0 0% 0%',
  'input': '240 5.9% 90%',
  'primary': '240 5.9% 10%',
  'primary-foreground': '0 0% 98%',
  'secondary': '240 4.8% 95.9%',
  'secondary-foreground': '240 5.9% 10%',
  'accent': '240 4.8% 95.9%',
  'accent-foreground': '240 5.9% 10%',
  'destructive': '0 84.2% 60.2%',
  'destructive-foreground': '0 0% 98%',
  'ring': '240 5% 64.9%',
  'radius': '0.5rem',
};

const dark = {
  'background': '240, 72%, 7%',
  'foreground': '228, 100%, 94%',
  'card': '0 0% 0%',
  'card-foreground': ' 228, 100%, 94%',
  'card2': '0 0% 100%',
  'card2-foreground': ' 228, 100%, 94%',
  'popover': '0 0% 0%',
  'popover-foreground': ' 0 0% 98%',
  'primary': '0 0% 98%',
  'primary-foreground': ' 240 5.9% 10%',
  'secondary': '240 3.7% 15.9%',
  'secondary-foreground': '0 0% 98%',
  'muted': '236, 15%, 38%',
  'muted-foreground': '231, 20%, 73%',
  'accent': '240 3.7% 15.9%',
  'accent-foreground': '0 0% 98%',
  'destructive': '0, 63%, 31%',
  'destructive-foreground': '0 85.7% 97.3%',
  'border': '0 0% 100%',
  'input': '240 3.7% 15.9%',
  'ring': '240 4.9% 83.9%',
};

export const theme = {
  'themes': {
    'light': {
      'colors': {
        'default': {
          ...generateThemeColor(`hsl(${light.muted})`, 'light'),
          foreground: `hsl(${light['muted-foreground']})`,
        },
        'primary': {
          ...generateThemeColor(`hsl(${light.primary})`, 'light'),
          foreground: `hsl(${light['primary-foreground']})`,
        },
        'secondary': {
          ...generateThemeColor(`hsl(${light.secondary})`, 'light'),
          foreground: `hsl(${light['secondary-foreground']})`,
        },
        'danger': {
          ...generateThemeColor(`hsl(${light.destructive})`, 'light'),
          foreground: `hsl(${light['destructive-foreground']})`,
        },
        'background': `hsl(${light.background})`,
        'foreground': {
          ...generateThemeColor(`hsl(${light.foreground})`, 'light'),
        },
        'content1': {
          'DEFAULT': `hsl(${light.card})`,
          'foreground': `hsl(${light['card-foreground']})`,
        },
        'content2': {
          'DEFAULT': `hsla(${light.card2})`,
          'foreground': `hsl(${light['card2-foreground']})`,
        },
        'content3': {
          'DEFAULT': `hsl(${light.accent})`,
          'foreground': `hsl(${light['accent-foreground']})`,
        },
        'focus': `hsl(${light.ring})`,
        'overlay': `hsl(${light.popover})`,
        'divider': `hsl(${light.border})`,
      },
      layout: { 'divider-opacity': 0.1 },
    },
    'dark': {
      'colors': {
        'default': {
          ...generateThemeColor(`hsl(${dark.muted})`, 'dark'),
          foreground: `hsl(${dark['muted-foreground']})`,
        },
        'primary': {
          ...generateThemeColor(`hsl(${dark.primary})`, 'dark'),
          foreground: `hsl(${dark['primary-foreground']})`,
        },
        'secondary': {
          ...generateThemeColor(`hsl(${dark.secondary})`, 'dark'),
          foreground: `hsl(${dark['secondary-foreground']})`,
        },
        'danger': {
          ...generateThemeColor(`hsl(${dark.destructive})`, 'dark'),
          foreground: `hsl(${dark['destructive-foreground']})`,
        },
        'background': `hsl(${dark.background})`,
        'foreground': {
          ...generateThemeColor(`hsl(${dark.foreground})`, 'dark'),
        },
        'content1': {
          'DEFAULT': `hsl(${dark.card})`,
          'foreground': `hsl(${dark['card-foreground']})`,
        },
        'content2': {
          'DEFAULT': `hsl(${dark.card2})`,
          'foreground': `hsl(${dark['card2-foreground']})`,
        },
        'content3': {
          'DEFAULT': `hsl(${dark.accent})`,
          'foreground': `hsl(${dark['accent-foreground']})`,
        },
        'focus': `hsl(${dark.ring})`,
        'overlay': `hsl(${dark.popover})`,
        'divider': `hsl(${dark.border})`,
      },
      layout: { 'divider-opacity': 0.1 },
    },
  },
};
