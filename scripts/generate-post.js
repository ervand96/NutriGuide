import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const memory = JSON.parse(
  fs.readFileSync(new URL("./memory.json", import.meta.url), "utf8"),
);

const API_KEY = process.env.GEMINI_API_KEY;

// Категория -> папка в src/content/posts (ИСПРАВЛЕНО: раньше статьи
// писались плоско в src/content/posts/*.md, а сайт читает их только
// из src/content/posts/diets|reviews|supplements/*.md — посты не были
// видны на сайте).
const CATEGORY_DIR = {
  Diets: "diets",
  Reviews: "reviews",
  Supplements: "supplements",
};
const categories = Object.keys(CATEGORY_DIR);

function isDuplicateTopic(title) {
  return memory.topics.some((t) =>
    t.toLowerCase().includes(title.toLowerCase().slice(0, 20)),
  );
}

// ─────────────────────────────
// SAFE
// ─────────────────────────────
function safe(str = "") {
  return String(str).replace(/"/g, "'").replace(/\n/g, " ").trim();
}

// ─────────────────────────────
// FETCH WITH RETRY
// ─────────────────────────────
async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(url, options);

    if (res.ok) return res;

    const error = await res.json();
    console.log("TRY", i + 1, "FAILED:", error?.error?.message);

    if (error?.error?.code === 503 || error?.error?.code === 429) {
      await new Promise((r) => setTimeout(r, 3000));
      continue;
    }

    throw new Error(JSON.stringify(error));
  }

  throw new Error("FAILED AFTER RETRIES");
}

// ─────────────────────────────
// GENERATE ONE POST (+ PRODUCTS for affiliate monetization)
// ─────────────────────────────
async function generatePost(category) {
  const res = await fetchWithRetry(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `
Create an SEO blog article for an affiliate nutrition website.

Category is FIXED: ${category}

IMPORTANT:
- Return clean markdown-safe text
- No quotes in TITLE or DESCRIPTION
- PRODUCTS_JSON must be a single-line valid JSON array of 3 objects,
  each shaped exactly like this (no extra commentary, no markdown fences):
  {"rank":1,"name":"Product Name","badge":"Best Overall","rating":4.7,
   "price":"$24.99","description":"1-2 sentence summary",
   "pros":["pro1","pro2","pro3"],"cons":["con1","con2"],
   "buttonText":"Check Price on iHerb","highlight":true}
- Only mention real, plausible supplement/product names relevant to
  the category (do not invent fake brand claims).

Return format EXACTLY:

TITLE: ...
DESCRIPTION: ...
READTIME: 5 min read
PRODUCTS_JSON: [...]

CONTENT:
(write full article in markdown, at least 600 words)
                `,
              },
            ],
          },
        ],
      }),
    },
  );

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    console.log("ERROR:", JSON.stringify(data, null, 2));
    return;
  }

  // ─────────────────────────────
  // PARSE
  // ─────────────────────────────
  const title = safe(text.match(/TITLE:\s*(.*)/)?.[1]);

  if (!title || isDuplicateTopic(title)) {
    console.log("⛔ SKIPPED DUPLICATE/EMPTY TOPIC:", title);
    return;
  }

  const description = safe(text.match(/DESCRIPTION:\s*(.*)/)?.[1]);
  const readTime = safe(text.match(/READTIME:\s*(.*)/)?.[1] || "5 min read");
  const productsRaw = text.match(/PRODUCTS_JSON:\s*(\[[\s\S]*?\])\s*\n/)?.[1];
  const content = text.split("CONTENT:")[1]?.trim() || "";

  const categorySlug = CATEGORY_DIR[category];

  // ─────────────────────────────
  // UNIQUE SLUG (ANTI DUPLICATE FIX)
  // ─────────────────────────────
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const slug = `${baseSlug}-${Date.now().toString().slice(-5)}`;

  // ─────────────────────────────
  // PRODUCTS -> affiliate links через /go/iherb (наш редирект,
  // который ставит rcode + 30-дневный first-party cookie)
  // ─────────────────────────────
  let products = [];
  try {
    const parsed = productsRaw ? JSON.parse(productsRaw) : [];
    products = parsed.map((p, i) => ({
      ...p,
      rank: p.rank ?? i + 1,
      affiliateUrl: `/go/iherb?source=${slug}&q=${encodeURIComponent(p.name || "")}`,
    }));
  } catch (e) {
    console.log(
      "⚠️ Could not parse PRODUCTS_JSON, skipping products:",
      e.message,
    );
  }

  // ─────────────────────────────
  // FEATURED (AUTO 25%)
  // ─────────────────────────────
  const featured = Math.random() < 0.25;

  // ─────────────────────────────
  // FILE PATH (ИСПРАВЛЕНО: пишем в правильную подпапку категории)
  // ─────────────────────────────
  const dir = path.join(process.cwd(), "src/content/posts", categorySlug);
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, `${slug}.md`);

  // ─────────────────────────────
  // MARKDOWN (frontmatter + products + content)
  // ─────────────────────────────
  const md = `---
title: "${title}"
description: "${description}"
category: "${category}"
featured: ${featured}
date: "${new Date().toISOString().split("T")[0]}"
readTime: "${readTime}"
products: ${JSON.stringify(products)}
---

${content}
`;

  fs.writeFileSync(filePath, md);

  // ИСПРАВЛЕНО: раньше memory.topics.push(title) вызывался ДО объявления
  // title (на уровне модуля) — скрипт падал с ReferenceError при импорте.
  memory.topics.push(title);
  fs.writeFileSync("./scripts/memory.json", JSON.stringify(memory, null, 2));

  console.log(
    "✅ CREATED:",
    `${categorySlug}/${slug}`,
    `(${products.length} products)`,
  );
}

// ─────────────────────────────
// MAIN (3 POSTS AT ONCE)
// ─────────────────────────────
async function run() {
  console.log("🚀 Starting batch generation...\n");

  for (const category of categories) {
    await generatePost(category);
    await new Promise((r) => setTimeout(r, 4000));
  }

  console.log("\n🔥 DONE: POSTS GENERATED");
}

run();
