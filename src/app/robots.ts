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
    // Single primary sitemap — multiple entries can confuse GSC on vercel.app
    sitemap: `${SITE_URL}/feed/sitemap.xml`,
    host,
  };
}
