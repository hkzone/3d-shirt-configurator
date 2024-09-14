import { CardFooter } from '@nextui-org/card';
import React, { useEffect } from 'react';

import { Card, CardBody } from '@/components/common/card';
import { subtitle } from '@/components/common/primitives';
import { useSelectProduct } from '@/hooks/api/use-select-product';
import { useProducts } from '@/hooks/api/use-products';
import breakpoints from '@/utils/tailwind-breakpoints';
import { useUpdateCamera } from '@/hooks/api/use-update-camera';
import { useAppConfig } from '@/providers/app-config';
import { cn } from '@/utils/cn';
import { CloudinaryImage } from '@/components/common/cloudinary-image';

const ProductSelector = React.memo(() => {
  const { data, isLoading, error } = useProducts();
  const { mutate: _selectProduct } = useSelectProduct();

  const { mutate: _updateCamera } = useUpdateCamera();
  const { dispatch } = useAppConfig();

  useEffect(() => {
    _updateCamera(
      { params: {} },
      {
        onSuccess: (data) => {
          if (data?.cameraConfig) {
            dispatch({
              type: 'UPDATE_CAMERA',
              payload: { cameraConfig: data?.cameraConfig },
            });
          }
        },
      }
    );
  }, []);

  const handleValueSelect = (SKU: string) => {
    _selectProduct({ params: { SKU } });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;
  if (!data) return null;

  return (
    <div className='w-full h-full  pb-4 md:pb-20 overflow-y-scroll scrollbar-hide'>
      <h2 className={subtitle({ class: 'mt-6 font-bold pb-4' })}>Choose your options</h2>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-3 gap-[2.4vw] md:gap-[1.4vw]  xl:gap-[1vw]'>
        {data.map((product) => {
          const image = product.images.find((image) => image.alt === 'Wave');

          return (
            <Card
              key={product.sku}
              className={cn({ '!bg-content2/[0.0435] before:border-divider/40': product.isSelected })}
              isPressable={true}
              radius='md'
              onPress={() => {
                handleValueSelect(product.sku);
              }}
            >
              <div className='m-0 flex flex-col'>
                <CardBody
                  className={cn(
                    'w-[calc((100vw-7.2vw-24px-4px)/2)]  sm:w-[calc((100vw-9.6vw-36px-6px)/3)] md:w-[calc((50vw-4.2vw-24px-4px-0.5rem)/2)] xl:w-[calc((50vw-4vw-36px-6px-0.5rem)/3)]',
                    'aspect-[4/3]'
                  )}
                >
                  <CloudinaryImage
                    alt={product.information.title}
                    className='object-cover'
                    fill={true}
                    sizes={`(max-width:  ${breakpoints.sm}px) 50vw, (max-width: ${breakpoints.md}px) 33vw, (max-width:  ${breakpoints.xl}px) 25vw, 16.7vw`}
                    src={image!.url}
                  />
                </CardBody>
                <CardFooter className='flex items-start justify-start flex-col'>
                  <p className='text-xs  font-normal text-default-700'>{product.information.season}</p>
                  <div className='line-clamp-1 text-xs sm:text-md font-bold text-left mt-[3px] sm:mt-2'>
                    {product.information.title}
                  </div>
                  <div className='text-xs font-light mt-[3px] sm:mt-1.5'>{product.price}</div>
                </CardFooter>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
});

ProductSelector.displayName = 'ProductSelector';

export { ProductSelector };
