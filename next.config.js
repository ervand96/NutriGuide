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
  async redirects() {
    return [
      {
        source: "/favicon.ico",
        destination: "/logo.svg",
        permanent: false,
      },
    ];
  },
  async headers() {
    // Help Google Search Console fetch sitemaps on Vercel (CORS + explicit XML type)
    const sitemapHeaders = [
      { key: "Content-Type", value: "text/xml; charset=utf-8" },
      { key: "Access-Control-Allow-Origin", value: "*" },
      { key: "X-Content-Type-Options", value: "nosniff" },
    ];
    return [
      { source: "/sitemap.xml", headers: sitemapHeaders },
      { source: "/sitemap_index.xml", headers: sitemapHeaders },
      { source: "/gsc-sitemap", headers: sitemapHeaders },
      { source: "/feed/sitemap.xml", headers: sitemapHeaders },
    ];
  },
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    return config;
  },
};

module.exports = nextConfig;
