import React from 'react';
import { Card as CardImpl, CardBody as CardBodyImpl, CardProps } from '@nextui-org/card';

import { cn } from '@/utils/cn';

const Card: React.FC<CardProps> = ({ className, ...props }) => {
  return (
    <CardImpl
      // @ts-ignore: Complex union type in className prop
      // This ignore allows us to use the desired classes without causing a type error.
      className={cn(
        'w-full relative m-0 p-1.5 bg-content2 shadow-none',
        'before:content before:box-content before:absolute before:top-0 before:left-0 before:border before:border-divider',
        'before:w-[calc(100%-2px)] before:h-[calc(100%-2px)] before:rounded-[inherit] before:pointer-events-none',
        'hover:bg-content2/[0.0235]',
        className
      )}
      {...props}
    />
  );
};

const CardBody: React.FC<CardProps> = ({ className, ...props }) => {
  return (
    <CardBodyImpl
      className={cn(
        'relative p-0 rounded-xl overflow-hidden isolate',
        'before:content box-content before:absolute before:top-0 before:left-0 before:border before:border-divider',
        'before:w-[calc(100%-2px)] before:h-[calc(100%-2px)] before:rounded-[inherit] before:pointer-events-none',
        className
      )}
      {...props}
    />
  );
};

export { Card, CardBody };
