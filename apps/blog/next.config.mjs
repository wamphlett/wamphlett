import path from 'node:path';
import withPlaiceholder from '@plaiceholder/next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['pino', 'pino-pretty', '@opentelemetry/api'],
  output: 'standalone',
  // trace deps from the monorepo root so standalone output is complete
  outputFileTracingRoot: path.join(import.meta.dirname, '..', '..'),
  images: {
    deviceSizes: [640, 1080, 1200, 1920, 2048, 3840],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'library.wamphlett.net',
        port: '',
        pathname: '/photos/website/**',
      },
    ],
  },
};

export default withPlaiceholder(nextConfig);
