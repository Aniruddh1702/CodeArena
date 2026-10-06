/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@codearena/types"],
  reactStrictMode: true,
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
