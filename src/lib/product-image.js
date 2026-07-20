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

/** Keyword → concrete product photo in /public/products (specific first) */
const KEYWORD_PHOTOS = [
  { match: /ashwagandha|adaptogen|ksm-66|ksm66/i, src: "/products/bottle-ashwagandha.jpg" },
  { match: /omega|fish oil|dha|epa|mct oil/i, src: "/products/bottle-omega.jpg" },
  { match: /magnesium|glycinate|threonate/i, src: "/products/bottle-magnesium.jpg" },
  { match: /zinc|picolinate/i, src: "/products/bottle-zinc.jpg" },
  { match: /vitamin d|d3|d-3/i, src: "/products/bottle-vitamin-d.jpg" },
  { match: /b-?12|methylcobalamin|folate/i, src: "/products/b12.jpg" },
  { match: /probiotic|culturelle/i, src: "/products/probiotics.jpg" },
  { match: /collagen|gelatin/i, src: "/products/protein.jpg" },
  { match: /electrolyte|hydration|nuun|liquid i\.?v/i, src: "/products/supplements.jpg" },
  { match: /psyllium|fiber|olive oil/i, src: "/products/herbs.jpg" },
  { match: /melatonin|sleep/i, src: "/products/sleep.jpg" },
  { match: /creatine|pre-workout|pre workout|whey|\bisolate\b|mass gainer|\bprotein\b/i, src: "/products/bottle-creatine.jpg" },
  { match: /multivitamin|multi for|basic nutrients|ag1|green|superfood/i, src: "/products/multivitamin.jpg" },
];

export function photoForProductName(name = "") {
  for (const row of KEYWORD_PHOTOS) {
    if (row.match.test(name)) return row.src;
  }
  return "/products/supplements.jpg";
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
