import type { PaginationOptions } from 'swiper/types';

import { cn } from '@/utils/cn';

const pagination: PaginationOptions = {
  clickable: true,
  renderBullet: (_, className) => {
    const bulletClassName = cn(
      'relative flex h-[1em] w-full justify-center rounded-[0] cursor-pointer',
      '[&.swiper-pagination-bullet-active>:first-child]:opacity-100',
      'before:absolute before:h-[2px] before:w-full before:bg-foreground before:opacity-25'
    );
    const progressClassName = cn(
      'progress absolute h-[2px] w-full origin-top-left scale-x-0 bg-foreground opacity-0',
      'transition-opacity duration-300 ease-in-out dark:bg-white'
    );

    return `<span class="${cn(className, bulletClassName)}"><div class="${progressClassName}"></div></span>`;
  },
};

export default pagination;
