import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
      ] },
      { source: "/demos/:path*", headers: [
        { key: "X-Robots-Tag", value: "noindex, follow" },
      ] },
    ];
  },
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
