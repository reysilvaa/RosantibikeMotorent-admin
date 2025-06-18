import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    domains: [
      'rosantibikemotorent.com',
      'localhost',
      'res.cloudinary.com',
    ],
  },
};

export default nextConfig;
