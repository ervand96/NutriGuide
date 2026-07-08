import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { generateArticle } from "./lib/ai-agent.js";

dotenv.config();

const memory = JSON.parse(
  fs.readFileSync(new URL("./memory.json", import.meta.url), "utf8"),
);

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

function safe(str = "") {
  return String(str).replace(/"/g, "'").replace(/\n/g, " ").trim();
}

async function generatePost(category) {
  const categorySlug = CATEGORY_DIR[category];
  const slugBase = `${categorySlug}-${Date.now().toString().slice(-5)}`;

  console.log(`\n📝 Agent writing ${category}...`);

  const { title, description, readTime, content, products } =
    await generateArticle({ category, slugHint: slugBase });

  if (!title || isDuplicateTopic(title)) {
    console.log("⛔ SKIPPED DUPLICATE/EMPTY TOPIC:", title);
    return;
  }

  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const slug = `${baseSlug}-${Date.now().toString().slice(-5)}`;

  const featured = Math.random() < 0.25;
  const dir = path.join(process.cwd(), "src/content/posts", categorySlug);
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, `${slug}.md`);

  const md = `---
title: "${safe(title)}"
description: "${safe(description)}"
category: "${category}"
featured: ${featured}
date: "${new Date().toISOString().split("T")[0]}"
readTime: "${safe(readTime)}"
products: ${JSON.stringify(products)}
---

${content}
`;

  fs.writeFileSync(filePath, md);
  memory.topics.push(title);
  fs.writeFileSync("./scripts/memory.json", JSON.stringify(memory, null, 2));

  console.log(
    "✅ CREATED:",
    `${categorySlug}/${slug}`,
    `(${products.length} products, ${content.split(/\s+/).length} words)`,
  );
}

async function run() {
  if (!process.env.CURSOR_API_KEY) {
    console.error(
      "❌ Set CURSOR_API_KEY in .env — get it at https://cursor.com/dashboard/integrations",
    );
    process.exit(1);
  }

  const only = process.argv[2];
  const batch = only
    ? categories.filter((c) => c.toLowerCase() === only.toLowerCase())
    : categories;

  if (only && batch.length === 0) {
    console.error(`Unknown category "${only}". Use: Diets, Reviews, Supplements`);
    process.exit(1);
  }

  console.log("🚀 NutriGuide content agent (Cursor SDK / Composer)\n");

  for (const category of batch) {
    await generatePost(category);
    await new Promise((r) => setTimeout(r, 3000));
  }

  console.log("\n🔥 DONE");
}

run().catch((err) => {
  console.error("❌", err.message);
  process.exit(1);
});
