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
 * Studio bottle shots only — never lifestyle pill piles / emoji SVG.
 * These match the iHerb-style white-background product look.
 */
const KEYWORD_BOTTLES = [
  { match: /ashwagandha|adaptogen|ksm-66|ksm66/i, src: "/products/bottle-ashwagandha.jpg" },
  { match: /magnesium|glycinate|threonate|electrolyte|hydration|nuun|liquid i\.?v|ultima/i, src: "/products/bottle-magnesium.jpg" },
  { match: /zinc|picolinate/i, src: "/products/bottle-zinc.jpg" },
  { match: /vitamin d|d3|d-3|multivitamin|multi for|basic nutrients|two-per-day|ag1|green|superfood|orgain|perfect food/i, src: "/products/bottle-vitamin-d.jpg" },
  { match: /b-?12|methylcobalamin|folate|probiotic|culturelle/i, src: "/products/bottle-zinc.jpg" },
  { match: /omega|fish oil|dha|epa|mct|olive oil|psyllium|fiber/i, src: "/products/bottle-omega.jpg" },
  { match: /melatonin|sleep/i, src: "/products/bottle-ashwagandha.jpg" },
  { match: /creatine|pre-workout|pre workout|whey|\bisolate\b|mass gainer|\bprotein\b|collagen|gelatin/i, src: "/products/bottle-creatine.jpg" },
];

export function photoForProductName(name = "") {
  for (const row of KEYWORD_BOTTLES) {
    if (row.match.test(name)) return row.src;
  }
  return "/products/bottle-vitamin-d.jpg";
}

/** Real iHerb CDN product photography */
export function isCdnProductImage(url) {
  if (!url || typeof url !== "string") return false;
  return (
    /cloudinary\.images-iherb\.com|s3\.images-iherb\.com|images-iherb\.com/i.test(
      url,
    ) && /\/images\/[a-z0-9]+\//i.test(url)
  );
}

/** Professional product shot we allow on cards: CDN or studio bottle JPG */
export function isProfessionalProductImage(url) {
  if (!url || typeof url !== "string") return false;
  if (isCdnProductImage(url)) return true;
  if (url.startsWith("/products/bottle-") && url.endsWith(".jpg")) return true;
  return false;
}

export function isAllowedImageUrl(url) {
  if (!url || typeof url !== "string") return false;
  // Keep /product-img allowed for legacy routes, but getProductImageUrl never returns it
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

/**
 * Prefer real iHerb CDN photos; otherwise studio bottle JPGs.
 * Never return emoji SVG placeholders or lifestyle pill-pile photos.
 */
export function getProductImageUrl(product) {
  if (product?.imageUrl && isProfessionalProductImage(product.imageUrl)) {
    return product.imageUrl;
  }
  if (product?.imageUrl && isCdnProductImage(product.imageUrl)) {
    return product.imageUrl;
  }

  const key = cacheKey(product?.name || "");
  if (key) {
    const cached = loadCache()[key];
    if (cached && isProfessionalProductImage(cached)) return cached;
    if (cached && isCdnProductImage(cached)) return cached;
  }

  return photoForProductName(product?.name || "");
}

export function saveImageCache(cache) {
  fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true });
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}

export { cacheKey, loadCache, CACHE_PATH };
