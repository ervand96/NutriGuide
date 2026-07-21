import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  getProductImageUrl,
  isAllowedImageUrl,
  isProfessionalProductImage,
  cacheKey,
  photoForProductName,
} from "../src/lib/product-image.js";

describe("product images", () => {
  it("maps zinc products to studio bottle photo", () => {
    assert.match(
      photoForProductName("Thorne, Zinc Picolinate, 30 mg, 60 Capsules"),
      /\/products\/bottle-zinc\.jpg/,
    );
  });

  it("never returns emoji SVG placeholders", () => {
    const url = getProductImageUrl({
      name: "NutraBio, KSM-66 Ashwagandha, 90 Capsules",
    });
    assert.doesNotMatch(url, /product-img/);
    assert.match(url, /images-iherb\.com|\/products\/bottle-/);
  });

  it("maps probiotics to bottle photo not pill lifestyle", () => {
    assert.match(
      photoForProductName("Culturelle, Probiotics, Digestive Daily Probiotic"),
      /\/products\/bottle-/,
    );
  });

  it("maps B12 to bottle photo not lifestyle b12.jpg", () => {
    assert.match(
      photoForProductName("NOW Foods, Methyl B-12, 1,000 mcg"),
      /\/products\/bottle-/,
    );
  });

  it("maps omega products before MyProtein brand protein match", () => {
    assert.match(
      photoForProductName("MyProtein Essential Omega-3 Softgels"),
      /bottle-omega/,
    );
  });

  it("prefers explicit CDN imageUrl", () => {
    const cdn =
      "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/foo/bar/u/1.jpg";
    assert.equal(
      getProductImageUrl({ name: "Test", imageUrl: cdn }),
      cdn,
    );
  });

  it("treats CDN and bottle JPGs as professional", () => {
    assert.equal(
      isProfessionalProductImage(
        "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/now/now01289/u/62.jpg",
      ),
      true,
    );
    assert.equal(
      isProfessionalProductImage("/products/bottle-creatine.jpg"),
      true,
    );
    assert.equal(isProfessionalProductImage("/products/protein.jpg"), false);
    assert.equal(isProfessionalProductImage("/product-img?name=x"), false);
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
