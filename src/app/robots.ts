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
    sitemap: [
      `${SITE_URL}/sitemap_index.xml`,
      `${SITE_URL}/gsc-sitemap`,
      `${SITE_URL}/gsc-urls`,
      `${SITE_URL}/sitemaps/pages.xml`,
      `${SITE_URL}/sitemap.xml`,
    ],
    host,
  };
}
