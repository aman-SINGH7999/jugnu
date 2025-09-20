import { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // sabhi https images allow
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true, // build me type errors ignore
  },
};

export default nextConfig;
