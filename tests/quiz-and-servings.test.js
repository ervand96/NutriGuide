import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  formatCostPerServing,
  inferServingsFromName,
  withServingEconomics,
} from "../src/lib/product-servings.js";
import { mapQuizToPicks } from "../src/lib/quiz-recommendations.js";
import { dosageKeyForSlug } from "../src/lib/dosage.js";

describe("product servings / cost per serving", () => {
  it("uses magnesium glycinate override (180 tabs ÷ 2)", () => {
    assert.equal(inferServingsFromName("NOW Foods, Magnesium Glycinate"), 90);
    assert.equal(
      formatCostPerServing("$22.36", 90),
      "$0.25",
    );
  });

  it("attaches costPerServing on normalize helper", () => {
    const p = withServingEconomics({
      name: "Doctor's Best, High Absorption Magnesium Lysinate Glycinate",
      price: "$18.99",
    });
    assert.equal(p.servingsPerContainer, 120);
    assert.equal(p.costPerServing, "$0.16");
  });
});

describe("quiz recommendations", () => {
  it("maps sleep goal to magnesium + ashwagandha", () => {
    const { picks, guide } = mapQuizToPicks({
      goal: "sleep",
      gut: "no",
      budget: "$$",
      alreadySupplementing: "no",
      savedAt: new Date().toISOString(),
    });
    assert.equal(picks.length, 2);
    assert.match(picks[0].name, /Magnesium/i);
    assert.match(picks[1].name, /Ashwagandha/i);
    assert.match(guide.href, /magnesium/);
  });

  it("maps muscle goal to creatine + whey", () => {
    const { picks } = mapQuizToPicks({
      goal: "muscle",
      gut: "no",
      budget: "$$$",
      alreadySupplementing: "no",
      savedAt: new Date().toISOString(),
    });
    assert.match(picks[0].name, /Creatine/i);
    assert.match(picks[1].name, /Whey/i);
  });

  it("keeps one pick on lean budget", () => {
    const { picks } = mapQuizToPicks({
      goal: "energy",
      gut: "no",
      budget: "$",
      alreadySupplementing: "no",
      savedAt: new Date().toISOString(),
    });
    assert.equal(picks.length, 1);
  });
});

describe("dosage calculator slug mapping", () => {
  it("detects magnesium / ashwagandha / creatine articles", () => {
    assert.equal(
      dosageKeyForSlug("magnesium-supplements-guide-types-benefits-and-top-picks-78949"),
      "magnesium",
    );
    assert.equal(
      dosageKeyForSlug("best-ashwagandha-supplements-reviewed-top-picks-for-2026-91791"),
      "ashwagandha",
    );
    assert.equal(
      dosageKeyForSlug("best-creatine-supplements-reviewed-top-picks-for-2026-10308"),
      "creatine",
    );
    assert.equal(dosageKeyForSlug("vitamin-d-guide"), null);
  });
});
