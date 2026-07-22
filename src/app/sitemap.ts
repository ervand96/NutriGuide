import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/lib/sitemap-entries.js";

/**
 * App Router sitemap at /sitemap.xml — served without Vercel’s static-file
 * Content-Disposition header (which breaks Google Search Console processing).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return getSitemapEntries().map((entry) => ({
    url: entry.loc,
    lastModified: entry.lastmod,
  }));
}
