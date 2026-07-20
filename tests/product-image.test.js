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
    const url = getProductImageUrl({
      name: "Thorne, Zinc Picolinate, 30 mg, 60 Capsules",
    });
    assert.match(url, /\/products\/bottle-zinc\.jpg/);
  });

  it("maps omega products before MyProtein brand protein match", () => {
    assert.match(
      photoForProductName("MyProtein Essential Omega-3 Softgels"),
      /bottle-omega/,
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
