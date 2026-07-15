import path from 'node:path';
import dotenv from 'dotenv';
import withPlaiceholder from '@plaiceholder/next';

// shared env: load the monorepo-root .env for local dev/build.
// no-op in Docker/CI (file absent) and never overrides real environment vars.
dotenv.config({ path: path.join(import.meta.dirname, '..', '..', '.env') });

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['pino', 'pino-pretty', '@opentelemetry/api'],
  output: 'standalone',
  outputFileTracingRoot: path.join(import.meta.dirname, '..', '..'),
  images: {
    deviceSizes: [640, 1080, 1200, 1920, 2048, 3840],
    remotePatterns: [
      { protocol: 'https', hostname: 'library.wamphlett.net', port: '', pathname: '/photos/website/**' },
    ],
  },
};

export default withPlaiceholder(nextConfig);
