import { getAllPosts } from "@/lib/posts";
import { SITE_URL } from "@/lib/seo.js";

export const dynamic = "force-static";
export const revalidate = 3600;

function buildEntries() {
  const today = new Date().toISOString().slice(0, 10);
  const staticPaths = [
    "",
    "/best-picks",
    "/quiz",
    "/site-map",
    "/category/diets",
    "/category/reviews",
    "/category/supplements",
    "/about",
    "/contact",
    "/privacy-policy",
    "/affiliate-disclosure",
  ];
  const posts = getAllPosts();
  return [
    ...staticPaths.map((path) => ({
      loc: `${SITE_URL}${path}`,
      lastmod: today,
    })),
    ...posts.map((post) => ({
      loc: `${SITE_URL}/category/${post.category.toLowerCase()}/${post.slug}`,
      lastmod: String(post.date).slice(0, 10),
    })),
  ];
}

function escapeXml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Clean-header sitemap for Google Search Console (no Content-Disposition). */
export async function GET() {
  const entries = buildEntries();
  const body = entries
    .map(
      (e) => `  <url>
    <loc>${escapeXml(e.loc)}</loc>
    <lastmod>${e.lastmod}</lastmod>
  </url>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      // Explicitly avoid Content-Disposition — GSC can fail to process when present
    },
  });
}
