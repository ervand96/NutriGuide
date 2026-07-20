import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  SITE_URL,
  escapeXml,
  pageMetadata,
  organizationJsonLd,
  websiteJsonLd,
  productJsonLd,
  absoluteUrl,
} from "../src/lib/seo.js";

describe("seo helpers", () => {
  it("exposes a production site URL", () => {
    assert.match(SITE_URL, /^https:\/\//);
  });

  it("escapes XML entities for RSS safety", () => {
    assert.equal(escapeXml(`A & B <C> "D"`), "A &amp; B &lt;C&gt; &quot;D&quot;");
  });

  it("builds page metadata with canonical and social images", () => {
    const meta = pageMetadata({
      title: "Best Picks",
      description: "Top guides",
      path: "/best-picks",
    });
    assert.equal(meta.alternates.canonical, `${SITE_URL}/best-picks`);
    assert.equal(meta.openGraph.url, `${SITE_URL}/best-picks`);
    assert.ok(meta.twitter.images[0].includes("/og/"));
  });

  it("builds Organization and WebSite JSON-LD", () => {
    const org = organizationJsonLd();
    const web = websiteJsonLd();
    assert.equal(org["@type"], "Organization");
    assert.equal(web["@type"], "WebSite");
    assert.equal(web.url, SITE_URL);
  });

  it("builds Product JSON-LD with rating when reviews are cited", () => {
    const schema = productJsonLd({
      name: "NOW Foods, Magnesium, 400 mg",
      description: "Trusted by 12,450 customer reviews",
      price: "$14.99",
      rating: 4.7,
      rank: 1,
      affiliateUrl: "/go/iherb?q=magnesium",
    });
    assert.equal(schema["@type"], "Product");
    assert.equal(schema.brand.name, "NOW Foods");
    assert.equal(schema.offers.price, "14.99");
    assert.ok(schema.aggregateRating);
    assert.equal(schema.aggregateRating.ratingCount, "12450");
    assert.equal(schema.offers.url, absoluteUrl("/go/iherb?q=magnesium"));
  });

  it("omits AggregateRating without cited review counts", () => {
    const schema = productJsonLd({
      name: "Test Brand, Product",
      rating: 4.5,
      price: "$10",
      affiliateUrl: "/go/iherb",
    });
    assert.equal(schema.aggregateRating, undefined);
  });

  it("omits Offer when price is missing", () => {
    const schema = productJsonLd({
      name: "Test Brand, Product",
      affiliateUrl: "/go/iherb",
    });
    assert.equal(schema.offers, undefined);
  });
});
