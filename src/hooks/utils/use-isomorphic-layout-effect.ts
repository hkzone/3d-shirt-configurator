'use client';

import { useEffect, useLayoutEffect } from 'react';

const useIsomorphicLayoutEffect: typeof useLayoutEffect = (...arguments_) => {
  const effectHook = typeof window === 'undefined' ? useEffect : useLayoutEffect;

  return effectHook(...arguments_);
};

export default useIsomorphicLayoutEffect;
