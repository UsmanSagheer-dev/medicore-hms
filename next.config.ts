import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://medicore-backend-psi.vercel.app/api/:path*",
      },
    ];
  },
};

export default nextConfig;
