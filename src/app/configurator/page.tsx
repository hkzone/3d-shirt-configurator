import { Suspense } from 'react';

import { Configurator } from '@/components/configurator';

export default async function ConfiguratorPage() {
  return (
    <Suspense fallback={null}>
      <Configurator />
    </Suspense>
  );
}
