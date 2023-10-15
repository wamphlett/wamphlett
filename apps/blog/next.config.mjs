import withPlaiceholder from '@plaiceholder/next';

/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

export default withPlaiceholder(nextConfig);
