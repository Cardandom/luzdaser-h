import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 95],
  },
  async redirects() {
    return [
      {
        source: "/projects/oliver-boutique",
        destination: "/projects/oliver",
        permanent: true,
      },
      {
        source: "/projects/luca-boutique",
        destination: "/projects/luca",
        permanent: true,
      },
      {
        source: "/projects/lucas-boutique",
        destination: "/projects/luca",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
