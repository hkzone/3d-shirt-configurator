import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getProducts } from '@/server/actions';
import { Product } from '@/types/product';
import { ALL_PRODUCT_QUERY_KEY } from '@/constants';

// Custom hook to get the selected product
export const useSelectedProduct = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: [ALL_PRODUCT_QUERY_KEY],
    queryFn: () => getProducts(),
    placeholderData: keepPreviousData,
  });

  // Find the selected product
  const selectedProduct = data?.find((product: Product) => product.isSelected) || null;

  return { selectedProduct, isLoading, error };
};
