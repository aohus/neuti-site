import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:8000/api/v1/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:8000/uploads/:path*',
      },
    ]
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