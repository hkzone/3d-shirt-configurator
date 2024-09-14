import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Product } from '@/types/product';
import { ALL_PRODUCT_QUERY_KEY } from '@/constants';

interface UpdateOptionsArgs {
  SKU: string;
}

const useSelectProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ params }: { params: UpdateOptionsArgs }) => {
      const { SKU } = params;

      return Promise.resolve({ SKU });
    },
    onMutate: async ({ params }: { params: UpdateOptionsArgs }) => {
      const { SKU } = params;

      await queryClient.cancelQueries({ queryKey: [ALL_PRODUCT_QUERY_KEY] });

      const oldData = queryClient.getQueryData<Product[]>([ALL_PRODUCT_QUERY_KEY]);

      if (oldData) {
        const newData = structuredClone(oldData);

        newData.forEach((el) => {
          if (el.sku === SKU) {
            el.isSelected = true;
          } else el.isSelected = false;
        });

        queryClient.setQueryData<Product[]>([ALL_PRODUCT_QUERY_KEY], newData);
      }

      return { oldData };
    },

    onError: (_err, _variables, context) => {
      if (context?.oldData) {
        queryClient.setQueryData<Product[]>([ALL_PRODUCT_QUERY_KEY], context.oldData);
      }
    },
  });
};

export { useSelectProduct };
