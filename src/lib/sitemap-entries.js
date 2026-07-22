import { getAllPosts } from "./posts.js";
import { SITE_URL } from "./seo.js";

/** Public pages included in every sitemap (keep in sync for GSC). */
export const SITEMAP_STATIC_PATHS = [
  "",
  "/best-picks",
  "/quiz",
  "/promo-codes",
  "/site-map",
  "/category/diets",
  "/category/reviews",
  "/category/supplements",
  "/about",
  "/contact",
  "/privacy-policy",
  "/affiliate-disclosure",
];

/** Google prefers simple YYYY-MM-DD (no time / Z). */
export function toSitemapLastmod(value) {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }
  return d.toISOString().slice(0, 10);
}

/**
 * @returns {{ loc: string, lastmod: string }[]}
 */
export function getSitemapEntries() {
  const today = toSitemapLastmod(new Date());
  const posts = getAllPosts();
  return [
    ...SITEMAP_STATIC_PATHS.map((path) => ({
      loc: `${SITE_URL}${path}`,
      lastmod: today,
    })),
    ...posts.map((post) => ({
      loc: `${SITE_URL}/category/${post.category.toLowerCase()}/${post.slug}`,
      lastmod: toSitemapLastmod(post.date),
    })),
  ];
}

export function buildSitemapUrlsetXml(entries = getSitemapEntries()) {
  const body = entries
    .map(
      (e) => `  <url>
    <loc>${escapeXml(e.loc)}</loc>
    <lastmod>${e.lastmod}</lastmod>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

/** Index that lists only the clean App Router sitemap (no duplicate urlsets). */
export function buildSitemapIndexXml(childPath = "/sitemap.xml") {
  const today = toSitemapLastmod(new Date());
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${escapeXml(`${SITE_URL}${childPath}`)}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>
`;
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
