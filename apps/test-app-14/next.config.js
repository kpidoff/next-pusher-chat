/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [];
  },
  async redirects() {
    return [];
  },
  server: {
    port: 3001,
  },
};

module.exports = nextConfig; 