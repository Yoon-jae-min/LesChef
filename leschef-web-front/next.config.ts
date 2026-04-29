import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // domains는 가장 보수적으로 "정확히 일치" 허용
    // (remotePatterns 와일드카드가 환경/버전에 따라 매칭이 기대와 다를 때 대비)
    domains: ["pub-d0ae6990f29940f19bb7f4cb25905c8c.r2.dev"],
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
