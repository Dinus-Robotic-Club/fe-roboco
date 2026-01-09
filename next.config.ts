import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  allowedDevOrigins: ['http://localhost:3000', 'http://192.168.6.142:3000', 'http://172.20.10.4:3000', '172.20.10.4:3000'],

  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.6.142',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '172.20.10.4',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'be-roboco-production.up.railway.app',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'backend-dnroboco.dinusrobotic.org',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'dnroboco01.dinusrobotic.org',
        pathname: '/be/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'dnroboco-be.dinusrobotic.org',
        pathname: '/uploads/**',
      },
    ],
  },

  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
}

export default nextConfig
