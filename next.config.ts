import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first where browsers support it, WebP otherwise.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
