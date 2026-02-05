import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    const backendUrl = 'http://backend:8000'
    
    return {
      beforeFiles: [
        {
          source: '/backend-api/:path*',
          destination: `${backendUrl}/api/v1/:path*`,
        },
        {
          source: '/uploads/:path*',
          destination: `${backendUrl}/uploads/:path*`,
        },
      ]
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '0.0.0.0',
        port: '8000',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;