import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CustomizationSteps } from '@/types/product';
import { CONFIG_STEPS_QUERY_KEY } from '@/constants';

interface UpdateOptionsArgs {
  attributeId: number;
  attributeCode: string;
  optionCode: string;
}

const useSelectOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ params }: { params: UpdateOptionsArgs }) => {
      const { attributeId, attributeCode, optionCode } = params;

      return Promise.resolve({ attributeId, attributeCode, optionCode });
    },
    onMutate: async ({ params }: { params: UpdateOptionsArgs }) => {
      const { attributeCode, optionCode } = params;

      await queryClient.cancelQueries({ queryKey: [CONFIG_STEPS_QUERY_KEY] });

      const oldData = queryClient.getQueryData<CustomizationSteps>([CONFIG_STEPS_QUERY_KEY]);

      if (oldData) {
        const newData = structuredClone(oldData);
        const step = newData.customizationSteps[0];
        const attribute = step.attributes.find((attr) => attr.code === attributeCode);

        if (attribute) {
          attribute.options.forEach((opt) => {
            if (opt.code === optionCode) {
              opt.isSelected = true;
            } else opt.isSelected = false;
          });
          attribute.selectedOption = optionCode;
        }

        queryClient.setQueryData<CustomizationSteps>([CONFIG_STEPS_QUERY_KEY], newData);
      }

      return { oldData };
    },

    onError: (_err, _variables, context) => {
      if (context?.oldData) {
        queryClient.setQueryData<CustomizationSteps>([CONFIG_STEPS_QUERY_KEY], context.oldData);
      }
    },
  });
};

export { useSelectOption };
