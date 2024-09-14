'use client';

import { Leva } from 'leva';
import { useSearchParams } from 'next/navigation';

export function Debugger() {
  const searchParams = useSearchParams();
  const debug = searchParams.has('debug');

  return <Leva collapsed hidden={!debug} />;
}
