import withPlaiceholder from "@plaiceholder/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
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
    // deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
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
