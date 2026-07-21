#!/usr/bin/env node
/**
 * Remap shared bottle-*.jpg cache entries to distinct category photos,
 * and assign /product-img?name=… when multiple products would still collide.
 */
import { getAllPosts } from "../src/lib/posts.js";
import {
  cacheKey,
  loadCache,
  saveImageCache,
  photoForProductName,
} from "../src/lib/product-image.js";

function isGenericBottle(url = "") {
  return /\/products\/bottle-/i.test(url);
}

function isCdn(url = "") {
  return /images-iherb\.com|myprotein\.com/i.test(url);
}

function main() {
  const cache = loadCache();
  const names = [
    ...new Set(
      getAllPosts().flatMap((p) =>
        (p.products || []).map((pr) => pr.name).filter(Boolean),
      ),
    ),
  ];

  let remapped = 0;
  for (const name of names) {
    const key = cacheKey(name);
    const cur = cache[key];
    if (isCdn(cur)) continue;
    const next = photoForProductName(name);
    if (!cur || isGenericBottle(cur) || cur !== next) {
      if (cur !== next) {
        cache[key] = next;
        remapped++;
      } else if (!cur) {
        cache[key] = next;
        remapped++;
      }
    }
  }

  // Within each post, if 2+ products share the same local image, uniquify with product-img
  let uniquified = 0;
  for (const post of getAllPosts()) {
    const products = post.products || [];
    if (products.length < 2) continue;
    const byImg = new Map();
    for (const p of products) {
      const key = cacheKey(p.name);
      const img = cache[key] || photoForProductName(p.name);
      if (isCdn(img)) continue;
      if (!byImg.has(img)) byImg.set(img, []);
      byImg.get(img).push(p.name);
    }
    for (const [, group] of byImg) {
      if (group.length < 2) continue;
      // keep first on category photo; others get unique SVG cards
      for (const name of group.slice(1)) {
        const key = cacheKey(name);
        if (isCdn(cache[key])) continue;
        cache[key] = `/product-img?name=${encodeURIComponent(name.slice(0, 120))}`;
        uniquified++;
      }
    }
  }

  saveImageCache(cache);

  const values = Object.values(cache);
  const cdn = values.filter(isCdn).length;
  const local = values.filter((v) => String(v).startsWith("/products/")).length;
  const svg = values.filter((v) => String(v).startsWith("/product-img")).length;
  const unique = new Set(values).size;

  console.log(
    JSON.stringify(
      {
        remapped,
        uniquified,
        keys: Object.keys(cache).length,
        uniqueImages: unique,
        cdn,
        localFiles: local,
        productImgSvg: svg,
      },
      null,
      2,
    ),
  );
}

main();
