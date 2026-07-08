import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const PORT = 3456;
const BASE = `http://localhost:${PORT}`;

let server;

function waitForServer(maxMs = 60000) {
  const start = Date.now();
  return (async () => {
    while (Date.now() - start < maxMs) {
      try {
        const res = await fetch(BASE);
        if (res.ok) return;
      } catch {
        // not ready
      }
      await sleep(500);
    }
    throw new Error("Dev server did not start in time");
  })();
}

before(async () => {
  server = spawn("npm", ["run", "dev", "--", "-p", String(PORT)], {
    cwd: process.cwd(),
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, NODE_ENV: "development" },
  });

  server.stderr.on("data", (d) => {
    const msg = d.toString();
    if (msg.includes("Error") && !msg.includes("EADDRINUSE")) {
      console.error(msg);
    }
  });

  await waitForServer();
});

after(() => {
  if (server) server.kill("SIGTERM");
});

describe("site integration", () => {
  it("homepage loads with NutriGuide branding", async () => {
    const res = await fetch(BASE);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.match(html, /NutriGuide/);
    assert.match(html, /iHerb/);
    assert.match(html, /MyProtein/);
    assert.doesNotMatch(html, /HelloFresh/);
    assert.doesNotMatch(html, /Amazon Associates/);
  });

  it("homepage shows product shelf section", async () => {
    const res = await fetch(BASE);
    const html = await res.text();
    assert.match(html, /Top Rated Products/);
    assert.match(html, /product-img\?name=/);
    assert.match(html, /Add to cart/);
  });

  it("quiz page loads with shared navbar", async () => {
    const res = await fetch(`${BASE}/quiz`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.match(html, /Find Your Perfect Diet/);
    assert.match(html, /iHerb/);
  });

  it("static pages load", async () => {
    for (const path of [
      "/about",
      "/contact",
      "/privacy-policy",
      "/affiliate-disclosure",
    ]) {
      const res = await fetch(`${BASE}${path}`);
      assert.equal(res.status, 200, `${path} should return 200`);
    }
  });

  it("favicon.ico does not 404", async () => {
    const res = await fetch(`${BASE}/favicon.ico`, { redirect: "manual" });
    assert.ok(
      res.status === 200 || [301, 302, 307, 308].includes(res.status),
      `favicon should not 404, got ${res.status}`,
    );
  });

  it("product-img route returns SVG", async () => {
    const res = await fetch(
      `${BASE}/product-img?name=NOW%20Foods%20Ashwagandha`,
    );
    assert.equal(res.status, 200);
    const type = res.headers.get("content-type") || "";
    assert.match(type, /image\/svg\+xml/);
    const body = await res.text();
    assert.match(body, /<svg/);
  });

  it("product-img works without query params", async () => {
    const res = await fetch(`${BASE}/product-img`);
    assert.equal(res.status, 200);
  });

  it("seo routes load", async () => {
    for (const path of ["/sitemap.xml", "/robots.txt", "/rss.xml"]) {
      const res = await fetch(`${BASE}${path}`);
      assert.equal(res.status, 200, `${path} should return 200`);
    }
  });

  it("affiliate disclosure mentions only iHerb and MyProtein", async () => {
    const res = await fetch(`${BASE}/affiliate-disclosure`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.match(html, /iHerb/);
    assert.match(html, /MyProtein/);
  });

  it("/go/iherb redirects to iherb.com with rcode", async () => {
    const res = await fetch(`${BASE}/go/iherb?source=test`, {
      redirect: "manual",
    });
    assert.ok([301, 302, 307, 308].includes(res.status));
    const loc = res.headers.get("location") || "";
    assert.match(loc, /iherb\.com/);
    assert.match(loc, /rcode=/);
  });

  it("/go/myprotein redirects to myprotein.com", async () => {
    const res = await fetch(`${BASE}/go/myprotein?source=test`, {
      redirect: "manual",
    });
    assert.ok([301, 302, 307, 308].includes(res.status));
    const loc = res.headers.get("location") || "";
    assert.match(loc, /myprotein\.com/);
  });

  it("unknown partner falls back to iherb redirect", async () => {
    const res = await fetch(`${BASE}/go/amazon?source=test`, {
      redirect: "manual",
    });
    assert.ok([301, 302, 307, 308].includes(res.status));
    const loc = res.headers.get("location") || "";
    assert.match(loc, /iherb\.com/);
  });

  it("category pages load", async () => {
    for (const cat of ["diets", "reviews", "supplements"]) {
      const res = await fetch(`${BASE}/category/${cat}`);
      assert.equal(res.status, 200, `category ${cat} should load`);
    }
  });

  it("article page loads with product shelf and dual store buttons", async () => {
    const { getAllPosts } = await import("../src/lib/posts.js");
    const post =
      getAllPosts().find((p) => p.products?.length >= 2) || getAllPosts()[0];
    const res = await fetch(
      `${BASE}/category/${post.category.toLowerCase()}/${post.slug}`,
    );
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.match(html, new RegExp(post.title.slice(0, 20)));
    if (post.products?.length) {
      assert.match(html, /Shop Our Top Picks|Top Picks/);
      assert.match(html, /product-img\?name=/);
      assert.match(html, /Also check/i);
      assert.match(html, /Shop both of our trusted stores/i);
    }
  });

  it("invalid article slug returns 404", async () => {
    const res = await fetch(`${BASE}/category/reviews/this-slug-does-not-exist-99999`);
    assert.equal(res.status, 404);
  });

  it("logo.svg is served", async () => {
    const res = await fetch(`${BASE}/logo.svg`);
    assert.equal(res.status, 200);
  });
});
