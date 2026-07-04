/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // Consider setting to false for stricter production builds
  },
  typescript: {
    ignoreBuildErrors: false, // Set to false to ensure type safety in production
  },
};

module.exports = nextConfig;
