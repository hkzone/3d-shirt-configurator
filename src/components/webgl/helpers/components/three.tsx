'use client';

import { r3f } from '../global';

export const Three: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <r3f.In>{children}</r3f.In>;
};
