import { getAllPosts } from "@/lib/posts";
import { SITE_URL } from "@/lib/seo.js";

export const dynamic = "force-static";
export const revalidate = 3600;

/** Plain URL list with clean headers for Google Search Console. */
export async function GET() {
  const staticPaths = [
    "",
    "/best-picks",
    "/quiz",
    "/site-map",
    "/category/diets",
    "/category/reviews",
    "/category/supplements",
  ];
  const posts = getAllPosts();
  const urls = [
    ...staticPaths.map((p) => `${SITE_URL}${p}`),
    ...posts.map(
      (p) => `${SITE_URL}/category/${p.category.toLowerCase()}/${p.slug}`,
    ),
  ];

  return new Response(`${urls.join("\n")}\n`, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
