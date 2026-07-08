import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  getProductImageUrl,
  isAllowedImageUrl,
  cacheKey,
} from "../src/lib/product-image.js";

describe("product images", () => {
  it("generates /product-img URL when no cache or explicit image", () => {
    const url = getProductImageUrl({ name: "NOW Foods Vitamin D3" });
    assert.match(url, /^\/product-img\?name=/);
  });

  it("prefers explicit imageUrl when allowed", () => {
    const cdn =
      "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/foo.jpg";
    assert.equal(
      getProductImageUrl({ name: "Test", imageUrl: cdn }),
      cdn,
    );
  });

  it("allows /product-img paths", () => {
    assert.equal(isAllowedImageUrl("/product-img?name=x"), true);
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
