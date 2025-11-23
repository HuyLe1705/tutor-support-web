/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**', // Cho phép load ảnh từ mọi nguồn (cho MVP tiện lợi)
        },
      ],
    },
  };
  
  module.exports = nextConfig;