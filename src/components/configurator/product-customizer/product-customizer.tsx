import { Accordion, AccordionItem } from '@nextui-org/accordion';
import { Divider } from '@nextui-org/divider';

import { OptionSelector } from '@/components/configurator/option-selector';
import { Indicator } from '@/components/configurator/indicator';
import { subtitle } from '@/components/common/primitives';
import { useOptions } from '@/hooks/api/use-options';
import { useUpdateCamera } from '@/hooks/api/use-update-camera';
import breakpoints from '@/utils/tailwind-breakpoints';
import { useAppConfig } from '@/providers/app-config';
import { CloudinaryImage } from '@/components/common/cloudinary-image';

import { OptionTextInput } from '../option-text-input';

function ProductCustomizer() {
  const { data, isLoading, error } = useOptions();
  const { mutate: _updateCamera } = useUpdateCamera();
  const { dispatch } = useAppConfig();

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

  return (
    <div className='w-full h-full pb-16 overflow-y-scroll scrollbar-hide'>
      <h2 className={subtitle({ class: 'mt-6 font-bold' })}>Choose your options</h2>
      <Accordion
        fullWidth
        itemClasses={{ indicator: '!rotate-0', trigger: 'py-5' }}
        onSelectionChange={(key) => {
          const arr = Array.from(key);
          const id = arr.length > 0 ? arr[0] : null;

          if (id) handleClick(String(id));
        }}
      >
        {data.customizationSteps[0].attributes
          .filter((attribute) => {
            if (attribute.options?.length === 0 || (attribute.options.length === 1 && !attribute.options[0].code))
              return false;

            return true;
          })
          .map((attribute) => (
            <AccordionItem
              key={attribute.attributeId}
              aria-label={attribute.title}
              indicator={<Indicator title='Edit' />}
              startContent={
                <div className='w-20 h-20 md:h-14 md:w-14 relative'>
                  <CloudinaryImage
                    alt={attribute.options[0].name ?? 'image'}
                    className='object-contain'
                    fill={true}
                    sizes={`(max-width: ${breakpoints.md}px) 80px, 56px`}
                    src={attribute.options[0].image ? attribute.options[0].image : '/default_fap0w2.png'}
                  />
                </div>
              }
              title={attribute.title}
            >
              {attribute.type === 'TXT' ? (
                <div className='flex flex-wrap gap-6 p-6 pt-0'>
                  <OptionTextInput
                    attributeId={attribute.attributeId}
                    code={attribute.code}
                    options={attribute.options}
                  />
                </div>
              ) : (
                <div className='grid [grid-template-columns:repeat(auto-fill,minmax(9.6rem,1fr))] lg:[grid-template-columns:repeat(auto-fill,minmax(10.6rem,1fr))]  gap-6 p-4 pt-0'>
                  {attribute.options.map((option) => (
                    <OptionSelector
                      key={option.id}
                      attributeId={attribute.attributeId}
                      code={attribute.code}
                      option={option}
                    />
                  ))}
                </div>
              )}
            </AccordionItem>
          ))}
      </Accordion>
      <Divider />
    </div>
  );
}

export { ProductCustomizer };
