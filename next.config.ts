import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['*.replit.dev', '*.replit.app', '*.repl.co'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
