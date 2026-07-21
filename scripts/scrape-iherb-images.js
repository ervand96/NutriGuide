#!/usr/bin/env node
/**
 * Scrape iHerb product images with stronger anti-bot waits.
 * Usage: node scripts/scrape-iherb-images.js [--force] [--limit=30]
 */
import { chromium } from "playwright";
import { getAllPosts } from "../src/lib/posts.js";
import {
  cacheKey,
  loadCache,
  saveImageCache,
  isAllowedImageUrl,
} from "../src/lib/product-image.js";

const LIMIT =
  Number(process.argv.find((a) => a.startsWith("--limit="))?.split("=")[1]) ||
  999;
const FORCE = process.argv.includes("--force");
const ONLY_LOCAL = process.argv.includes("--only-local");

function needsFetch(url) {
  if (!url) return true;
  if (FORCE) return true;
  if (String(url).includes("images-iherb.com")) return false;
  if (ONLY_LOCAL) return String(url).startsWith("/products/");
  return String(url).startsWith("/products/bottle-");
}

function pickImage(imgs, query) {
  const tokens = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !["the", "and", "for", "with"].includes(t));
  const brand = tokens.slice(0, 2).join(" ");
  const scored = imgs
    .map((img) => {
      const alt = (img.alt || "").toLowerCase();
      let score = 0;
      if (brand && alt.includes(brand)) score += 8;
      for (const t of tokens.slice(0, 8)) if (alt.includes(t)) score += 1;
      return { ...img, score };
    })
    .sort((a, b) => b.score - a.score);
  return scored[0] || null;
}

async function searchImage(context, name) {
  const page = await context.newPage();
  try {
    const q = name.split(",").slice(0, 2).join(" ").slice(0, 70);
    const url = `https://www.iherb.com/search?kw=${encodeURIComponent(q)}`;
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    try {
      await page.waitForSelector(
        'img[src*="cloudinary.images-iherb.com/image/upload"][src*="/images/"]',
        { timeout: 12000 },
      );
    } catch {
      /* continue — may still have imgs */
    }
    await page.waitForTimeout(800);
    const imgs = await page.evaluate(() =>
      [...document.querySelectorAll("img")]
        .map((img) => ({
          alt: img.alt || "",
          src: (img.currentSrc || img.src || "").split("?")[0],
        }))
        .filter(
          (x) =>
            /cloudinary\.images-iherb\.com\/image\/upload/i.test(x.src) &&
            /\/images\/[a-z0-9]+\//i.test(x.src) &&
            !/cms\//i.test(x.src),
        ),
    );
    const hit = pickImage(imgs, name);
    if (!hit?.src) return null;
    return `${hit.src}?f_auto,q_auto:eco`;
  } finally {
    await page.close();
  }
}

async function main() {
  const cache = loadCache();
  const names = [
    ...new Set(
      getAllPosts().flatMap((p) =>
        (p.products || []).map((pr) => pr.name).filter(Boolean),
      ),
    ),
  ];

  // Prefer non-MyProtein first (iHerb catalog)
  const todo = names
    .filter((n) => needsFetch(cache[cacheKey(n)]))
    .sort((a, b) => {
      const am = /myprotein/i.test(a) ? 1 : 0;
      const bm = /myprotein/i.test(b) ? 1 : 0;
      return am - bm;
    });

  console.log(
    `Products: ${names.length}, to fetch: ${Math.min(todo.length, LIMIT)}`,
  );

  const browser = await chromium.launch({
    headless: true,
    args: ["--disable-blink-features=AutomationControlled"],
  });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    locale: "en-US",
    viewport: { width: 1280, height: 900 },
  });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => undefined });
  });

  let added = 0;
  for (const name of todo.slice(0, LIMIT)) {
    process.stdout.write(`  ${name.slice(0, 55)}… `);
    try {
      const imageUrl = await searchImage(context, name);
      if (imageUrl && isAllowedImageUrl(imageUrl)) {
        cache[cacheKey(name)] = imageUrl;
        added++;
        console.log("✓");
        // persist incrementally
        saveImageCache(cache);
      } else {
        console.log("—");
      }
    } catch (e) {
      console.log("err", (e.message || "").slice(0, 50));
    }
    await new Promise((r) => setTimeout(r, 1800));
  }

  await browser.close();
  saveImageCache(cache);
  console.log(`\nDone. Updated ${added}. Cache keys: ${Object.keys(cache).length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
