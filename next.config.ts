import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    reactStrictMode: true,

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'be-roboco-production.up.railway.app',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3001',
                pathname: '/**',
            },
        ],
    },

    experimental: {
        optimizeCss: true,
        optimizePackageImports: ['lucide-react'],
    },
}

export default nextConfig
