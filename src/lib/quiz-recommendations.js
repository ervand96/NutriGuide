/**
 * Quiz answer → product recommendation mapping (no ML).
 */

import {
  discountShopLabel,
  parseGoLink,
} from "./affiliate.js";

export const QUIZ_STORAGE_KEY = "ng_quiz_plan_v1";

/** Canonical stack keys per goal (TZ B). Aliases normalize older share URLs. */
export const STACK_MAP = {
  stress: ["ashwagandha-ksm66", "magnesium-glycinate"],
  sleep: ["magnesium-glycinate", "ashwagandha-ksm66"],
  energy: ["vitamin-b12", "omega-3"],
  weight_loss: ["electrolytes", "mct-oil"],
  muscle: ["creatine", "whey-protein"],
  heart: ["omega-3", "magnesium-glycinate"],
};

const KEY_ALIASES = {
  ashwagandha: "ashwagandha-ksm66",
  "ashwagandha-ksm66": "ashwagandha-ksm66",
};

function normalizePickKey(key = "") {
  const k = String(key).trim().toLowerCase();
  if (KEY_ALIASES[k]) return KEY_ALIASES[k];
  return k;
}

const PICKS = {
  "magnesium-glycinate": {
    rank: 1,
    name: "NOW Foods, Magnesium Glycinate",
    badge: "Best for Sleep & Calm",
    rating: 4.8,
    price: "$22.36",
    description:
      "A well-tolerated chelated magnesium often used for evening calm and sleep routines.",
    pros: ["Gentle on the stomach", "Strong value on iHerb", "Easy daily habit"],
    cons: ["Capsule count varies by bottle size"],
    affiliateUrl:
      "/go/iherb?source=quiz-result&q=NOW%20Foods%20Magnesium%20Glycinate",
    highlight: true,
    imageUrl:
      "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/now/now01289/u/62.jpg",
  },
  "ashwagandha-ksm66": {
    rank: 2,
    name: "NOW Foods, KSM-66 Ashwagandha, 600 mg, 90 Veg Capsules",
    badge: "Best for Stress",
    rating: 4.7,
    price: "$22.24",
    description:
      "Standardized KSM-66 root extract commonly used for stress and wind-down routines.",
    pros: [
      "Clinically studied extract",
      "Clear 600 mg dose",
      "Vegetarian capsules",
    ],
    cons: ["May feel strong for first-time users"],
    affiliateUrl:
      "/go/iherb?source=quiz-result&q=NOW%20Foods%20KSM-66%20Ashwagandha",
    imageUrl: "/products/bottle-ashwagandha.jpg",
  },
  "vitamin-b12": {
    rank: 1,
    name: "NOW Foods, Methyl B-12, 1,000 mcg, 100 Lozenges",
    badge: "Best for Energy Support",
    rating: 4.8,
    price: "$8.88",
    description:
      "Methylcobalamin lozenges — a practical daily B12 option for energy and dietary gaps.",
    pros: ["Active B12 form", "Easy lozenge format", "Budget-friendly"],
    cons: ["Flavored lozenge may not suit everyone"],
    affiliateUrl: "/go/iherb?source=quiz-result&q=NOW%20Foods%20Methyl%20B-12",
    highlight: true,
    imageUrl: "/products/bottle-zinc.jpg",
  },
  "omega-3": {
    rank: 2,
    name: "Nordic Naturals, Ultimate Omega",
    badge: "Best Omega-3",
    rating: 4.8,
    price: "$39.99",
    description:
      "High-potency fish oil for heart, brain, and everyday recovery support.",
    pros: ["High EPA/DHA", "Trusted purity standards", "Easy softgels"],
    cons: ["Premium price per bottle"],
    affiliateUrl:
      "/go/iherb?source=quiz-result&q=Nordic%20Naturals%20Ultimate%20Omega",
    imageUrl: "/products/bottle-omega.jpg",
  },
  electrolytes: {
    rank: 1,
    name: "Liquid I.V., Hydration Multiplier, Electrolyte Drink Mix, Lemon Lime, 10 Stick Packs",
    badge: "Best Hydration",
    rating: 4.6,
    price: "$22.99",
    description:
      "Convenient electrolyte sticks for travel, workouts, and low-energy days.",
    pros: ["Portable sticks", "Fast mix", "Widely available"],
    cons: ["Contains sugar — not ideal for strict low-carb"],
    affiliateUrl: "/go/iherb?source=quiz-result&q=Liquid%20I.V.%20Hydration",
    highlight: true,
    imageUrl: "/products/bottle-magnesium.jpg",
  },
  "mct-oil": {
    rank: 2,
    name: "Sports Research, Organic MCT Oil, C8 + C10 + C12, 16 fl oz (473 ml)",
    badge: "Best MCT Oil",
    rating: 4.7,
    price: "$24.99",
    description:
      "Organic MCT oil for coffee, shakes, and higher-fat meal plans.",
    pros: ["Organic", "Versatile liquid format", "Popular keto staple"],
    cons: ["Start slow to avoid stomach upset"],
    affiliateUrl: "/go/iherb?source=quiz-result&q=Sports%20Research%20MCT%20Oil",
    imageUrl: "/products/bottle-omega.jpg",
  },
  creatine: {
    rank: 1,
    name: "Thorne Creatine",
    badge: "Best Creatine",
    rating: 4.8,
    price: "$44.00",
    description:
      "Micronized creatine monohydrate for strength and training consistency.",
    pros: ["NSF / Informed Sport tested options", "Simple single ingredient"],
    cons: ["Higher price than bulk tubs"],
    affiliateUrl: "/go/myprotein?source=quiz-result&q=Creatine%20Monohydrate",
    highlight: true,
    imageUrl: "/products/bottle-creatine.jpg",
  },
  "whey-protein": {
    rank: 2,
    name: "Optimum Nutrition Gold Standard 100% Whey",
    badge: "Best Whey",
    rating: 4.7,
    price: "$49.99",
    description:
      "A widely trusted whey blend for muscle recovery and daily protein targets.",
    pros: ["Mixes well", "Broad flavor range", "Reliable brand"],
    cons: ["Not suitable for dairy-free diets"],
    affiliateUrl: "/go/myprotein?source=quiz-result&q=Whey%20Protein",
    imageUrl: "/products/bottle-creatine.jpg",
  },
};

