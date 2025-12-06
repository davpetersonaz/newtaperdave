/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Use standalone output for Vercel serverless
  eslint: {
    ignoreDuringBuilds: true
  },
  // Prevent API routes from being prerendered or included in static generation
  serverExternalPackages: ['pg', 'pg-hstore', 'image-size'], // Include Node.js dependencies used in API routes
  experimental: {}, // Empty now—remove if you add other experiments later
};

export default nextConfig;