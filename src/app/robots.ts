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
    // Prefer /sitemaps/pages.* — fresh paths avoid GSC cached "Couldn't fetch"
    sitemap: [
      `${SITE_URL}/sitemaps/pages.xml`,
      `${SITE_URL}/sitemaps/pages.txt`,
      `${SITE_URL}/sitemap.xml`,
      `${SITE_URL}/sitemap.txt`,
    ],
    host,
  };
}
