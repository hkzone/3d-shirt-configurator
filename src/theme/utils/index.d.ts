declare interface ColorShades {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

declare interface ThemeColor extends ColorShades {
  foreground: string;
  DEFAULT: string;
}

declare type Theme = 'light' | 'dark';
