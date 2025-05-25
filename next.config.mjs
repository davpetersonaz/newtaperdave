/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'standalone', // Use standalone output for Vercel serverless
	eslint: {
		ignoreDuringBuilds: true
	},
	// Prevent API routes from being prerendered or included in static generation
	experimental: {
		serverComponentsExternalPackages: ['pg', 'pg-hstore', 'image-size'], // Include Node.js dependencies used in API routes
	},
};

export default nextConfig;
