import type { RuntimeConfig } from './types';

let cached: RuntimeConfig | null = null;

export async function loadRuntimeConfig(): Promise<RuntimeConfig> {
  if (cached) {
    return cached;
  }

  const res = await fetch('/api/config', { cache: 'no-store' });

  if (!res.ok) {
    throw new Error(`Failed to load runtime config (${res.status})`);
  }

  const data = (await res.json()) as RuntimeConfig;

  if (!data.apiUrl || !data.baseUrl) {
    throw new Error('Invalid runtime config');
  }

  cached = data;
  return data;
}
