import path from 'node:path';
import withPlaiceholder from "@plaiceholder/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['pino', 'pino-pretty'],
    instrumentationHook: true,
    // trace deps from the monorepo root so standalone output is complete
    outputFileTracingRoot: path.join(import.meta.dirname, '..', '..'),
  },
  i18n: {
    locales: ['en', 'ja-JP'], // Define 'jp' as a locale
    defaultLocale: 'en',
  },
  async rewrites() {
    return [
      {
        source: '/jp',  // Rewrite /jp to /ja-JP
        destination: '/ja-JP',
      },
    ];
  },
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
  staticPageGenerationTimeout: 300,
}

export default withPlaiceholder(nextConfig)
