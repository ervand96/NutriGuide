import { buildSitemapUrlsetXml } from "@/lib/sitemap-entries.js";

/** Always 200 + body — avoid 304/ETag which GSC can treat as fetch failure. */
export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITEMAP_HEADERS = {
  "Content-Type": "text/xml; charset=utf-8",
  "Cache-Control": "no-store, max-age=0, must-revalidate",
  "CDN-Cache-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store",
  "Access-Control-Allow-Origin": "*",
  "X-Content-Type-Options": "nosniff",
};

export async function GET() {
  return new Response(buildSitemapUrlsetXml(), {
    status: 200,
    headers: SITEMAP_HEADERS,
  });
}
