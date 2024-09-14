import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CustomizationSteps3d } from '@/types/product';
import { CONFIG_3D_STEPS_QUERY_KEY } from '@/constants';

interface UpdateOptionsArgs {
  attributeCode?: string;
  optionCode?: string;
}

const useUpdateCamera = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ params }: { params: UpdateOptionsArgs }) => {
      const { attributeCode, optionCode } = params;

      await queryClient.cancelQueries({ queryKey: [CONFIG_3D_STEPS_QUERY_KEY] });

      const cahedData = queryClient.getQueryData<CustomizationSteps3d>([CONFIG_3D_STEPS_QUERY_KEY]);

      if (cahedData && (attributeCode || optionCode)) {
        const newData = structuredClone(cahedData);
        const attribute = newData.customizationSteps.attributes.find((attr) => attr.code === attributeCode);

        if (attribute) {
          let activeOption;

          if (optionCode) {
            activeOption = attribute.options.find((opt) => opt.code === optionCode);
          }

          if (activeOption?.cameraConfig) {
            return Promise.resolve({ cameraConfig: activeOption.cameraConfig });
          } else if (attribute.cameraConfig) {
            return Promise.resolve({ cameraConfig: attribute.cameraConfig });
          }
        }
      }

      return Promise.resolve({ cameraConfig: cahedData?.customizationSteps.cameraConfig });
    },
  });
};

export { useUpdateCamera };
