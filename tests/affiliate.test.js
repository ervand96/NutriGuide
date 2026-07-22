import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  PARTNERS,
  buildAffiliateUrl,
  isValidPartner,
  partnerForProduct,
  buttonTextForPartner,
  shopLinksForProduct,
} from "../src/lib/affiliate.js";

describe("affiliate partners", () => {
  it("only allows iherb and myprotein", () => {
    assert.deepEqual(PARTNERS, ["iherb", "myprotein"]);
    assert.equal(isValidPartner("iherb"), true);
    assert.equal(isValidPartner("myprotein"), true);
    assert.equal(isValidPartner("amazon"), false);
    assert.equal(isValidPartner("noom"), false);
  });

  it("builds iHerb URL with rcode first and no UTM", () => {
    const url = buildAffiliateUrl("iherb", "vitamin d", {
      IHERB_RCODE: "TEST123",
    });
    assert.match(url, /^https:\/\/www\.iherb\.com\/search\?/);
    assert.match(url, /rcode=TEST123/);
    assert.match(url, /kw=vitamin/);
    assert.ok(!url.includes("utm_"));
  });

  it("supports regional iHerb host via IHERB_HOST", () => {
    const url = buildAffiliateUrl("iherb", null, {
      IHERB_RCODE: "TEST123",
      IHERB_HOST: "am.iherb.com",
    });
    assert.equal(url, "https://am.iherb.com/?rcode=TEST123");
  });

  it("skips UTM on iHerb destinations", async () => {
    const { appendUtm } = await import("../src/lib/affiliate.js");
    const base = "https://www.iherb.com/?rcode=TEST123";
    assert.equal(appendUtm(base, "home", "iherb"), base);
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

  it("shopLinksForProduct provides primary and secondary store links", () => {
    const links = shopLinksForProduct(
      {
        name: "NOW Foods Magnesium",
        affiliateUrl: "/go/iherb?source=test&q=magnesium",
        buttonText: "Check Price on iHerb",
      },
      "test-card",
    );
    assert.equal(links.primary, "iherb");
    assert.equal(links.secondary, "myprotein");
    assert.match(links.primaryHref, /^\/go\/iherb/);
    assert.match(links.secondaryHref, /^\/go\/myprotein/);
    assert.match(links.secondaryLabel, /MyProtein/);
  });
});
