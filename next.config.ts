import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Avoid Vercel build stalls/failures from incomplete local ESLint flat-config wiring.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
