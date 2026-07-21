import fs from "fs";
import path from "path";

const CLICKS_KEY = "nutriguide:affiliate-clicks";
const LOCAL_FILE = path.join(process.cwd(), "src", "data", "affiliate-clicks.json");

async function writeToKv(entry) {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return false;
  }
  try {
    const { kv } = await import("@vercel/kv");
    await kv.lpush(CLICKS_KEY, JSON.stringify(entry));
    await kv.ltrim(CLICKS_KEY, 0, 4999);
    return true;
  } catch (err) {
    console.error("[affiliate-click] KV error:", err?.message || err);
    return false;
  }
}

function writeToLocalFile(entry) {
  try {
    fs.mkdirSync(path.dirname(LOCAL_FILE), { recursive: true });
    let clicks = [];
    if (fs.existsSync(LOCAL_FILE)) {
      clicks = JSON.parse(fs.readFileSync(LOCAL_FILE, "utf8"));
    }
    clicks.push(entry);
    fs.writeFileSync(LOCAL_FILE, JSON.stringify(clicks, null, 2));
    return true;
  } catch (err) {
    console.error("[affiliate-click] file error:", err?.message || err);
    return false;
  }
}

/** Persist affiliate click — KV on Vercel, file locally, always log for Vercel Log Drain. */
export async function recordAffiliateClick(partner, source) {
  const entry = {
    partner,
    source,
    time: new Date().toISOString(),
  };

  console.log(JSON.stringify({ event: "affiliate_click", ...entry }));

  if (process.env.VERCEL) {
    await writeToKv(entry);
  } else {
    writeToLocalFile(entry);
  }

  return entry;
}

export async function recordQuizLead(email, diet, meta = {}) {
  const entry = {
    email: email.toLowerCase().trim(),
    diet,
    source: meta.source || diet || "",
    quiz_goal: meta.quiz_goal || "",
    recommended_product: meta.recommended_product || "",
    time: new Date().toISOString(),
  };

  console.log(JSON.stringify({ event: "quiz_lead", ...entry }));

  if (process.env.KV_REST_API_URL) {
    try {
      const { kv } = await import("@vercel/kv");
      await kv.lpush("nutriguide:quiz-leads", JSON.stringify(entry));
    } catch (err) {
      console.error("[quiz-lead] KV error:", err?.message || err);
    }
  } else if (!process.env.VERCEL) {
    const leadsFile = path.join(process.cwd(), "src", "data", "quiz-leads.json");
    try {
      fs.mkdirSync(path.dirname(leadsFile), { recursive: true });
      let leads = [];
      if (fs.existsSync(leadsFile)) leads = JSON.parse(fs.readFileSync(leadsFile, "utf8"));
      leads.push(entry);
      fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2));
    } catch {}
  }

  return entry;
}
