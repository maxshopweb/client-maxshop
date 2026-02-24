import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'files.maxshop.com.ar',
      },
    ],
  },
  typescript: {
    // ⚠️ Ignorar errores de TypeScript durante el build
    ignoreBuildErrors: true,
  },
  eslint: {
    // ⚠️ Ignorar errores de ESLint durante el build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
