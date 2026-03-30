// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  outputFileTracingExcludes: {
    '**/*': [
      './public/music/**/*',
      './public/files/**/*',
    ],
  },

  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;