/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'realt.co'
            }
        ]
    }
};

export default nextConfig;
