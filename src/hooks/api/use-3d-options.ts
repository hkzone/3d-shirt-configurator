import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { get3dSteps } from '@/server/actions';
import { CONFIG_3D_STEPS_QUERY_KEY } from '@/constants';

export const use3dOptions = () => {
  return useQuery({
    queryKey: [CONFIG_3D_STEPS_QUERY_KEY],
    queryFn: () => get3dSteps(),
    placeholderData: keepPreviousData,
  });
};
