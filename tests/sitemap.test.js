import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("sitemap for Google Search Console", () => {
  it("generates backup sitemaps and clears conflicting public root XML", () => {
    const result = spawnSync("node", ["scripts/generate-sitemap.js"], {
      cwd: root,
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stderr || result.stdout);

    // Root public XML must stay absent so App Router handlers win (no Content-Disposition)
    assert.equal(existsSync(join(root, "public", "sitemap.xml")), false);
    assert.equal(existsSync(join(root, "public", "sitemap_index.xml")), false);

    const xml = readFileSync(
      join(root, "public", "sitemaps", "pages.xml"),
      "utf8",
    );
    assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
    assert.match(
      xml,
      /xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/,
    );
    assert.doesNotMatch(xml, /changefreq|priority/);
    assert.doesNotMatch(xml, /T\d{2}:\d{2}:\d{2}/);
    assert.match(xml, /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
    assert.match(xml, /\/best-picks/);
    assert.match(xml, /\/quiz/);
    assert.match(xml, /\/promo-codes/);
    assert.ok((xml.match(/<url>/g) || []).length >= 10);

    const indexXml = readFileSync(
      join(root, "public", "sitemaps", "sitemap_index.xml"),
      "utf8",
    );
    assert.match(indexXml, /<sitemapindex /);
    assert.match(indexXml, /\/gsc-sitemap/);
    // Single child only — duplicate urlsets break GSC processing
    assert.equal((indexXml.match(/<sitemap>/g) || []).length, 1);
    assert.doesNotMatch(indexXml, /\/sitemaps\/pages\.xml/);
    assert.doesNotMatch(indexXml, /\/feed\/sitemap\.xml/);
  });
});
