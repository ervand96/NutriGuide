import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  splitHtmlAtMidpoint,
  splitHtmlAtChooseHeading,
  formatArticleDate,
  buildArticleFaqs,
} from "../src/lib/article-content.js";

describe("article-content helpers", () => {
  it("splits HTML at a mid paragraph boundary", () => {
    const html = "<p>one</p><p>two</p><p>three</p><p>four</p>";
    const { before, after } = splitHtmlAtMidpoint(html);
    assert.ok(before.includes("<p>one</p>"));
    assert.ok(before.includes("<p>two</p>"));
    assert.ok(after.includes("<p>three</p>"));
    assert.ok(after.includes("<p>four</p>"));
  });

  it("splits HTML after How to Choose heading", () => {
    const html =
      "<p>intro</p><h2>How to Choose the Right Form and Dose</h2><p>body</p>";
    const { before, heading, after, found } = splitHtmlAtChooseHeading(html);
    assert.equal(found, true);
    assert.equal(before, "<p>intro</p>");
    assert.match(heading, /How to Choose the Right Form and Dose/);
    assert.equal(after, "<p>body</p>");
  });

  it("formats ISO dates for readers", () => {
    assert.equal(formatArticleDate("2026-07-08"), "July 8, 2026");
  });

  it("builds default FAQs from products", () => {
    const faqs = buildArticleFaqs({
      title: "Best Magnesium Supplements Reviewed",
      category: "Reviews",
      products: [
        {
          rank: 1,
          name: "NOW Foods Magnesium",
          badge: "Best Overall",
          price: "$14.99",
          description: "Gentle glycinate form for sleep and recovery.",
        },
        {
          rank: 2,
          name: "Doctor's Best Magnesium",
          badge: "Best Absorption",
          price: "$18.00",
          description: "Lysinate glycinate chelate.",
        },
      ],
    });
    assert.ok(faqs.length >= 3);
    assert.match(faqs[0].q, /best/i);
    assert.match(faqs[0].a, /NOW Foods/);
  });

  it("prefers frontmatter faq when present", () => {
    const faqs = buildArticleFaqs({
      title: "Test",
      faq: [{ q: "Custom Q?", a: "Custom A." }],
      products: [],
    });
    assert.equal(faqs.length, 1);
    assert.equal(faqs[0].q, "Custom Q?");
  });
});
