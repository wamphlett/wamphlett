'use client';

import { useEffect } from 'react';
import { useRuntimeConfig } from '@/lib/config/useRuntimeConfig';

export default function LogoutPage() {
  const { baseUrl } = useRuntimeConfig();

  useEffect(() => {
    // Remove the cookie by setting Max-Age=0
    document.cookie = [
      'TOKEN=',
      'Path=/',
      'Max-Age=0',
      'SameSite=Lax',
      'Secure',
    ].join('; ');

    // Redirect to home
    window.location.href = baseUrl || '/';
  }, [baseUrl]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-zinc-400 text-sm">Logging out…</p>
    </div>
  );
}
