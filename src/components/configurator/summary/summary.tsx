import { Divider } from '@nextui-org/divider';
import React, { useEffect, useMemo } from 'react';
import { Button } from '@nextui-org/button';
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover';

import { useSelectedProduct } from '@/hooks/api/use-selected-product';
import { useOptions } from '@/hooks/api/use-options';
import { useAppConfig } from '@/providers/app-config';
import { useUpdateCamera } from '@/hooks/api/use-update-camera';
import { CloudinaryImage } from '@/components/common/cloudinary-image';

import { STEPS } from '../configurator/configurator';

interface SummaryProps {
  handleStepChange: (step: number) => void;
}

const Summary = React.memo(({ handleStepChange }: SummaryProps) => {
  const { selectedProduct, isLoading: isProductLoading, error: productError } = useSelectedProduct();
  const { data, isLoading: isOptionsLoading, error: optionsError } = useOptions();
  const { mutate: _updateCamera } = useUpdateCamera();
  const { dispatch } = useAppConfig();

  const image = selectedProduct?.images.find((img) => img.alt === 'Wave');

  const selectedOptions = useMemo(() => {
    return data?.customizationSteps[0].attributes
      .flatMap((attr) => attr.options.filter((option) => option.isSelected).map((option) => option.name))
      .filter(Boolean);
  }, [data]);

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

  if (isProductLoading || isOptionsLoading) return <div>Loading...</div>;
  if (productError || optionsError) return <div>Error loading data. Please try again later.</div>;
  if (!selectedProduct) return <div>No product selected.</div>;

  return (
    <div className='w-full px-4  pb-16 h-full overflow-y-scroll scrollbar-hide'>
      <div>
        <div className='max-sm:flex-col flex justify-between py-5 gap-5 sm:gap-12'>
          <div className='flex gap-6'>
            <div className='w-14 h-14 md:h-14 md:w-14 relative min-w-14'>
              <CloudinaryImage
                fill
                alt={selectedProduct.information.title ?? 'image'}
                className=' object-cover'
                sizes='56px'
                src={image?.url ?? '/default_fap0w2.png'}
              />
            </div>
            <div className='flex flex-col'>
              <p className='font-bold'>{STEPS[0].title}</p>
              <p className='text-default-700 text-xs sm:text-sm'>{selectedProduct.information.title}</p>
            </div>
          </div>
          <Button
            aria-label='Edit Product Details'
            className='p-4 uppercase'
            color='primary'
            radius='sm'
            variant='bordered'
            onPress={() => handleStepChange(0)}
          >
            Edit
          </Button>
        </div>
        <Divider />
        <div className='max-sm:flex-col  flex justify-between py-5 gap-5 sm:gap-12'>
          <div className='flex flex-col '>
            <p className='font-bold'>{STEPS[1].title}</p>
            <p className='text-default-700 text-xs sm:text-sm'>{selectedOptions?.join(', ')}</p>
          </div>
          <Button
            aria-label='Edit Customization Options'
            className='p-4 uppercase'
            color='primary'
            radius='sm'
            variant='bordered'
            onPress={() => handleStepChange(1)}
          >
            Edit
          </Button>
        </div>
      </div>
      <Divider />
      <div className='flex justify-end pt-3 font-bold uppercase'>{`Total: ${selectedProduct.price}`}</div>
      <div className='flex justify-end'>
        <Popover>
          <PopoverTrigger>
            <Button className='p-4 uppercase my-8' color='primary' radius='sm' size='lg' variant='bordered'>
              add to the cart
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className='px-1 py-2 max-w-48 sm:max-w-56'>
              <div className='text-small font-bold'>This is a demo version of the 3D Shirt Configurator.</div>
              <div className='pt-4 text-tiny pb-3'>
                For full implementation and to enable purchasing, please reach me out.
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
});

Summary.displayName = 'Summary';

export { Summary };
