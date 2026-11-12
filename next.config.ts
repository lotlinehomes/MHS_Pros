import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Placeholder host. Swap for your real image CDN (or delete if all photos live in /public).
    remotePatterns: [{ protocol: "https", hostname: "placehold.co" }],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
