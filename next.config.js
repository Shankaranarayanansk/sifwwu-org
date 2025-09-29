/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    domains: ['res.cloudinary.com'],
    unoptimized: false 
  },
};

module.exports = nextConfig;
