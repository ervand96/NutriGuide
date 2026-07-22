import { buildSitemapUrlsetXml } from "@/lib/sitemap-entries.js";

export const dynamic = "force-static";
export const revalidate = 3600;

/**
 * Fresh sitemap path for Google Search Console.
 * Use this when /sitemap.xml or /sitemap_index.xml show «Couldn't fetch»
 * (GSC caches failures; a new URL forces a real fetch).
 */
export async function GET() {
  return new Response(buildSitemapUrlsetXml(), {
    status: 200,
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "Access-Control-Allow-Origin": "*",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
