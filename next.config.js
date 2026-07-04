/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
    unoptimized: false, // Set to false for production optimization
  },
  eslint: {
    ignoreDuringBuilds: true, // Consider setting to false for stricter production builds
  },
  typescript: {
    ignoreBuildErrors: false, // Set to false to ensure type safety in production
  },
  // Enable static export for easier deployment
  output: "export",
  trailingSlash: true,
};

module.exports = nextConfig;
