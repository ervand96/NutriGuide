import { Agent, CursorAgentError } from "@cursor/sdk";
import {
  partnerForProduct,
  buttonTextForPartner,
} from "../../src/lib/affiliate.js";

const SYSTEM = `You are NutriGuide's SEO content writer for an affiliate nutrition website.
Write in clear English. Use markdown for article body. No quotes in titles.
Only recommend products available on iHerb or MyProtein. Be factual, not hypey.
Return ONLY what is asked — no preamble, no "Sure!", no markdown fences unless requested.`;

function getApiKey() {
  const key = process.env.CURSOR_API_KEY?.trim();
  if (!key) {
    throw new Error(
      "CURSOR_API_KEY is missing. Get it at https://cursor.com/dashboard/integrations and add to .env",
    );
  }
  return key;
}

function agentOptions() {
  return {
    apiKey: getApiKey(),
    model: { id: process.env.CURSOR_MODEL || "composer-2.5" },
    local: {
      cwd: process.cwd(),
      settingSources: [],
    },
  };
}

async function askCursor(userPrompt, retries = 2) {
  const fullPrompt = `${SYSTEM}\n\n---\n\n${userPrompt}`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await Agent.prompt(fullPrompt, agentOptions());

      if (result.status === "error") {
        throw new Error(`Cursor agent run failed (run id: ${result.id})`);
      }

      const text = result.result?.trim();
      if (text) return text;
      throw new Error("Cursor agent returned empty text");
    } catch (err) {
      const retryable =
        err instanceof CursorAgentError ? err.isRetryable : false;
      if (retryable && attempt < retries) {
        await new Promise((r) => setTimeout(r, (attempt + 1) * 5000));
        continue;
      }
      throw err;
    }
  }

  throw new Error("Cursor agent failed after retries");
}

function parseField(text, field) {
  const match = text.match(new RegExp(`${field}:\\s*(.+)`, "i"));
  return match?.[1]?.trim() || "";
}

/**
 * Multi-step NutriGuide content agent via Cursor SDK (Composer).
 * Four small agent calls — no Gemini/OpenAI API keys needed.
 */
export async function generateArticle({ category, slugHint = "article" }) {
  console.log("  → Cursor agent: metadata...");
  const metaRaw = await askCursor(
    `Category: ${category}
Return EXACTLY this format (one line each):
TITLE: (SEO title, 50-70 chars, no quotes)
DESCRIPTION: (meta description, 120-160 chars, no quotes)
READTIME: (e.g. 6 min read)`,
  );

  const title = parseField(metaRaw, "TITLE");
  const description = parseField(metaRaw, "DESCRIPTION");
  const readTime = parseField(metaRaw, "READTIME") || "6 min read";

  if (!title) throw new Error("Agent failed to generate title");

  console.log("  → Cursor agent: outline...");
  const outline = await askCursor(
    `Article title: ${title}
Category: ${category}
Write a 5-section outline (H2 headings only). One heading per line starting with ##.`,
  );

  const sections = outline
    .split("\n")
    .map((l) => l.replace(/^#+\s*/, "").trim())
    .filter(Boolean);

  const half = Math.max(1, Math.ceil(sections.length / 2));
  const firstHalf = sections.slice(0, half);
  const secondHalf = sections.slice(half);

  console.log("  → Cursor agent: article body (part 1)...");
  const part1 = await askCursor(
    `Write markdown for a nutrition blog article.
Title: ${title}
Category: ${category}
Sections to write (use ## for each): ${firstHalf.join("; ")}
Minimum 350 words total. Include practical tips. No product list yet.`,
  );

  await new Promise((r) => setTimeout(r, 2000));

  let part2 = "";
  if (secondHalf.length > 0) {
    console.log("  → Cursor agent: article body (part 2)...");
    part2 = await askCursor(
      `Continue the same article (do not repeat the title).
Title: ${title}
Sections to write (use ## for each): ${secondHalf.join("; ")}
Minimum 350 words. End with a brief conclusion paragraph.`,
    );
  }

  const content = [part1, part2].filter(Boolean).join("\n\n");

  await new Promise((r) => setTimeout(r, 2000));

  console.log("  → Cursor agent: product picks...");
  const productsRaw = await askCursor(
    `For article "${title}" (${category}), return ONLY a valid JSON array of 3 products.
Each object must have: rank, name, badge, rating (number), price (string like "$24.99"),
description, pros (array of 3 strings), cons (array of 2 strings), highlight (boolean).
Use real supplement/diet product names sold on iHerb or MyProtein.
No markdown fences, no commentary — raw JSON array only.`,
  );

  let products = [];
  try {
    const jsonMatch = productsRaw.match(/\[[\s\S]*\]/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : productsRaw);
    products = parsed.map((p, i) => {
      const partner = partnerForProduct(p.name || "", category);
      return {
        ...p,
        rank: p.rank ?? i + 1,
        buttonText: p.buttonText || buttonTextForPartner(partner),
        affiliateUrl: `/go/${partner}?source=${slugHint}&q=${encodeURIComponent(p.name || "")}`,
      };
    });
  } catch {
    products = [];
  }

  return { title, description, readTime, content, products };
}

export { partnerForProduct, buttonTextForPartner };
