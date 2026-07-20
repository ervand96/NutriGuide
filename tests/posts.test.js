import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getAllPosts, getPostBySlug } from "../src/lib/posts.js";

describe("posts", () => {
  it("loads at least one published article", () => {
    const posts = getAllPosts();
    assert.ok(posts.length >= 1, "expected at least 1 post");
  });

  it("every post has title, category, and slug", () => {
    for (const post of getAllPosts()) {
      assert.ok(post.slug, "slug required");
      assert.ok(post.title, "title required");
      assert.ok(["Diets", "Reviews", "Supplements"].includes(post.category));
    }
  });

  it("getPostBySlug returns null for missing slug", () => {
    assert.equal(getPostBySlug("this-slug-does-not-exist-99999"), null);
  });

  it("getPostBySlug finds a real post", () => {
    const first = getAllPosts()[0];
    const found = getPostBySlug(first.slug);
    assert.ok(found);
    assert.equal(found.slug, first.slug);
    assert.equal(found.title, first.title);
  });

  it("adds imageUrl to normalized products", () => {
    const post = getAllPosts().find((p) => p.products?.length);
    assert.ok(post);
    assert.ok(post.products[0].imageUrl);
    assert.match(post.products[0].imageUrl, /^(\/products\/|\/product-img|https:\/\/)/);
  });

  it("normalizes protein products to myprotein affiliate URLs", () => {
    const posts = getAllPosts();
    const proteinPost = posts.find((p) =>
      p.products?.some((pr) =>
        /whey|creatine|myprotein/i.test(pr.name || ""),
      ),
    );
    if (proteinPost) {
      const protein = proteinPost.products.find((pr) =>
        /whey|creatine|myprotein/i.test(pr.name || ""),
      );
      assert.match(protein.affiliateUrl, /^\/go\/myprotein/);
    }
  });

  it("product affiliate URLs only use iherb or myprotein", () => {
    for (const post of getAllPosts()) {
      for (const p of post.products || []) {
        if (!p.affiliateUrl) continue;
        assert.match(
          p.affiliateUrl,
          /^\/go\/(iherb|myprotein)/,
          `invalid affiliate URL in ${post.slug}: ${p.affiliateUrl}`,
        );
      }
    }
  });
});
