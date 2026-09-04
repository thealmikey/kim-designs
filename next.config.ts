import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 160, 256, 384, 512, 768],
    // 30 days. Per-Image quality is set at the call site (88-90 for photos, unoptimized for logos).
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async rewrites() {
    return [
      { source: "/v6", destination: "/v6/work" },
    ];
  },
};

export default nextConfig;
