'use client';

import { useEffect, useState } from 'react';
import { loadRuntimeConfig } from './loadRuntimeConfig';
import type { RuntimeConfig } from './types';

export function useRuntimeConfig() {
  const [config, setConfig] = useState<RuntimeConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRuntimeConfig()
      .then(setConfig)
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : 'Failed to load config');
      });
  }, []);

  return {
    config,
    homeSiteUrl: config?.homeSiteUrl,
    photosSiteUrl: config?.photosSiteUrl,
    ready: !!config,
    error,
  };
}
