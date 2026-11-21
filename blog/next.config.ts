import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets a verification build run next to `next dev` without sharing .next (NEXT_DIST_DIR=.next-verify).
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
};

export default nextConfig;
