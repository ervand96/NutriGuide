import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getAllPosts } from "../src/lib/posts.js";
import { SITE_URL } from "../src/lib/seo.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const keyPath = join(root, ".indexnow-key");

if (!existsSync(keyPath)) {
  console.error("Missing .indexnow-key — run setup first");
  process.exit(1);
}

const key = readFileSync(keyPath, "utf8").trim();
const host = SITE_URL.replace(/^https?:\/\//, "");

const urls = [
  SITE_URL,
  `${SITE_URL}/best-picks`,
  `${SITE_URL}/quiz`,
  `${SITE_URL}/category/diets`,
  `${SITE_URL}/category/reviews`,
  `${SITE_URL}/category/supplements`,
  ...getAllPosts().map(
    (p) => `${SITE_URL}/category/${p.category.toLowerCase()}/${p.slug}`,
  ),
];

const body = {
  host,
  key,
  keyLocation: `${SITE_URL}/${key}.txt`,
  urlList: urls,
};

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(body),
});

console.log("IndexNow status:", res.status, res.statusText);
console.log("Submitted URLs:", urls.length);
if (!res.ok) {
  console.log(await res.text());
  process.exit(1);
}
console.log("OK — Bing/Yandex notified. Google still needs Search Console.");
