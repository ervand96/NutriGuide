import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getAllPosts } from "../src/lib/posts.js";
import { SITE_URL } from "../src/lib/seo.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outPath = join(root, "public", "sitemap.xml");

/** Google prefers simple YYYY-MM-DD; avoid Z / milliseconds parse failures */
function toLastmod(value) {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }
  return d.toISOString().slice(0, 10);
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

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
const today = toLastmod(new Date());

const entries = [
  ...staticPaths.map((path) => ({
    loc: `${SITE_URL}${path}`,
    lastmod: today,
  })),
  ...posts.map((post) => ({
    loc: `${SITE_URL}/category/${post.category.toLowerCase()}/${post.slug}`,
    lastmod: toLastmod(post.date),
  })),
];

// Minimal valid sitemap — only loc + lastmod (Google ignores priority/changefreq)
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

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, xml, "utf8");

const txtPath = join(root, "public", "sitemap.txt");
writeFileSync(txtPath, `${entries.map((e) => e.loc).join("\n")}\n`, "utf8");

// Alternate paths — GSC often caches "Couldn't fetch" for /sitemap.xml on Vercel;
// submitting a NEW path forces a fresh Google fetch.
const altDir = join(root, "public", "sitemaps");
mkdirSync(altDir, { recursive: true });
writeFileSync(join(altDir, "pages.xml"), xml, "utf8");
writeFileSync(
  join(altDir, "pages.txt"),
  `${entries.map((e) => e.loc).join("\n")}\n`,
  "utf8",
);
writeFileSync(join(altDir, "index.xml"), xml, "utf8");

console.log(`Wrote ${outPath} (${entries.length} URLs)`);
console.log(`Wrote ${txtPath} (${entries.length} URLs)`);
console.log(`Wrote ${altDir}/pages.xml (+ pages.txt) for GSC cache-bust`);
