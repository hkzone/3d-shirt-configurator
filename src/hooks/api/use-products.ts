import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getProducts } from '@/server/actions';
import { ALL_PRODUCT_QUERY_KEY } from '@/constants';

export const useProducts = () => {
  return useQuery({
    queryKey: [ALL_PRODUCT_QUERY_KEY],
    queryFn: () => getProducts(),
    placeholderData: keepPreviousData,
  });
};
