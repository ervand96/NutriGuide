import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  PARTNERS,
  buildAffiliateUrl,
  isValidPartner,
  partnerForProduct,
  buttonTextForPartner,
} from "../src/lib/affiliate.js";

describe("affiliate partners", () => {
  it("only allows iherb and myprotein", () => {
    assert.deepEqual(PARTNERS, ["iherb", "myprotein"]);
    assert.equal(isValidPartner("iherb"), true);
    assert.equal(isValidPartner("myprotein"), true);
    assert.equal(isValidPartner("amazon"), false);
    assert.equal(isValidPartner("noom"), false);
  });

  it("builds iHerb URL with rcode", () => {
    const url = buildAffiliateUrl("iherb", "vitamin d", {
      IHERB_RCODE: "TEST123",
    });
    assert.match(url, /^https:\/\/www\.iherb\.com\/search/);
    assert.match(url, /rcode=TEST123/);
    assert.match(url, /vitamin/);
  });

  it("builds MyProtein URL with search when query provided", () => {
    const url = buildAffiliateUrl("myprotein", "creatine", {
      MY_PROTEIN_RCODE: "MY-CODE",
    });
    assert.match(url, /myprotein\.com\/search/);
    assert.match(url, /applyCode=MY-CODE/);
    assert.match(url, /creatine/);
  });

  it("routes creatine in Reviews category to myprotein", () => {
    assert.equal(
      partnerForProduct("Optimum Nutrition Creatine", "Reviews"),
      "myprotein",
    );
  });

  it("routes MyProtein-branded products to myprotein", () => {
    assert.equal(partnerForProduct("MyProtein Impact Whey"), "myprotein");
    assert.equal(partnerForProduct("NOW Vitamin D3"), "iherb");
  });

  it("returns correct button labels", () => {
    assert.equal(buttonTextForPartner("iherb"), "Check Price on iHerb");
    assert.equal(
      buttonTextForPartner("myprotein"),
      "Check Price on MyProtein",
    );
  });
});
