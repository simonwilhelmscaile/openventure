import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Enable modern image formats (WebP, AVIF)
    formats: ['image/avif', 'image/webp'],
    // Allow images from common CDNs and placeholder services
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
    // Optimize image quality
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
