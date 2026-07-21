import fs from "fs";
import path from "path";

const CACHE_PATH = path.join(process.cwd(), "src/data/product-images.json");

function cacheKey(name = "") {
  return name.toLowerCase().trim().replace(/\s+/g, " ");
}

function loadCache() {
  try {
    return JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
  } catch {
    return {};
  }
}

/**
 * Keyword → distinct category photo (specific first).
 * Prefer category lifestyle/product shots so probiotics ≠ magnesium, B12 ≠ zinc, etc.
 */
const KEYWORD_PHOTOS = [
  { match: /ashwagandha|adaptogen|ksm-66|ksm66/i, src: "/products/bottle-ashwagandha.jpg" },
  { match: /probiotic|culturelle/i, src: "/products/probiotics.jpg" },
  { match: /electrolyte|hydration|nuun|liquid i\.?v|ultima replenisher/i, src: "/products/magnesium.jpg" },
  { match: /magnesium|glycinate|threonate/i, src: "/products/bottle-magnesium.jpg" },
  { match: /b-?12|methylcobalamin|folate/i, src: "/products/b12.jpg" },
  { match: /zinc|picolinate/i, src: "/products/bottle-zinc.jpg" },
  { match: /vitamin d|d3|d-3/i, src: "/products/bottle-vitamin-d.jpg" },
  { match: /collagen|gelatin/i, src: "/products/protein.jpg" },
  { match: /psyllium|fiber/i, src: "/products/herbs.jpg" },
  { match: /olive oil/i, src: "/products/fish-oil.jpg" },
  { match: /mct oil/i, src: "/products/omega.jpg" },
  { match: /omega|fish oil|dha|epa/i, src: "/products/bottle-omega.jpg" },
  { match: /melatonin|sleep/i, src: "/products/sleep.jpg" },
  { match: /pre-workout|pre workout/i, src: "/products/creatine.jpg" },
  { match: /creatine/i, src: "/products/bottle-creatine.jpg" },
  { match: /whey|\bisolate\b|mass gainer|\bprotein\b/i, src: "/products/protein.jpg" },
  { match: /ag1|green|superfood|perfect food|orgain/i, src: "/products/supplements.jpg" },
  { match: /multivitamin|multi for|basic nutrients|two-per-day/i, src: "/products/multivitamin.jpg" },
];

export function photoForProductName(name = "") {
  for (const row of KEYWORD_PHOTOS) {
    if (row.match.test(name)) return row.src;
  }
  return "/products/bottle-vitamin-d.jpg";
}

export function isAllowedImageUrl(url) {
  if (!url || typeof url !== "string") return false;
  if (url.startsWith("/product-img")) return true;
  if (url.startsWith("/products/")) return true;
  try {
    const u = new URL(url, "https://nutriguide.local");
    const host = u.hostname.toLowerCase();
    return (
      host.includes("iherb.com") ||
      host.includes("myprotein.com") ||
      host.includes("images-iherb") ||
      host === "images.unsplash.com" ||
      host === "nutriguide.local"
    );
  } catch {
    return url.startsWith("/");
  }
}

function generatedImageUrl(name = "") {
  return `/product-img?name=${encodeURIComponent(name.slice(0, 120))}`;
}

/** Explicit imageUrl → cache → keyword photo → SVG placeholder */
export function getProductImageUrl(product) {
  if (product?.imageUrl && isAllowedImageUrl(product.imageUrl)) {
    return product.imageUrl;
  }
  const key = cacheKey(product?.name || "");
  if (key) {
    const cached = loadCache()[key];
    if (cached && isAllowedImageUrl(cached)) return cached;
  }
  if (product?.name) {
    return photoForProductName(product.name);
  }
  return generatedImageUrl("Supplement");
}

export function saveImageCache(cache) {
  fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true });
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}

export { cacheKey, loadCache, CACHE_PATH };
