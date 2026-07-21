import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  getProductImageUrl,
  isAllowedImageUrl,
  cacheKey,
  photoForProductName,
} from "../src/lib/product-image.js";

describe("product images", () => {
  it("maps zinc products to concrete zinc bottle photo", () => {
    assert.match(
      photoForProductName("Thorne, Zinc Picolinate, 30 mg, 60 Capsules"),
      /\/products\/bottle-zinc\.jpg/,
    );
  });

  it("getProductImageUrl prefers cached CDN or unique images", () => {
    const url = getProductImageUrl({
      name: "NOW Foods, Magnesium Glycinate",
    });
    assert.ok(
      /images-iherb\.com|\/products\/|\/product-img/.test(url),
      `unexpected image url: ${url}`,
    );
  });

  it("maps probiotics to probiotics photo not magnesium", () => {
    assert.match(
      photoForProductName("Culturelle, Probiotics, Digestive Daily Probiotic"),
      /probiotics\.jpg/,
    );
  });

  it("maps B12 to b12 photo not zinc", () => {
    assert.match(
      photoForProductName("NOW Foods, Methyl B-12, 1,000 mcg"),
      /b12\.jpg/,
    );
  });

  it("maps omega products before MyProtein brand protein match", () => {
    assert.match(
      photoForProductName("MyProtein Essential Omega-3 Softgels"),
      /bottle-omega|omega/,
    );
  });

  it("prefers explicit imageUrl when allowed", () => {
    const cdn =
      "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/foo.jpg";
    assert.equal(
      getProductImageUrl({ name: "Test", imageUrl: cdn }),
      cdn,
    );
  });

  it("allows /products and /product-img paths", () => {
    assert.equal(isAllowedImageUrl("/product-img?name=x"), true);
    assert.equal(isAllowedImageUrl("/products/bottle-zinc.jpg"), true);
  });

  it("rejects unknown external hosts", () => {
    assert.equal(isAllowedImageUrl("https://evil.example.com/x.jpg"), false);
  });

  it("normalizes cache keys to lowercase", () => {
    assert.equal(
      cacheKey("NOW Foods, Ashwagandha"),
      "now foods, ashwagandha",
    );
  });
});
