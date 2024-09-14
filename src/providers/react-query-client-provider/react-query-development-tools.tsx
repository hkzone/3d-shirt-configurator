import React from 'react';

const isProduction = process.env.NODE_ENV === 'production';

export const ReactQueryDevelopmentTools = isProduction
  ? (): null => null
  : React.lazy(() =>
      import('@tanstack/react-query-devtools').then((result) => ({
        default: result.ReactQueryDevtools,
      }))
    );
