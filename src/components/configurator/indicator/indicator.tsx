import { Chip } from '@nextui-org/chip';

type IndicatorProps = {
  title: string;
};

export const Indicator = ({ title }: IndicatorProps) => {
  return (
    <Chip className='p-4 uppercase' color='primary' radius='sm' variant='bordered'>
      {title}
    </Chip>
  );
};
