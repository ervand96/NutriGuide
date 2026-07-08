/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "cloudinary.images-iherb.com" },
      { protocol: "https", hostname: "**.images-iherb.com" },
      { protocol: "https", hostname: "static.thcdn.com" },
      { protocol: "https", hostname: "**.myprotein.com" },
    ],
  },
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    return config;
  },
};

module.exports = nextConfig;
