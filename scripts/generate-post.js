import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const topic = "Best Protein Powder for Weight Loss";

function safe(str = "") {
  return JSON.stringify(String(str)); // 🔥 ключевой фикс
}

async function run() {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `
Create an SEO blog article.

Return format EXACTLY:

TITLE: ...
DESCRIPTION: ...
CATEGORY: Supplements
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

  const title = text.match(/TITLE:\s*(.*)/)?.[1] || topic;
  const description = text.match(/DESCRIPTION:\s*(.*)/)?.[1] || "";
  const category = text.match(/CATEGORY:\s*(.*)/)?.[1] || "Diets";
  const readTime = text.match(/READTIME:\s*(.*)/)?.[1] || "5 min read";

  const content = text.split("CONTENT:")[1] || "";

  const slug = topic.toLowerCase().replaceAll(" ", "-");

  // ─────────────────────────────
  // FIXED YAML (IMPORTANT PART)
  // ─────────────────────────────
  const md = [
    "---",
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description)}`,
    `category: ${JSON.stringify(category)}`,
    `date: ${new Date().toISOString().split("T")[0]}`,
    `readTime: ${JSON.stringify(readTime)}`,
    "---",
    "",
    content,
  ].join("\n");

  const filePath = path.join(process.cwd(), "src/content/posts", `${slug}.md`);

  fs.writeFileSync(filePath, md);

  console.log("✅ POST CREATED:", slug);
}

run();
