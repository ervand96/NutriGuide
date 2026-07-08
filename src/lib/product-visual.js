/** Visual helpers for product shelf cards (no real product images required) */

const BRAND_EMOJI = [
  { match: /protein|whey|creatine|myprotein/i, emoji: "🥤", bg: "from-sky-50 to-blue-100" },
  { match: /omega|fish oil|dha|epa/i, emoji: "🐟", bg: "from-cyan-50 to-teal-100" },
  { match: /magnesium|zinc|vitamin|b12|multivitamin|mineral/i, emoji: "💊", bg: "from-violet-50 to-purple-100" },
  { match: /ashwagandha|adaptogen|herb|mct|oil/i, emoji: "🌿", bg: "from-green-50 to-emerald-100" },
  { match: /electrolyte|hydration|sodium/i, emoji: "⚡", bg: "from-amber-50 to-yellow-100" },
  { match: /probiotic|fiber|psyllium/i, emoji: "🧬", bg: "from-lime-50 to-green-100" },
  { match: /melatonin|sleep|calm/i, emoji: "😴", bg: "from-indigo-50 to-blue-100" },
  { match: /pre-workout|bcaa|sport/i, emoji: "💪", bg: "from-orange-50 to-red-100" },
];

export function productBrand(name = "") {
  const part = name.split(",")[0]?.trim();
  return part || name.slice(0, 24);
}

export function productShortName(name = "") {
  const parts = name.split(",").map((s) => s.trim());
  if (parts.length <= 2) return name;
  return parts.slice(0, 2).join(", ");
}

export function productVisual(name = "") {
  for (const row of BRAND_EMOJI) {
    if (row.match.test(name)) return row;
  }
  return { emoji: "💊", bg: "from-gray-50 to-slate-100" };
}

export function reviewCountFromProduct(product) {
  const text = [
    product.description,
    ...(product.pros || []),
    ...(product.cons || []),
  ].join(" ");
  const m = text.match(/([\d,]+)\+?\s*(?:customer\s*)?reviews?/i);
  if (m) return m[1].replace(/,/g, "");
  const base = Math.round((product.rating || 4.5) * 1100 + (product.rank || 1) * 420);
  return String(Math.round(base / 100) * 100);
}

export function soldHintFromProduct(product) {
  const text = product.description || "";
  const sold = text.match(/([\d,]+)\+\s*sold/i);
  if (sold) return `${sold[1]}+ sold recently`;
  const reviews = Number(reviewCountFromProduct(product));
  if (reviews > 5000) return "Top seller on iHerb";
  if (reviews > 1000) return "Popular pick this month";
  return "Editor's choice";
}

export function starsDisplay(rating = 0) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return {
    full,
    half,
    empty: 5 - full - (half ? 1 : 0),
  };
}
