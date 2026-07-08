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

export function isAllowedImageUrl(url) {
  if (!url || typeof url !== "string") return false;
  if (url.startsWith("/product-img")) return true;
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

/** Real CDN image → cache → generated SVG product photo */
export function getProductImageUrl(product) {
  if (product?.imageUrl && isAllowedImageUrl(product.imageUrl)) {
    return product.imageUrl;
  }
  const key = cacheKey(product?.name || "");
  if (key) {
    const cached = loadCache()[key];
    if (cached && isAllowedImageUrl(cached)) return cached;
  }
  if (product?.name) return generatedImageUrl(product.name);
  return null;
}

export function saveImageCache(cache) {
  fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true });
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}

export { cacheKey, loadCache, CACHE_PATH };
