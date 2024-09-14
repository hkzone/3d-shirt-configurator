import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Vector2 } from 'three';
import { useThree } from '@react-three/fiber';

type PointerContextType = {
  pointer: Vector2;
};

const PointerContext = createContext<PointerContextType | null>(null);

export const PointerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { size } = useThree();
  const [pointer] = useState(() => new Vector2());

  const updatePointer = useCallback(
    (x: number, y: number) => {
      pointer.x = (x / size.width) * 2 - 1;
      pointer.y = -(y / size.height) * 2 + 1;
    },
    [size, pointer]
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      const { clientX, clientY } = event;

      updatePointer(clientX, clientY);
    },
    [updatePointer]
  );

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      const { clientX, clientY } = event.touches[0];

      updatePointer(clientX, clientY);
    },
    [updatePointer]
  );

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchstart', handleTouchMove);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchstart', handleTouchMove);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return <PointerContext.Provider value={{ pointer }}>{children}</PointerContext.Provider>;
};

export function usePointer(): Vector2 {
  const context = useContext(PointerContext);

  if (!context) {
    throw new Error('usePointer must be used within a PointerProvider');
  }

  return context.pointer;
}
