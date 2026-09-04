import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Vercel's image optimizer caps quality at 75, which visibly fades interior
    // photos. We want lossless delivery so the original source file is served
    // as-is. next/image still generates the srcSet at different widths, but
    // no re-encoding / quality loss is applied.
    unoptimized: true,
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 160, 256, 384, 512, 768],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async rewrites() {
    return [
      { source: "/v6", destination: "/v6/work" },
    ];
  },
};

export default nextConfig;
