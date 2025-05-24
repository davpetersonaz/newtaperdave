/** @type {import('next').NextConfig} */
const nextConfig = {
	generate: {
		exclude: ['/api/*'], // Prevent prerendering of API routes
	},
	eslint: {
		ignoreDuringBuilds: true
	}
};

export default nextConfig;
