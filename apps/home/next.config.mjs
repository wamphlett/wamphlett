import path from 'node:path';
import dotenv from 'dotenv';
import withPlaiceholder from "@plaiceholder/next";

// shared env: load the monorepo-root .env for local dev/build.
// no-op in Docker/CI (file absent) and never overrides real environment vars.
dotenv.config({ path: path.join(import.meta.dirname, '..', '..', '.env') });

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['pino', 'pino-pretty'],
    instrumentationHook: true,
    outputFileTracingRoot: path.join(import.meta.dirname, '..', '..'),
  },
  i18n: {
    locales: ['en', 'ja-JP'],
    defaultLocale: 'en',
  },
  async rewrites() {
    return [
      { source: '/jp', destination: '/ja-JP' },
    ];
  },
  images: {
    deviceSizes: [640, 1080, 1200, 1920, 2048, 3840],
    remotePatterns: [
      { protocol: 'https', hostname: 'library.wamphlett.net', port: '', pathname: '/photos/website/**' },
    ],
  },
  staticPageGenerationTimeout: 300,
}

export default withPlaiceholder(nextConfig)
