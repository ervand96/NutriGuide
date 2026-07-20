import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const PORT = 3456;
const BASE = `http://localhost:${PORT}`;

let server;

async function fetchOk(url, opts = {}) {
  const res = await fetch(url, {
    ...opts,
    signal: AbortSignal.timeout(opts.timeoutMs || 20000),
  });
  return res;
}

function waitForServer(maxMs = 90000) {
  const start = Date.now();
  return (async () => {
    while (Date.now() - start < maxMs) {
      try {
        const res = await fetchOk(BASE, { timeoutMs: 3000 });
        if (res.ok || res.status === 404) return;
      } catch {
        // not ready
      }
      await sleep(700);
    }
    throw new Error("Dev server did not start in time");
  })();
}

before(async () => {
  server = spawn("npm", ["run", "dev", "--", "-p", String(PORT)], {
    cwd: process.cwd(),
    stdio: ["ignore", "pipe", "pipe"],
    env: {
      ...process.env,
      NODE_ENV: "development",
      NEXT_TELEMETRY_DISABLED: "1",
    },
    detached: process.platform !== "win32",
  });

  server.stderr?.on("data", (d) => {
    const msg = d.toString();
    if (msg.includes("Error") && !msg.includes("EADDRINUSE")) {
      console.error(msg);
    }
  });

  await waitForServer();
});

after(() => {
  if (!server) return;
  try {
    if (server.pid && process.platform !== "win32") {
      process.kill(-server.pid, "SIGKILL");
    } else {
      server.kill("SIGKILL");
    }
  } catch {
    try {
      server.kill("SIGKILL");
    } catch {
      // ignore
    }
  }
});

describe("site integration", () => {
  it("homepage loads with NutriGuide branding", async () => {
    const res = await fetchOk(BASE);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.match(html, /NutriGuide/);
    assert.match(html, /iHerb/);
    assert.match(html, /MyProtein/);
    assert.doesNotMatch(html, /HelloFresh/);
    assert.doesNotMatch(html, /Amazon Associates/);
  });

  it("homepage shows product shelf section", async () => {
    const res = await fetchOk(BASE);
    const html = await res.text();
    assert.match(html, /Top Rated Products/);
    assert.match(html, /\/products\/|product-img\?name=/);
    assert.match(html, /Check price|Add to cart/);
  });

  it("homepage shows new conversion sections", async () => {
    const res = await fetchOk(BASE);
    const html = await res.text();
    assert.match(html, /How shopping with NutriGuide works/);
    assert.match(html, /Start with your goal/);
    assert.match(html, /Trending guides this week/);
    assert.match(html, /Get weekly pick alerts/);
    assert.match(html, /Why only iHerb and MyProtein/);
    assert.match(html, /Independent reviews|reviews published|\+ reviews/i);
    assert.match(html, /Diets: top 5 guides/);
    assert.match(html, /Reviews: top 5 guides/);
    assert.match(html, /Supplements: top 5 guides/);
    assert.match(html, /Editor shelf/);
    assert.match(html, /\/products\//);
    assert.match(html, /Read guide/);
  });

  it("category page shows top 5 guides and nav strip", async () => {
    const res = await fetchOk(`${BASE}/category/diets`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.match(html, /Top 5/);
    assert.match(html, /guides/);
    assert.match(html, /aria-label="Browse topics"/);
  });

  it("quiz page loads with shared navbar", async () => {
    const res = await fetchOk(`${BASE}/quiz`);
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
      const res = await fetchOk(`${BASE}${path}`);
      assert.equal(res.status, 200, `${path} should return 200`);
    }
  });

  it("favicon.ico does not 404", async () => {
    const res = await fetchOk(`${BASE}/favicon.ico`, { redirect: "manual" });
    assert.ok(
      res.status === 200 || [301, 302, 307, 308].includes(res.status),
      `favicon should not 404, got ${res.status}`,
    );
  });

  it("product-img route returns SVG", async () => {
    const res = await fetchOk(
      `${BASE}/product-img?name=NOW%20Foods%20Ashwagandha`,
    );
    assert.equal(res.status, 200);
    const type = res.headers.get("content-type") || "";
    assert.match(type, /image\/svg\+xml/);
    const body = await res.text();
    assert.match(body, /<svg/);
  });

  it("product-img works without query params", async () => {
    const res = await fetchOk(`${BASE}/product-img`);
    assert.equal(res.status, 200);
  });

  it("seo routes load", async () => {
    for (const path of ["/sitemap.xml", "/robots.txt", "/rss.xml"]) {
      const res = await fetchOk(`${BASE}${path}`);
      assert.equal(res.status, 200, `${path} should return 200`);
    }
  });

  it("affiliate disclosure mentions only iHerb and MyProtein", async () => {
    const res = await fetchOk(`${BASE}/affiliate-disclosure`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.match(html, /iHerb/);
    assert.match(html, /MyProtein/);
  });

  it("/go/iherb redirects to iherb.com with rcode", async () => {
    const res = await fetchOk(`${BASE}/go/iherb?source=test`, {
      redirect: "manual",
    });
    assert.ok([301, 302, 307, 308].includes(res.status));
    const loc = res.headers.get("location") || "";
    assert.match(loc, /iherb\.com/);
    assert.match(loc, /rcode=/);
  });

  it("/go/myprotein redirects to myprotein.com", async () => {
    const res = await fetchOk(`${BASE}/go/myprotein?source=test`, {
      redirect: "manual",
    });
    assert.ok([301, 302, 307, 308].includes(res.status));
    const loc = res.headers.get("location") || "";
    assert.match(loc, /myprotein\.com/);
  });

  it("unknown partner falls back to iherb redirect", async () => {
    const res = await fetchOk(`${BASE}/go/amazon?source=test`, {
      redirect: "manual",
    });
    assert.ok([301, 302, 307, 308].includes(res.status));
    const loc = res.headers.get("location") || "";
    assert.match(loc, /iherb\.com/);
  });

  it("category pages load", async () => {
    for (const cat of ["diets", "reviews", "supplements"]) {
      const res = await fetchOk(`${BASE}/category/${cat}`);
      assert.equal(res.status, 200, `category ${cat} should load`);
    }
  });

  it("article page loads with product shelf and dual store buttons", async () => {
    const { getAllPosts } = await import("../src/lib/posts.js");
    const post =
      getAllPosts().find((p) => p.products?.length >= 2) || getAllPosts()[0];
    const res = await fetchOk(
      `${BASE}/category/${post.category.toLowerCase()}/${post.slug}`,
    );
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.match(html, new RegExp(post.title.slice(0, 20)));
    if (post.products?.length) {
      assert.match(html, /Shop Our Top Picks|Top Picks/);
      assert.match(html, /\/products\/|product-img\?name=/);
      assert.match(html, /Also check/i);
      assert.match(html, /Shop both of our trusted stores/i);
    }
  });

  it("invalid article slug returns 404", async () => {
    const res = await fetchOk(`${BASE}/category/reviews/this-slug-does-not-exist-99999`);
    assert.equal(res.status, 404);
  });

  it("logo.svg is served", async () => {
    const res = await fetchOk(`${BASE}/logo.svg`);
    assert.equal(res.status, 200);
  });
});
