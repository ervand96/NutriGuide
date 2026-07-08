#!/usr/bin/env node
/**
 * Reddit promotion helper — prints ready posts and opens submit pages.
 * You must be logged into Reddit in your browser first.
 *
 * Usage:
 *   node scripts/reddit-publish.js          # list all posts
 *   node scripts/reddit-publish.js keto-guide # open submit for one post
 *   node scripts/reddit-publish.js --all      # open all (one tab each)
 */

import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const posts = JSON.parse(
  readFileSync(join(__dirname, "reddit-posts.json"), "utf8"),
);

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://nutri-guide-indol.vercel.app";

function submitUrl(subreddit, title, url) {
  const params = new URLSearchParams({ title, url });
  return `https://www.reddit.com/r/${subreddit}/submit?${params.toString()}`;
}

function openInBrowser(url) {
  try {
    execSync(`open "${url}"`, { stdio: "ignore" });
  } catch {
    console.log("Open manually:", url);
  }
}

function printPost(p, i) {
  console.log(`\n--- [${i + 1}] ${p.id} → r/${p.subreddit} ---`);
  console.log("Title:", p.title);
  console.log("Link:", p.url.replace("nutri-guide-indol.vercel.app", new URL(siteUrl).host));
  console.log("\nBody (paste as comment if link post, or use for text post):\n");
  console.log(p.body);
  console.log("\nSubmit URL:", submitUrl(p.subreddit, p.title, p.url));
}

const arg = process.argv[2];

if (!arg) {
  console.log("NutriGuide Reddit Posts — pick one to publish:\n");
  posts.forEach((p, i) => {
    console.log(`  ${i + 1}. [${p.id}] r/${p.subreddit}`);
    console.log(`     ${p.title.slice(0, 70)}…`);
  });
  console.log("\nRun: npm run reddit:post -- <id>");
  console.log("Example: npm run reddit:post -- keto-guide");
  process.exit(0);
}

if (arg === "--all") {
  console.log(`Opening ${posts.length} Reddit submit tabs…`);
  posts.forEach((p) => {
    openInBrowser(submitUrl(p.subreddit, p.title, p.url));
  });
  posts.forEach(printPost);
  process.exit(0);
}

const post = posts.find((p) => p.id === arg);
if (!post) {
  console.error(`Unknown post id: ${arg}`);
  console.error("Available:", posts.map((p) => p.id).join(", "));
  process.exit(1);
}

printPost(post, 0);
console.log("\n→ Opening Reddit submit page in browser…");
openInBrowser(submitUrl(post.subreddit, post.title, post.url));
console.log("\nTips:");
console.log("  • Post as LINK (url field pre-filled)");
console.log("  • Add the body text as your first comment for context");
console.log("  • Read subreddit rules before posting — some limit self-promo");
console.log("  • Space posts 2–3 days apart, don't spam");
