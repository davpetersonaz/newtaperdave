//next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true
    },

    outputFileTracingExcludes: {
        '**/*': [
            './public/music/**/*',
            './public/files/**/*',
            './public/images/**/*'
        ],
    },

    // Increase output file tracing root if needed
    outputFileTracingRoot: process.cwd()
};

export default nextConfig;