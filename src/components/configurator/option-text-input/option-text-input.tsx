import type { Option } from '@/types/product';

import { Input } from '@nextui-org/input';

import { useUpdateValue } from '@/hooks/api/use-update-value';
import { use3dSelectedOption } from '@/hooks/api/use-3d-selected-option';

interface OptionTextInputProps {
  attributeId: number;
  code: string;
  options: Option[];
}

export function OptionTextInput({ attributeId, code, options }: OptionTextInputProps) {
  const { data } = use3dSelectedOption(code);

  const { mutate: _updateValue } = useUpdateValue();

  const handleValueUpdate = (option: Option, value: string) => {
    _updateValue({ params: { attributeId, attributeCode: code, optionCode: option.code, value } });
  };

  return (
    <>
      {options.map((option) => (
        <Input
          key={option.id}
          maxLength={data.option3d?.maxLength ?? 12}
          size='lg'
          type='text'
          value={option.value ?? ''}
          variant='faded'
          onValueChange={(value) => handleValueUpdate(option, value)}
        />
      ))}
    </>
  );
}
