import { buildSitemapIndexXml } from "@/lib/sitemap-entries.js";

export const dynamic = "force-static";
export const revalidate = 3600;

/**
 * Sitemap index with clean headers (no Content-Disposition).
 * Points at a single urlset — duplicates confuse GSC processing.
 */
export async function GET() {
  return new Response(buildSitemapIndexXml("/sitemap.xml"), {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
