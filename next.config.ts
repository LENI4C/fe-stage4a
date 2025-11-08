import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Skip static optimization for pages that use Supabase
  experimental: {
    // This helps with client-side only pages
  },
};

export default nextConfig;
