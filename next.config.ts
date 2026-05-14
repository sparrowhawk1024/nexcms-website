import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Add Contentstack's CDN domain so next/image can optimise assets
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.contentstack.io",
      },
      {
        protocol: "https",
        hostname: "**.contentstack.io",
      },
      {
        protocol: "https",
        hostname: "eu-images.contentstack.com",
      },
    ],
  },
};

export default nextConfig;