/** Back-compat alias used by older keys / tests */
PICKS.ashwagandha = PICKS["ashwagandha-ksm66"];

const GUIDES = {
  sleep: {
    title: "Magnesium supplements guide",
    href: "/category/supplements/magnesium-supplements-guide-types-benefits-and-top-picks-78949",
  },
  stress: {
    title: "Ashwagandha supplements guide",
    href: "/category/reviews/best-ashwagandha-supplements-reviewed-top-picks-for-2026-91791",
  },
  energy: {
    title: "Vitamin B12 supplements guide",
    href: "/category/supplements/vitamin-b12-supplements-guide-benefits-dosage-and-top-picks-69921",
  },
  weight_loss: {
    title: "Electrolyte supplements guide",
    href: "/category/reviews/best-electrolyte-supplements-reviewed-top-picks-for-2026-58008",
  },
  muscle: {
    title: "Best creatine supplements reviewed",
    href: "/category/reviews/best-creatine-supplements-reviewed-top-picks-for-2026-10308",
  },
  heart: {
    title: "Omega-3 & heart health picks",
    href: "/category/supplements/top-supplements-for-optimal-health-your-essential-guide-06604",
  },
};

export function parsePriceNumber(price) {
  const n = Number(String(price || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function formatStackTotal(picks = []) {
  const sum = picks.reduce((acc, p) => acc + parsePriceNumber(p.price), 0);
  return `$${sum.toFixed(2)}`;
}

export function partnersForPicks(picks = []) {
  const set = new Set();
  for (const p of picks) {
    const { partner } = parseGoLink(p.affiliateUrl || "");
    set.add(partner || "iherb");
  }
  return [...set];
}

function enrichPick(base, rank) {
  const partner = parseGoLink(base.affiliateUrl || "").partner || "iherb";
  return {
    ...base,
    rank,
    highlight: rank === 1,
    buttonText: discountShopLabel(partner),
  };
}

export function picksFromKeys(keys = []) {
  return keys
    .map((raw, i) => {
      const k = normalizePickKey(raw);
      const p = PICKS[k] || PICKS[raw];
      if (!p) return null;
      return enrichPick(p, i + 1);
    })
    .filter(Boolean);
}

export function stackKeysForGoal(goal, { gut, budget } = {}) {
  let keys = [...(STACK_MAP[goal] || STACK_MAP.sleep)];

  if (gut === "yes" && keys[0] === "electrolytes") {
    keys = ["magnesium-glycinate", "mct-oil"];
  }

  // Lean budget still gets a focused starter — full stack when mid/premium
  if (budget === "$" && keys.length > 1) {
    keys = [keys[0]];
  }

  return keys.map(normalizePickKey);
}

export function mapQuizToPicks(answers = {}) {
  const goal = answers.goal || "sleep";
  const keys = stackKeysForGoal(goal, answers);
  const picks = picksFromKeys(keys);

  return {
    picks,
    keys,
    goal,
    guide: GUIDES[goal] || GUIDES.sleep,
    headline: "Your personalized stack based on your answers",
    stackTotal: formatStackTotal(picks),
    partners: partnersForPicks(picks),
  };
}

/** Build answers from share URL (?goal=&stack= or ?product=) */
export function answersFromShareParams(params = {}) {
  const goal = String(params.goal || "").trim();
  if (!goal || !STACK_MAP[goal]) return null;

  const stackRaw = String(params.stack || params.product || "").trim();
  const keys = stackRaw
    ? stackRaw
        .split(",")
        .map((k) => normalizePickKey(k))
        .filter(Boolean)
    : stackKeysForGoal(goal, { gut: "no", budget: "$$" });

  return {
    goal,
    gut: "no",
    budget: "$$",
    alreadySupplementing: "no",
    whichSupplements: "",
    shareKeys: keys,
    fromShare: true,
    savedAt: new Date().toISOString(),
  };
}

export function mapSharedToPicks(answers) {
  if (Array.isArray(answers?.shareKeys) && answers.shareKeys.length) {
    const picks = picksFromKeys(answers.shareKeys);
    const goal = answers.goal || "sleep";
    return {
      picks,
      keys: answers.shareKeys,
      goal,
      guide: GUIDES[goal] || GUIDES.sleep,
      headline: "Shared NutriGuide stack",
      stackTotal: formatStackTotal(picks),
      partners: partnersForPicks(picks),
    };
  }
  return mapQuizToPicks(answers);
}

export function buildResultsSharePath(goal, keys = []) {
  const q = new URLSearchParams();
  q.set("goal", goal);
  if (keys.length) q.set("stack", keys.join(","));
  return `/quiz/results?${q.toString()}`;
}

export function saveQuizAnswers(answers) {
  const payload = {
    ...answers,
    savedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* ignore */
  }
  return payload;
}

export function loadQuizAnswers() {
  try {
    const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data?.goal) return null;
    return data;
  } catch {
    return null;
  }
}

export function clearQuizAnswers() {
  try {
    localStorage.removeItem(QUIZ_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/** Optional article → quiz goal prefill */
export function quizPrefillForSlug(slug = "") {
  const s = String(slug).toLowerCase();
  if (s.includes("magnesium") || s.includes("sleep")) return "sleep";
  if (s.includes("ashwagandha") || s.includes("stress")) return "stress";
  if (s.includes("creatine") || s.includes("protein") || s.includes("muscle"))
    return "muscle";
  if (s.includes("electrolyte") || s.includes("mct")) return "weight_loss";
  if (s.includes("b12") || s.includes("energy")) return "energy";
  if (s.includes("omega") || s.includes("heart")) return "heart";
  return null;
}
