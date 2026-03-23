import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 1080, 1200, 1920],
    imageSizes: [48, 64, 80, 110, 200, 400],
    minimumCacheTTL: 86400,
    remotePatterns: [
      // ── Local development API ──────────────────────────────────────────
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
      // ── Production API ─────────────────────────────────────────────────
      {
        protocol: 'https',
        hostname: 'infinitech-api14.site',
        pathname: '/**',
      },
      // ── Unsplash ───────────────────────────────────────────────────────
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // ── Placeholder fallback ───────────────────────────────────────────
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
};

export default nextConfig;