import type { Attribute } from '@/types/product';

import React from 'react';
import { useMemo, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import { Chip } from '@nextui-org/chip';

import 'swiper/css';
import 'swiper/css/free-mode';
import { useOptions } from '@/hooks/api/use-options';
import { useUpdateCamera } from '@/hooks/api/use-update-camera';
import { useAppConfig } from '@/providers/app-config';
import { cn } from '@/utils/cn';

import { OptionTextInput } from '../option-text-input';
import { OptionSelector } from '../option-selector';

function ProductCustomizerMobile() {
  const { data, isLoading, error } = useOptions();
  const { mutate: _updateCamera } = useUpdateCamera();
  const [selected, setSelected] = useState<Attribute | null>(null);
  const { dispatch } = useAppConfig();

  const selectedStep = useMemo(() => {
    if (!data || !selected) return null;

    return data.customizationSteps[0].attributes.find((attr) => attr.attributeId === selected.attributeId);
  }, [data, selected]);

  const handleClick = (attributeCode: string) => {
    _updateCamera(
      { params: { attributeCode } },
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
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;
  if (!data) return null;

  // Initialize selected if it's null and data is available
  if (!selected && data.customizationSteps[0]?.attributes[0]) {
    setSelected(data.customizationSteps[0].attributes[0]);
  }

  return (
    <div className='w-full h-full'>
      <Swiper
        freeMode={true}
        grabCursor={true}
        modules={[FreeMode]}
        preventClicks={true}
        preventClicksPropagation={true}
        simulateTouch={true}
        slidesPerView={'auto'}
        touchMoveStopPropagation={true}
      >
        {data.customizationSteps[0].attributes
          .filter((attribute) => {
            if (attribute.options?.length === 0 || (attribute.options.length === 1 && !attribute.options[0].code))
              return false;

            return true;
          })
          .map((attribute) => (
            <SwiperSlide
              key={attribute.attributeId}
              aria-label={attribute.title}
              className='flex !w-[unset] px-1.5 pt-5 first:pl-4 last:pr-4 '
            >
              <Chip
                className={cn('px-6 bg-default-100 ', {
                  'px-8 bg-foreground text-background': attribute.attributeId === selected?.attributeId,
                })}
                radius='lg'
                size='md'
                onClick={() => {
                  handleClick(attribute.code);
                  setSelected(attribute);
                }}
              >
                {attribute.title}
              </Chip>
            </SwiperSlide>
          ))}
      </Swiper>
      <Swiper
        freeMode={true}
        grabCursor={true}
        modules={[FreeMode]}
        preventClicks={true}
        preventClicksPropagation={true}
        simulateTouch={true}
        slidesPerView={'auto'}
        spaceBetween={3}
        touchMoveStopPropagation={true}
      >
        {selectedStep?.type === 'TXT' ? (
          <div className='flex flex-wrap gap-6 p-4 pt-6'>
            <OptionTextInput
              attributeId={selectedStep.attributeId}
              code={selectedStep.code}
              options={selectedStep.options}
            />
          </div>
        ) : (
          <>
            {selectedStep?.options.map((option) => (
              <SwiperSlide key={option.id} className='first:pl-4 last:pr-4 !w-[unset] p-1.5 pt-6'>
                <OptionSelector attributeId={selectedStep.attributeId} code={selectedStep.code} option={option} />
              </SwiperSlide>
            ))}
          </>
        )}
      </Swiper>
    </div>
  );
}

export { ProductCustomizerMobile };
