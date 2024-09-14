import React from 'react';
import { Button } from '@nextui-org/button';

import { cn } from '@/utils/cn';
import Arrow from '@/assets/svgs/nav-arrow.svg';

interface SliderNavButtonProps extends React.ComponentProps<'div'> {}

const SliderNavButton = ({ className, ...props }: SliderNavButtonProps) => (
  <div className={cn('absolute top-1/2 -translate-y-1/2 overflow-hidden', className)} {...props}>
    <Button isIconOnly className='relative  bg-opacity-50 filter-[blur(20px)] rounded-[50%]'>
      <Arrow className='fill-primary w-full h-full' />
    </Button>
  </div>
);

export default SliderNavButton;
