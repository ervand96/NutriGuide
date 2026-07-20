import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("static sitemap for Google Search Console", () => {
  it("generates a minimal Google-safe sitemap.xml", () => {
    const result = spawnSync("node", ["scripts/generate-sitemap.js"], {
      cwd: root,
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stderr || result.stdout);

    const xml = readFileSync(join(root, "public", "sitemap.xml"), "utf8");
    assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
    assert.match(
      xml,
      /xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/,
    );
    assert.doesNotMatch(xml, /changefreq|priority/);
    assert.doesNotMatch(xml, /T\d{2}:\d{2}:\d{2}/); // no time portion
    assert.match(xml, /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
    assert.match(xml, /\/best-picks/);
    assert.match(xml, /\/quiz/);
    assert.ok((xml.match(/<url>/g) || []).length >= 10);

    const txt = readFileSync(join(root, "public", "sitemap.txt"), "utf8");
    assert.match(txt, /^https:\/\//m);
    assert.match(txt, /\/best-picks/);
    assert.ok(txt.trim().split("\n").length >= 10);
  });
});
