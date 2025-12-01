import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
   reactStrictMode: true,

   images: {
      remotePatterns: [
         {
            protocol: 'http',
            hostname: 'localhost',
            port: '3001',
            pathname: '/uploads/**',
         },
         {
            protocol: 'http',
            hostname: '127.0.0.1',
            port: '3001',
            pathname: '/uploads/**',
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
      ],
   },

   experimental: {
      optimizeCss: true,
      optimizePackageImports: ['lucide-react'],
   },
   output: "standalone",
}

export default nextConfig
