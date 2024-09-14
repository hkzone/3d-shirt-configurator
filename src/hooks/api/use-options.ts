import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getSteps } from '@/server/actions';
import { CONFIG_STEPS_QUERY_KEY } from '@/constants';

export const useOptions = () => {
  return useQuery({
    queryKey: [CONFIG_STEPS_QUERY_KEY],
    queryFn: () => getSteps(),
    placeholderData: keepPreviousData,
    select: (data) => {
      const disabledOptions = new Set();
      // Deep clone the data
      const newData = structuredClone(data);

      // First pass: Collect all disabled options based on current selections
      newData.customizationSteps.forEach((step) => {
        step.attributes.forEach((attribute) => {
          const selectedOption = attribute.options.find((option) => option.isSelected);

          if (selectedOption && Array.isArray(selectedOption.optionDisabled)) {
            selectedOption.optionDisabled.forEach((optionId) => disabledOptions.add(optionId));
          }
        });
      });

      // Second pass: Apply the disabled options and select first available option if necessary
      newData.customizationSteps.forEach((step) => {
        step.attributes = step.attributes.map((attribute) => {
          //  Filter out disabled options
          const enabledOptions = attribute.options.filter((option) => !disabledOptions.has(option.id));

          // Check if any option is selected already, if not, select the first one
          const selectedOption = enabledOptions.find((option) => option.isSelected) || enabledOptions[0];

          if (selectedOption) {
            attribute.selectedOption = selectedOption.code;
            enabledOptions.forEach((option) => (option.isSelected = option.code === selectedOption.code));
          }

          attribute.options = enabledOptions;

          return attribute;
        });
      });

      return newData;
    },
  });
};
