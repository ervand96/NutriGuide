import { writeFileSync, mkdirSync, unlinkSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildSitemapIndexXml,
  buildSitemapUrlsetXml,
  getSitemapEntries,
} from "../src/lib/sitemap-entries.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");
const altDir = join(publicDir, "sitemaps");

const entries = getSitemapEntries();
const xml = buildSitemapUrlsetXml(entries);
const indexXml = buildSitemapIndexXml("/feed/sitemap.xml");
const txt = `${entries.map((e) => e.loc).join("\n")}\n`;

mkdirSync(altDir, { recursive: true });

// Backup copies under /sitemaps/ only — do NOT write public/sitemap.xml or
// public/sitemap_index.xml. Those paths are App Router handlers so Vercel does
// not attach Content-Disposition (which breaks Google Search Console).
writeFileSync(join(altDir, "pages.xml"), xml, "utf8");
writeFileSync(join(altDir, "pages.txt"), txt, "utf8");
writeFileSync(join(altDir, "index.xml"), xml, "utf8");
writeFileSync(join(altDir, "sitemap_index.xml"), indexXml, "utf8");

for (const name of ["sitemap.xml", "sitemap.txt", "sitemap_index.xml"]) {
  const path = join(publicDir, name);
  if (existsSync(path)) {
    unlinkSync(path);
    console.log(`Removed ${path} (served by App Router)`);
  }
}

console.log(`Wrote ${altDir}/pages.xml (${entries.length} URLs)`);
console.log(`Wrote ${altDir}/sitemap_index.xml (index → /feed/sitemap.xml only)`);
