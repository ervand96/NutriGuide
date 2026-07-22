import { getSitemapEntries } from "@/lib/sitemap-entries.js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** Plain URL list — Google accepts this as a sitemap. */
export async function GET() {
  const urls = getSitemapEntries().map((e) => e.loc);
  return new Response(`${urls.join("\n")}\n`, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, max-age=0, must-revalidate",
      "CDN-Cache-Control": "no-store",
      "Vercel-CDN-Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
