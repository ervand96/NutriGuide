import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { SITE_CONTAINER } from "../src/lib/layout.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function read(rel) {
  return readFileSync(join(root, rel), "utf8");
}

describe("site container layout consistency", () => {
  it("SITE_CONTAINER matches the shared max-w-6xl shell", () => {
    assert.equal(SITE_CONTAINER, "max-w-6xl mx-auto px-4 sm:px-6");
  });

  it("navbar, category strip, footer, and offer strip use SITE_CONTAINER", () => {
    for (const file of [
      "src/components/Navbar.tsx",
      "src/components/CategoryNavStrip.tsx",
      "src/components/Footer.tsx",
      "src/components/OfferStrip.tsx",
    ]) {
      const src = read(file);
      assert.match(
        src,
        /SITE_CONTAINER/,
        `${file} must import and use SITE_CONTAINER`,
      );
      assert.doesNotMatch(
        src,
        /className="max-w-6xl mx-auto/,
        `${file} should not hardcode max-w-6xl (use SITE_CONTAINER)`,
      );
    }
  });

  it("article page uses SITE_CONTAINER and has no nested narrow text columns", () => {
    const src = read("src/app/category/[category]/[slug]/page.tsx");
    assert.match(src, /SITE_CONTAINER/);
    assert.doesNotMatch(src, /max-w-3xl/);
    assert.doesNotMatch(src, /max-w-4xl/);
    assert.match(src, /article-content/);
    assert.match(src, /RelatedArticles/);
  });

  it("static content pages use SITE_CONTAINER instead of max-w-4xl", () => {
    for (const file of [
      "src/app/about/page.tsx",
      "src/app/contact/page.tsx",
      "src/app/privacy-policy/page.tsx",
      "src/app/affiliate-disclosure/page.tsx",
    ]) {
      const src = read(file);
      assert.match(src, /SITE_CONTAINER/, `${file} must use SITE_CONTAINER`);
      assert.doesNotMatch(
        src,
        /max-w-4xl/,
        `${file} must not use a narrower max-w-4xl main`,
      );
    }
  });

  it("homepage FAQ section matches header width (max-w-6xl)", () => {
    const src = read("src/app/page.tsx");
    assert.doesNotMatch(
      src,
      /FAQ[\s\S]{0,200}max-w-4xl/,
      "FAQ section should not use max-w-4xl",
    );
    assert.match(src, /Frequently Asked Questions/);
  });

  it("article markdown text exists for all published posts", () => {
    const postsDir = join(root, "src/content/posts");
    const cats = readdirSync(postsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
    let count = 0;
    for (const cat of cats) {
      const files = readdirSync(join(postsDir, cat)).filter((f) =>
        f.endsWith(".md"),
      );
      count += files.length;
      for (const file of files) {
        const body = readFileSync(join(postsDir, cat, file), "utf8");
        assert.ok(
          body.trim().length > 200,
          `${cat}/${file} should have real article text`,
        );
      }
    }
    assert.ok(count >= 10, `expected published posts, got ${count}`);
  });
});
