import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/lib/sitemap-entries.js";

export const dynamic = "force-dynamic";

/**
 * Nested App Router sitemap → /sitemap/sitemap.xml
 * Community workaround for GSC “Couldn't fetch” on root /sitemap.xml (Vercel).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return getSitemapEntries().map((entry) => ({
    url: entry.loc,
    lastModified: entry.lastmod,
  }));
}
