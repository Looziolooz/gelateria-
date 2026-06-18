import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project (a stray lockfile in the home dir
  // was making Next infer the wrong root).
  turbopack: { root: import.meta.dirname },
  // Quality values used across the site (editorial photos render at 95; the
  // pickup thumbnails at 84/90). Next 16 requires them to be declared.
  images: { qualities: [75, 84, 85, 90, 95] },
};

export default nextConfig;
