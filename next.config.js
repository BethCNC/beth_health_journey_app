/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export removed for SSR/Cloud Functions
  // output: 'export',
  // trailingSlash: true,
  // images: { unoptimized: true },
  // Disable webpack caching to avoid iCloud sync issues
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  }
};

module.exports = nextConfig; 