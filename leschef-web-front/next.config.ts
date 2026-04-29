import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // Cloudflare R2 public domain (ex: pub-xxxx.r2.dev)
        hostname: "*.r2.dev",
      },
      {
        protocol: "https",
        hostname: "r2.dev",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
    ],
  },
};

export default nextConfig;
