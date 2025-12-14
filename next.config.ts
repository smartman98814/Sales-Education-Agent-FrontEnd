import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Skips linting during the build
  },
  env: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_URL: process.env.AUTH_URL,
    SESSION_MAX_AGE: process.env.SESSION_MAX_AGE,
    SESSION_UPDATE_AGE: process.env.SESSION_UPDATE_AGE,
  },
  images: {
    remotePatterns: [],
  },
  async redirects() {
    return [
      {
        source: '/chatandbuild',
        destination: '/',
        permanent: false,
      },
      {
        source: '/chatandbuild/dashboard',
        destination: '/dashboard',
        permanent: false,
      },
      {
        source: '/chatandbuild/intro',
        destination: '/intro',
        permanent: false,
      },
      {
        source: '/chatandbuild/simulator',
        destination: '/simulator',
        permanent: false,
      },
      // Handle locale-specific redirects
      {
        source: '/:locale/chatandbuild',
        destination: '/:locale',
        permanent: false,
      },
      {
        source: '/:locale/chatandbuild/dashboard',
        destination: '/:locale/dashboard',
        permanent: false,
      },
      {
        source: '/:locale/chatandbuild/intro',
        destination: '/:locale/intro',
        permanent: false,
      },
      {
        source: '/:locale/chatandbuild/simulator',
        destination: '/:locale/simulator',
        permanent: false,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
