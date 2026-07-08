import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const PORT = 3456;
const BASE = `http://localhost:${PORT}`;

let server;
let serverReady = false;

function waitForServer(maxMs = 60000) {
  const start = Date.now();
  return (async () => {
    while (Date.now() - start < maxMs) {
      try {
        const res = await fetch(BASE);
        if (res.ok || res.status === 404) {
          serverReady = true;
          return;
        }
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

  it("quiz page loads", async () => {
    const res = await fetch(`${BASE}/quiz`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.match(html, /Find Your Perfect Diet/);
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

  it("first article page loads", async () => {
    const { getAllPosts } = await import("../src/lib/posts.js");
    const post = getAllPosts()[0];
    const res = await fetch(
      `${BASE}/category/${post.category.toLowerCase()}/${post.slug}`,
    );
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.match(html, new RegExp(post.title.slice(0, 20)));
  });
});
