import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/demos/autodetailing",
        destination: "/demos/autodetailing/index.html",
      },
      {
        source: "/demos/autodetailing/pricing",
        destination: "/demos/autodetailing/pricing.html",
      },
      {
        source: "/demos/autodetailing/work",
        destination: "/demos/autodetailing/work.html",
      },
    ];
  },
};

export default nextConfig;
