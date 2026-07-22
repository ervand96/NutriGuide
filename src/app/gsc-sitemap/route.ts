import { buildSitemapUrlsetXml } from "@/lib/sitemap-entries.js";

export const dynamic = "force-static";
export const revalidate = 3600;

/** Clean-header sitemap alias for Google Search Console. */
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
