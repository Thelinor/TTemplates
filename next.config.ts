import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/api/eso-hub-skill-icon",
      },
      {
        pathname: "/spliticons/**",
      },
      {
        pathname: "/roles/**",
      },
      {
        pathname: "/raid-loading-screens/**",
      },
      {
        pathname: "/potions/**",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "eso-hub.com",
        pathname: "/storage/icons/**",
      },
    ],
  },
};

export default nextConfig;