import fs from "fs";
import path from "path";
import { getAllPosts } from "../src/lib/posts";

const BOARD = process.env.PINTEREST_BOARD || "Nutrition Guides";
const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.nutriguide.com";

interface PinItem {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  board: string;
  tags: string[];
}

function buildPinPayload(): PinItem[] {
  return getAllPosts()
    .slice(0, 12)
    .map((post) => ({
      title: post.title,
      description: post.description,
      url: `${BASE_URL}/category/${post.category.toLowerCase()}/${post.slug}`,
      imageUrl: `${BASE_URL}/og/${post.slug}`,
      board: BOARD,
      tags: [post.category.toLowerCase(), "nutrition", "wellness"],
    }));
}

function schedulePins() {
  const payload = buildPinPayload();
  const outputPath = path.join(
    process.cwd(),
    "scripts",
    "pinterest-payload.json",
  );

  fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2));

  console.log(
    `Generated ${payload.length} Pinterest pin payloads at ${outputPath}`,
  );
  console.log(
    payload
      .map((pin) => `- ${pin.title} | ${pin.board} | ${pin.url}`)
      .join("\n"),
  );
}

schedulePins();
