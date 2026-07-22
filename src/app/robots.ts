import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo.js";

export default function robots(): MetadataRoute.Robots {
  const host = SITE_URL.replace(/^https?:\/\//, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/go/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/go/"],
      },
    ],
    // Only App Router sitemaps — static public/*.xml get Content-Disposition on Vercel
    sitemap: [
      `${SITE_URL}/sitemap_index.xml`,
      `${SITE_URL}/sitemap.xml`,
      `${SITE_URL}/gsc-sitemap`,
    ],
    host,
  };
}
