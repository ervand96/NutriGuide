import { getSitemapEntries } from "@/lib/sitemap-entries.js";

export const dynamic = "force-static";
export const revalidate = 3600;

/** Plain URL list (same paths as XML sitemaps) for Google Search Console. */
export async function GET() {
  const urls = getSitemapEntries().map((e) => e.loc);

  return new Response(`${urls.join("\n")}\n`, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
