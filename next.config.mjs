//next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true
    },

    experimental: {
        outputFileTracingExcludes: {
            '**/*': [
                './public/music/**/*',
                './public/files/**/*',
                './public/images/**/*'
            ],
        },
    },

    // Optional: Increase output file tracing root if needed
    outputFileTracingRoot: process.cwd()
};

export default nextConfig;