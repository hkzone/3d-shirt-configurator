import React from 'react';
import Image, { ImageProps } from 'next/image';

type Props = React.PropsWithRef<ImageProps>;

const normalizeSrc = (src: string) => (src[0] === '/' ? src.slice(1) : src);

interface cloudinaryLoaderProps {
  src: string;
  width: number | string;
  quality?: number | string;
}

export function cloudinaryLoader({ src, width, quality }: cloudinaryLoaderProps) {
  const params = ['f_auto', 'c_limit', 'w_' + width, 'q_' + (quality || 'auto')];

  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${params.join(',')}/${normalizeSrc(src)}`;
}

const CloudinaryImage = ({ alt, ...props }: Props) => <Image alt={alt} loader={cloudinaryLoader} {...props} />;

export { CloudinaryImage };
