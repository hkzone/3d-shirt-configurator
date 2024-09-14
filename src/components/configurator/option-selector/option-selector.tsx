import type { Option } from '@/types/product';

import { CardFooter, CardHeader } from '@nextui-org/card';
import { Tooltip } from '@nextui-org/tooltip';

import { Card, CardBody } from '@/components/common/card';
import { useSelectOption } from '@/hooks/api/use-select-option';
import { useUpdateCamera } from '@/hooks/api/use-update-camera';
import breakpoints from '@/utils/tailwind-breakpoints';
import { useAppConfig } from '@/providers/app-config';
import { cn } from '@/utils/cn';
import { CloudinaryImage } from '@/components/common/cloudinary-image';
import { useViewport } from '@/providers/viewport';

interface OptionSelectorProps {
  attributeId: number;
  code: string;
  option: Option;
}

function OptionSelector({ attributeId, code, option }: OptionSelectorProps) {
  const { mutate: _selectOption } = useSelectOption();
  const { mutate: _updateCamera } = useUpdateCamera();
  const { dispatch } = useAppConfig();
  const { isTouch } = useViewport();

  const handleOptionSelect = (option: Option) => {
    _selectOption({ params: { attributeId, attributeCode: code, optionCode: option.code } });
    _updateCamera(
      { params: { attributeCode: code, optionCode: option.code } },
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

  const cardBodyStyles = {
    '--before-bg': option.imageType === 'rgb' ? option.image : undefined,
  } as React.CSSProperties;

  return (
    <Card
      isPressable
      className={cn('w-40 sm:w-[unset] lg:min-w-48 relative', {
        'dark:!bg-content2/[0.0435] !bg-content2/[0.0435] before:border-divider/40': option.isSelected,
      })}
      onClick={() => handleOptionSelect(option)}
    >
      <CardHeader className='p-0 pt-1'>
        {option.description && (
          <Tooltip content={option.description}>
            <span
              className={cn(
                'absolute italic top-5 right-4 flex items-center justify-center pr-[1px] text-small bg-default-300 rounded-[50%] w-6 h-6',
                { 'hidden': isTouch }
              )}
            >
              i
            </span>
          </Tooltip>
        )}
      </CardHeader>
      <CardBody
        className={cn('h-20 w-20 sm:w-24 lg:h-24 mx-auto relative', {
          'before:bg-[var(--before-bg)]': option.imageType === 'rgb',
          'before:border-0': option.imageType !== 'rgb',
        })}
        style={cardBodyStyles}
      >
        {option.imageType !== 'rgb' && (
          <CloudinaryImage
            fill
            alt={option.name}
            className='object-contain'
            sizes={`(max-width: ${breakpoints.lg}) 80px, 96px`}
            src={option.image}
          />
        )}
      </CardBody>
      <CardFooter className='pt-0 py-4 px-2 text-xs  sm:text-sm justify-center leading-[1.1] h-[calc(2.5*1em)]'>
        {option.name}
      </CardFooter>
    </Card>
  );
}

export { OptionSelector };
