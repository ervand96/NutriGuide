import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getAllPosts } from "../src/lib/posts.js";
import { SITE_URL } from "../src/lib/seo.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outPath = join(root, "public", "sitemap.xml");

const staticRoutes = [
  { path: "", priority: "1.0", changefreq: "daily" },
  { path: "/best-picks", priority: "0.95", changefreq: "daily" },
  { path: "/quiz", priority: "0.9", changefreq: "weekly" },
  { path: "/category/diets", priority: "0.85", changefreq: "weekly" },
  { path: "/category/reviews", priority: "0.85", changefreq: "weekly" },
  { path: "/category/supplements", priority: "0.85", changefreq: "weekly" },
  { path: "/about", priority: "0.5", changefreq: "monthly" },
  { path: "/contact", priority: "0.4", changefreq: "monthly" },
  { path: "/privacy-policy", priority: "0.3", changefreq: "yearly" },
  { path: "/affiliate-disclosure", priority: "0.4", changefreq: "yearly" },
];

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function urlEntry(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

const now = new Date().toISOString();
const posts = getAllPosts();

const urls = [
  ...staticRoutes.map((r) =>
    urlEntry(`${SITE_URL}${r.path}`, now, r.changefreq, r.priority),
  ),
  ...posts.map((post) =>
    urlEntry(
      `${SITE_URL}/category/${post.category.toLowerCase()}/${post.slug}`,
      new Date(post.date).toISOString(),
      "weekly",
      "0.7",
    ),
  ),
];

// Use http:// namespace — Google's sitemap crawler is picky about https:// xmlns
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, xml, "utf8");
console.log(`Wrote ${outPath} (${urls.length} URLs)`);
