#!/usr/bin/env node
/**
 * Drop emoji SVG + lifestyle pill photos from product-images.json.
 * Keep only real iHerb CDN URLs; everything else falls back to studio bottles.
 */
import {
  loadCache,
  saveImageCache,
  isCdnProductImage,
  cacheKey,
} from "../src/lib/product-image.js";

/** Hand-curated iHerb CDN product shots (matched to our catalog names). */
const SEED = {
  "now foods, magnesium glycinate":
    "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/now/now01289/u/62.jpg",
  "doctor's best, high absorption magnesium lysinate glycinate":
    "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/drb/drb00087/u/214.jpg",
  "life extension, neuro-mag magnesium l-threonate":
    "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/lex/lex16039/u/276.jpg",
  "now foods, psyllium husk powder":
    "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/now/now05978/u/28.jpg",
};

const cache = loadCache();
const next = {};

for (const [key, url] of Object.entries(cache)) {
  if (isCdnProductImage(url)) {
    next[key] = url.split("?")[0] + "?f_auto,q_auto:eco";
  }
}

for (const [name, url] of Object.entries(SEED)) {
  next[cacheKey(name)] = url.includes("?")
    ? url
    : url + (url.includes("?") ? "" : "?f_auto,q_auto:eco".replace("?f_auto,q_auto:eco", url.includes("f_auto") ? "" : "?f_auto,q_auto:eco"));
  // normalize
  next[cacheKey(name)] = url.includes("f_auto")
    ? url
    : `${url}?f_auto,q_auto:eco`;
}

saveImageCache(next);
console.log(
  `Kept ${Object.keys(next).length} CDN images (removed SVG/lifestyle).`,
);
console.log(Object.keys(next).sort().join("\n"));
