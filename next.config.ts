import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api-proxy/:path*',
        destination: 'http://187.127.162.32/:path*', // Proxy to Backend
      },
    ]
  },
};

export default nextConfig;
