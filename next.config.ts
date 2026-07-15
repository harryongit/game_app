import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Backend base URL. Defaults to the Go server's PORT (8080). Override with
    // BACKEND_URL in the environment (e.g. https://api.example.com) when deploying.
    const backendUrl = process.env.BACKEND_URL || 'https://api.shravaniagro.store';
    return [
      {
        source: '/api-proxy/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ]
  },
};

export default nextConfig;
