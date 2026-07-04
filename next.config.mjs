/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true, // Consider setting to false for stricter production builds
  },
  typescript: {
    ignoreBuildErrors: false, // Set to false to ensure type safety in production
  },
  images: {
    unoptimized: true, // Required for static export
  },
}

export default nextConfig
