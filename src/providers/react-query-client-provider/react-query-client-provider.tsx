'use client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

import { getQueryClient } from './get-query-client';
import { ReactQueryDevelopmentTools } from './react-query-development-tools';

const persister = createSyncStoragePersister({
  storage: typeof window !== 'undefined' ? localStorage : undefined,
});

function ReactQueryClientProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      {children}
      <ReactQueryDevelopmentTools />
    </PersistQueryClientProvider>
  );
}

export { ReactQueryClientProvider };
