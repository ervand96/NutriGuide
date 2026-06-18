import memory from "./memory.json" assert { type: "json" };
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

const categories = ["Diets", "Reviews", "Supplements"];

function isDuplicateTopic(title) {
  return memory.topics.some((t) =>
    t.toLowerCase().includes(title.toLowerCase().slice(0, 20)),
  );
}

memory.topics.push(title);

fs.writeFileSync("./scripts/memory.json", JSON.stringify(memory, null, 2));

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
// GENERATE ONE POST
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
Create an SEO blog article.

Category is FIXED: ${category}

IMPORTANT:
- Return clean markdown-safe text
- No quotes in TITLE or DESCRIPTION

Return format EXACTLY:

TITLE: ...
DESCRIPTION: ...
READTIME: 5 min read

CONTENT:
(write full article in markdown)
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

  if (isDuplicateTopic(title)) {
    console.log("⛔ SKIPPED DUPLICATE TOPIC:", title);
    return;
  }
  const description = safe(text.match(/DESCRIPTION:\s*(.*)/)?.[1]);
  const readTime = safe(text.match(/READTIME:\s*(.*)/)?.[1] || "5 min read");
  const content = text.split("CONTENT:")[1] || "";

  const categorySlug = category.toLowerCase();

  // ─────────────────────────────
  // UNIQUE SLUG (ANTI DUPLICATE FIX)
  // ─────────────────────────────
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const slug = `${baseSlug}-${Date.now().toString().slice(-5)}`;

  // ─────────────────────────────
  // FEATURED (AUTO 25%)
  // ─────────────────────────────
  const featured = Math.random() < 0.25;

  // ─────────────────────────────
  // FILE PATH (FLAT SYSTEM)
  // ─────────────────────────────
  const filePath = path.join(process.cwd(), "src/content/posts", `${slug}.md`);

  // ─────────────────────────────
  // MARKDOWN
  // ─────────────────────────────
  const md = `---
title: "${title}"
description: "${description}"
category: "${category}"
featured: ${featured}
date: "${new Date().toISOString().split("T")[0]}"
readTime: "${readTime}"
---

${content}
`;

  fs.writeFileSync(filePath, md);
 memory.topics.push(title);

fs.writeFileSync(
  "./scripts/memory.json",
  JSON.stringify(memory, null, 2)
);

  console.log("✅ CREATED:", `${categorySlug}/${slug}`);
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

  console.log("\n🔥 DONE: 3 POSTS GENERATED");
}

run();
