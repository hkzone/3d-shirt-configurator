'use client';

import type { LinkProps as NextLinkProps } from 'next/link';

import { forwardRef } from 'react';
import { useButton, Ripple, Spinner, ButtonProps as BaseButtonProps } from '@nextui-org/react';
import { motion, type AnimationProps, MotionProps } from 'framer-motion';
import Link from 'next/link';

import { cn } from '@/utils/cn';

type ShinyButtonProps = BaseButtonProps & NextLinkProps & React.ComponentPropsWithRef<'a'> & MotionProps;
const MotionLink = motion(Link);

const animationProps = {
  initial: { '--x': '100%', scale: 0.8 },
  animate: { '--x': '-100%', scale: 1 },
  whileTap: { scale: 0.95 },
  transition: {
    repeat: Infinity,
    repeatType: 'loop',
    repeatDelay: 1,
    type: 'spring',
    stiffness: 20,
    damping: 15,
    mass: 2,
    scale: {
      type: 'spring',
      stiffness: 200,
      damping: 5,
      mass: 0.5,
    },
  },
} as AnimationProps;

const ShinyButton = forwardRef<HTMLAnchorElement, ShinyButtonProps>((props, ref) => {
  const {
    children,
    spinnerSize,
    spinner = <Spinner color='current' size={spinnerSize} />,
    spinnerPlacement,
    startContent,
    endContent,
    isLoading,
    disableRipple,
    getRippleProps,
  } = useButton({
    ...props,
  });

  const { ripples, onClear } = getRippleProps();

  return (
    <MotionLink
      ref={ref}
      href={props.href}
      {...animationProps}
      className={cn(
        'relative overflow-hidden px-6 py-2 font-medium backdrop-blur-xl transition-[box-shadow] duration-300 ease-in-out hover:shadow dark:bg-[radial-gradient(circle_at_50%_0%,hsl(var(--nextui-primary)/10%)_0%,transparent_60%)] dark:hover:shadow-[0_0_20px_hsl(var(--nextui-primary)/10%)]',
        props.className
      )}
    >
      <span
        className='relative block h-full text-sm uppercase tracking-wide  dark:font-light'
        style={{
          maskImage:
            'linear-gradient(-75deg,hsl(var(--nextui-primary)) calc(var(--x) + 20%),transparent calc(var(--x) + 30%),hsl(var(--nextui-primary)) calc(var(--x) + 100%))',
        }}
      >
        {startContent}
        {isLoading && spinnerPlacement === 'start' && spinner}
        {children}
        {isLoading && spinnerPlacement === 'end' && spinner}
        {endContent}
      </span>
      <span
        className='absolute inset-0 z-10 block rounded-[inherit] bg-[linear-gradient(-75deg,hsl(var(--nextui-primary)/10%)_calc(var(--x)+20%),hsl(var(--nextui-primary)/50%)_calc(var(--x)+25%),hsl(var(--nextui-primary)/10%)_calc(var(--x)+100%))] p-px'
        style={{
          mask: 'linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box,linear-gradient(rgb(0,0,0), rgb(0,0,0))',
          maskComposite: 'exclude',
        }}
      />
      {!disableRipple && <Ripple ripples={ripples} onClear={onClear} />}
    </MotionLink>
  );
});

ShinyButton.displayName = 'ShinyButton';

export { ShinyButton };
