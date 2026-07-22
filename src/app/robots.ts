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
    ],
    // Cleanest fetch path (no ETag/304, no Content-Disposition in practice)
    sitemap: `${SITE_URL}/gsc-sitemap`,
    host,
  };
}
