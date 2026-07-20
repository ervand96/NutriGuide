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
    // List both: XML + plain text (GSC fallback when XML processing fails)
    sitemap: [`${SITE_URL}/sitemap.xml`, `${SITE_URL}/sitemap.txt`],
    host,
  };
}
