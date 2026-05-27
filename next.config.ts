import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 16 の Cache Components モデルを有効化
  // 詳細は lectures/06-rendering-cache.md
  cacheComponents: true,

  // placehold.coからの画像を許可
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.jp",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
