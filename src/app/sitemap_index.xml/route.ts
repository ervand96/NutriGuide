import { buildSitemapIndexXml } from "@/lib/sitemap-entries.js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  return new Response(buildSitemapIndexXml("/gsc-sitemap"), {
    status: 200,
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      "Cache-Control": "no-store, max-age=0, must-revalidate",
      "CDN-Cache-Control": "no-store",
      "Vercel-CDN-Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
