import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { get3dSteps } from '@/server/actions';
import { CONFIG_3D_STEPS_QUERY_KEY } from '@/constants';

import { useOptions } from './use-options';

export const use3dSelectedOption = (code: string) => {
  const { data: stepsData, isLoading, error } = useOptions();

  const attribute = stepsData?.customizationSteps[0].attributes.filter((el) => el.code === code)[0] || null;

  const {
    data: steps3dData,
    isLoading: isLoading2,
    error: error2,
  } = useQuery({
    queryKey: [CONFIG_3D_STEPS_QUERY_KEY],
    queryFn: () => get3dSteps(),
    placeholderData: keepPreviousData,
  });

  let option, option3d;

  if (steps3dData && attribute) {
    option3d = steps3dData.customizationSteps.attributes
      .filter((el) => el.code === code)[0]
      .options.filter((el) => el.code === attribute.selectedOption)[0];
    option = attribute.options.filter((el) => el.code === attribute.selectedOption)[0];
  }

  return { data: { option, option3d }, isLoading: isLoading && isLoading2, error: error && error2 };
};
