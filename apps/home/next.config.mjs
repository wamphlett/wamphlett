import path from 'node:path';
import dotenv from 'dotenv';
import withPlaiceholder from '@plaiceholder/next';

// shared env: load the monorepo-root .env for local dev/build.
// no-op in Docker/CI (file absent) and never overrides real environment vars.
dotenv.config({ path: path.join(import.meta.dirname, '..', '..', '.env') });

const libraryUrl = process.env.LIBRARY_URL ?? 'https://library.wamphlett.net';

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@wamphlett/ui'],
  output: 'standalone',
  serverExternalPackages: ['pino', 'pino-pretty'],
  outputFileTracingRoot: path.join(import.meta.dirname, '..', '..'),
  // Next 16.2+ requires acknowledging Turbopack when a `webpack` config is
  // present (added by withPlaiceholder to externalize the native sharp
  // binary) — Turbopack ignores it and externalizes sharp on its own.
  turbopack: {},
  images: {
    deviceSizes: [640, 1080, 1200, 1920, 2048, 3840],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: new URL(libraryUrl).hostname,
        port: '',
        pathname: '/photos/website/**',
      },
    ],
  },
  staticPageGenerationTimeout: 300,
};

export default withPlaiceholder(nextConfig);
