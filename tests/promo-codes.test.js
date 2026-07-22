import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  getActivePromoCodes,
  getLatestPromoVerifiedDate,
  formatPromoMonthYear,
  promoCodesOfferJsonLd,
  PROMO_CODES,
} from "../src/data/promo-codes.js";

describe("promo codes data", () => {
  it("exposes active codes with lastVerified dates", () => {
    const codes = getActivePromoCodes();
    assert.ok(codes.length >= 2);
    for (const c of codes) {
      assert.ok(c.lastVerified);
      assert.ok(["iHerb", "MyProtein"].includes(c.store));
      assert.ok(c.link.includes("/go/"));
    }
  });

  it("filters expired codes from active list", () => {
    const active = getActivePromoCodes();
    assert.ok(active.every((c) => !c.expired));
    assert.ok(active.length <= PROMO_CODES.length);
  });

  it("picks the newest verification date", () => {
    assert.equal(
      getLatestPromoVerifiedDate([
        { lastVerified: "2026-07-01" },
        { lastVerified: "2026-07-22" },
        { lastVerified: "2026-06-15" },
      ]),
      "2026-07-22",
    );
    assert.match(formatPromoMonthYear("2026-07-22"), /July 2026/);
  });

  it("builds Offer JSON-LD", () => {
    const ld = promoCodesOfferJsonLd(
      getActivePromoCodes().slice(0, 1),
      "https://example.com/promo-codes",
      "https://example.com",
    );
    assert.equal(ld["@type"], "ItemList");
    assert.equal(ld.itemListElement[0].item["@type"], "Offer");
  });
});
