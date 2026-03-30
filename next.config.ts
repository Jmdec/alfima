import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 1080, 1200, 1920],
    imageSizes: [48, 64, 80, 110, 200, 400],
    minimumCacheTTL: 86400,
    // Allow private IPs (needed for localhost:8000 backend)
    dangerouslyAllowSVG: true,
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'infinitech-api14.site',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
    ],
  },

  // This allows next/image to fetch from localhost/private IPs
  experimental: {
    // Next.js 14.1+: allow private IP image optimization
  },

  async rewrites() {
    return [
      {
        source: '/img-proxy/:path*',
        destination: 'http://localhost:8000/:path*',
      },
    ];
  },
};

export default nextConfig;