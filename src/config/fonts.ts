import { Inter as FontSans, Playfair_Display as FontDisplay, MonteCarlo as FontItalic } from 'next/font/google';

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const fontDisplay = FontDisplay({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '600'],
});

export const fontItalic = FontItalic({
  subsets: ['latin'],
  variable: '--font-italic',
  weight: '400',
});
