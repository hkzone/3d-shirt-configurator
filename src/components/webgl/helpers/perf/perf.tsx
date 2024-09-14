import React from 'react';

const isProduction = process.env.NODE_ENV === 'production';

export const Perf = isProduction
  ? (): null => null
  : React.lazy(() =>
      import('r3f-perf').then((result) => ({
        default: result.Perf,
      }))
    );
