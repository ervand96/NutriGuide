#!/usr/bin/env node
/**
 * Cache real product image URLs by product name.
 *
 * Auto-fetch from iHerb is often blocked by Cloudflare.
 * Add URLs manually to src/data/product-images.json:
 *
 * {
 *   "now foods, ksm-66 ashwagandha, 600 mg, 90 veg capsules": "https://cloudinary.images-iherb.com/image/upload/..."
 * }
 *
 * Keys are lowercase product names (see cacheKey in src/lib/product-image.js).
 * Without a cached URL, cards use /product-img SVG placeholders automatically.
 *
 * Usage: npm run images:enrich -- --limit=20
 */

import { getAllPosts } from "../src/lib/posts.js";
import {
  cacheKey,
  loadCache,
  saveImageCache,
  isAllowedImageUrl,
} from "../src/lib/product-image.js";

const IHERB_RCODE = process.env.IHERB_RCODE || "QXH0410";
const limit = Number(process.argv.find((a) => a.startsWith("--limit="))?.split("=")[1]) || 999;

function extractIherbImage(html) {
  const patterns = [
    /https:\/\/cloudinary\.images-iherb\.com\/image\/upload[^"'\s)]+/i,
    /https:\/\/[^"'\s]*images-iherb\.com[^"'\s]+\.(jpg|jpeg|png|webp)/i,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m) {
      let url = m[0].replace(/\\u002F/g, "/");
      if (url.includes("/images/")) return url.split("?")[0] + "?f_auto,q_auto:eco";
      return url;
    }
  }
  return null;
}

async function fetchIherbImage(productName) {
  const q = productName.split(",")[0].trim().slice(0, 60);
  const url = `https://www.iherb.com/search?kw=${encodeURIComponent(q)}&rcode=${IHERB_RCODE}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; NutriGuide/1.0; +https://nutri-guide-indol.vercel.app)",
      Accept: "text/html",
    },
  });
  if (!res.ok) return null;
  const html = await res.text();
  return extractIherbImage(html);
}

async function main() {
  const cache = loadCache();
  const posts = getAllPosts();
  const names = new Set();

  for (const post of posts) {
    for (const p of post.products || []) {
      if (p.name) names.add(p.name);
    }
  }

  const todo = [...names].filter((n) => !cache[cacheKey(n)]);
  console.log(`Products: ${names.size}, to fetch: ${Math.min(todo.length, limit)}`);
  console.log("(If all fail, add URLs manually to src/data/product-images.json)\n");

  let added = 0;
  for (const name of todo.slice(0, limit)) {
    process.stdout.write(`  ${name.slice(0, 50)}… `);
    try {
      const imageUrl = await fetchIherbImage(name);
      if (imageUrl && isAllowedImageUrl(imageUrl)) {
        cache[cacheKey(name)] = imageUrl;
        added++;
        console.log("✓");
      } else {
        console.log("—");
      }
    } catch {
      console.log("err");
    }
    await new Promise((r) => setTimeout(r, 800));
  }

  saveImageCache(cache);
  console.log(`\nDone. Added ${added} images. Cache: ${Object.keys(cache).length} total.`);
}

main();
