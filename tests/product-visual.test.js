import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  productBrand,
  productVisual,
  reviewCountFromProduct,
  starsDisplay,
} from "../src/lib/product-visual.js";

describe("product visual helpers", () => {
  it("extracts brand from product name", () => {
    assert.equal(
      productBrand("NOW Foods, Vitamin D3, 5000 IU"),
      "NOW Foods",
    );
  });

  it("assigns protein products a sports emoji", () => {
    const v = productVisual("Optimum Nutrition Whey Protein");
    assert.equal(v.emoji, "🥤");
  });

  it("parses review count from description text", () => {
    const count = reviewCountFromProduct({
      name: "Test",
      rating: 4.5,
      description: "Over 26,000 customer reviews on iHerb.",
      pros: [],
      cons: [],
    });
    assert.equal(count, "26000");
  });

  it("builds star display counts", () => {
    const s = starsDisplay(4.7);
    assert.equal(s.full, 4);
    assert.equal(s.empty + s.full + (s.half ? 1 : 0), 5);
  });
});
