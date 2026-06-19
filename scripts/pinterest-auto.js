#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  "https://nutri-guide-indol.vercel.app";
const BOARD_ID = process.env.PINTEREST_BOARD_ID || "";
const BOARD_NAME = process.env.PINTEREST_BOARD || "Nutrition Guides";
const ACCESS_TOKEN = process.env.PINTEREST_ACCESS_TOKEN || "";
const POST_INTERVAL_MS = Number(process.env.PINTEREST_POST_INTERVAL_MS || 3000);
const DRY_RUN = process.env.PINTEREST_DRY_RUN !== "false";

const contentRoot = path.join(process.cwd(), "src", "content", "posts");

function getAllMarkdownFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      getAllMarkdownFiles(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

function loadPosts() {
  const files = getAllMarkdownFiles(contentRoot);

  return files
    .map((filePath) => {
      const raw = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(raw);
      const slug = path.basename(filePath, ".md");
      const category = data.category || path.basename(path.dirname(filePath));

      return {
        slug,
        category,
        title: data.title || slug,
        description:
          data.description || content.slice(0, 160).replace(/\s+/g, " ").trim(),
        date: data.date || new Date().toISOString(),
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function buildPinPayload(post) {
  const categoryPath = String(post.category || "diets").toLowerCase();

  return {
    title: post.title,
    description: post.description,
    link: `${BASE_URL}/category/${categoryPath}/${post.slug}`,
    image_url: `${BASE_URL}/og/${post.slug}`,
    board_name: BOARD_NAME,
    board_id: BOARD_ID,
    tags: [categoryPath, "nutrition", "wellness"],
  };
}

async function postToPinterest(pin) {
  if (!ACCESS_TOKEN) {
    console.warn("No Pinterest access token found. Skipping actual post.");
    return { skipped: true };
  }

  const body = {
    title: pin.title,
    description: pin.description,
    board_id: pin.board_id || undefined,
    board_name: pin.board_name || undefined,
    link: pin.link,
    media_source: {
      source_type: "image_url",
      url: pin.image_url,
    },
  };

  const response = await fetch("https://api.pinterest.com/v5/pins", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      `Pinterest API error ${response.status}: ${JSON.stringify(data)}`,
    );
  }

  return data;
}

async function run() {
  const posts = loadPosts().slice(0, 12);
  const payload = posts.map(buildPinPayload);

  const outputPath = path.join(
    process.cwd(),
    "scripts",
    "pinterest-payload.json",
  );
  fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2));

  console.log(
    `Generated ${payload.length} Pinterest payloads in ${outputPath}`,
  );

  if (DRY_RUN) {
    console.log("Dry run enabled. No posts were submitted to Pinterest.");
    for (const pin of payload) {
      console.log(`- ${pin.title} -> ${pin.link}`);
    }
    return;
  }

  for (const [index, pin] of payload.entries()) {
    console.log(`Posting ${index + 1}/${payload.length}: ${pin.title}`);
    await postToPinterest(pin);

    if (index < payload.length - 1) {
      console.log(`Waiting ${POST_INTERVAL_MS}ms before next pin...`);
      await new Promise((resolve) => setTimeout(resolve, POST_INTERVAL_MS));
    }
  }

  console.log("Pinterest automation run completed.");
}

run().catch((error) => {
  console.error("Pinterest automation failed:", error);
  process.exitCode = 1;
});
