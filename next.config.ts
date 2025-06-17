import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rules: [
    {
      "no-console": ["error"],
    },
  ],

  images: {
    domains: [
      'rosantibikemotorent.com', 
      'localhost', 
      'res.cloudinary.com',
    ],
  },
};

export default nextConfig;
