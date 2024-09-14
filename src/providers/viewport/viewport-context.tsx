import { createContext } from 'react';

interface ViewportContextProps {
  isMobile: boolean;
  isTablet: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
  isDesktop: boolean;
  isTouch: boolean;
  innerWidth: number;
  innerHeight: number;
  fullWidth: number;
  fullHeight: number;
}

const ViewportContext = createContext<ViewportContextProps>({
  isMobile: false,
  isTablet: false,
  isLandscape: false,
  isPortrait: false,
  isDesktop: false,
  isTouch: false,
  innerWidth: 0,
  innerHeight: 0,
  fullWidth: 0,
  fullHeight: 0,
});

export default ViewportContext;
