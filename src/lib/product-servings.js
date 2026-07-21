/**
 * Servings-per-container lookup + cost/serving helpers.
 * Explicit overrides first; then parse counts from product names.
 */

const SERVINGS_OVERRIDES = {
  "now foods, magnesium glycinate": 90, // 180 tablets ÷ 2
  "doctor's best, high absorption magnesium lysinate glycinate": 120,
  "myprotein 1000mg magnesium bisglycinate tablets": 60,
  "life extension, neuro-mag magnesium l-threonate": 30,
  "now foods, ksm-66 ashwagandha, 600 mg, 90 veg capsules": 90,
  "nutrabio, ksm-66 ashwagandha, 90 capsules": 90,
  "myprotein ashwagandha ksm66 capsules": 60,
  "thorne creatine": 90,
  "myprotein creapure creatine monohydrate": 100,
  "california gold nutrition sport pure creatine monohydrate": 100,
  "nordic naturals, ultimate omega": 60,
  "nordic naturals ultimate omega": 60,
  "california gold nutrition, omega-3, premium fish oil": 100,
  "california gold nutrition, omega-800, ultra-concentrated omega-3 fish oil": 30,
  "myprotein essential omega-3 softgels": 90,
  "myprotein omega 3 softgels": 90,
  "optimum nutrition gold standard 100% whey": 29,
  "optimum nutrition gold standard 100% whey protein": 29,
  "garden of life sport organic plant-based protein": 20,
  "garden of life sport organic plant-based protein powder": 20,
  "dymatize iso100 hydrolyzed protein isolate": 20,
  "liquid i.v., hydration multiplier, electrolyte drink mix, lemon lime, 10 stick packs": 10,
  "nuun, sport hydration, effervescent electrolyte drink, lemon lime, 10 tablets": 10,
  "ultima replenisher, 6 essential electrolytes, daily electrolyte drink mix, tropical variety pack, 20 stickpacks, 2.4 oz (69 g)": 20,
  "sports research, organic mct oil, c8 + c10 + c12, 16 fl oz (473 ml)": 31,
  "now foods, methyl b-12, 1,000 mcg, 100 lozenges": 100,
  "life extension, vitamin b12 methylcobalamin, 5 mg, 60 vegetarian lozenges": 60,
  "myprotein vitamin b12 tablets, 180 tablets": 180,
  "california gold nutrition, vitamin d3, 125 mcg (5,000 iu), 360 fish gelatin softgels": 360,
  "now foods, vitamin d-3, high potency, 125 mcg (5,000 iu), 120 softgels": 120,
  "myprotein vitamin d3 softgels": 60,
  "thorne, zinc picolinate, 30 mg, 60 capsules": 60,
  "jarrow formulas, vegan zinc balance, 100 veggie capsules": 100,
  "myprotein zinc tablets - 90 tablets": 90,
  "garden of life, dr. formulated probiotics, once daily ultra, 90 billion, 30 vegetarian capsules": 30,
  "culturelle, probiotics, digestive daily probiotic, 30 vegetarian capsules": 30,
  "myprotein daily probiotic capsules": 90,
  "vital proteins collagen peptides": 20,
  "neocell super collagen + c": 30,
  "sports research collagen peptides": 20,
  "athletic greens ag1": 30,
  "thorne basic nutrients 2/day": 30,
  "nature made, multi for her, 90 tablets": 90,
  "garden of life, vitamin code, whole food multivitamin for men, 120 vegetarian capsules": 60,
  "myprotein alpha men multivitamin": 60,
};

function cacheKey(name = "") {
  return String(name).toLowerCase().trim().replace(/\s+/g, " ");
}

function parsePrice(price) {
  const n = Number(String(price || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Infer servings from phrases like "90 Veg Capsules", "180 Tablets", "10 Stick Packs" */
export function inferServingsFromName(name = "") {
  const key = cacheKey(name);
  if (SERVINGS_OVERRIDES[key]) return SERVINGS_OVERRIDES[key];

  const stick = name.match(/(\d+)\s*stick\s*packs?/i);
  if (stick) return Number(stick[1]);

  const servings = name.match(/(\d+)\s*servings?/i);
  if (servings) return Number(servings[1]);

  const count = name.match(
    /(\d+)\s*(?:veg(?:etable|gie)?\s*)?(?:capsules?|tablets?|softgels?|lozenges?)/i,
  );
  if (count) {
    const n = Number(count[1]);
    // Common 2-tablet magnesium glycinate serving
    if (/magnesium glycinate/i.test(name) && n >= 120) return Math.floor(n / 2);
    return n;
  }

  return null;
}

export function formatCostPerServing(price, servings) {
  const p = parsePrice(price);
  const s = Number(servings);
  if (!p || !s || s <= 0) return null;
  const cost = p / s;
  if (cost < 0.1) return `$${cost.toFixed(3)}`;
  return `$${cost.toFixed(2)}`;
}

export function withServingEconomics(product = {}) {
  const servingsPerContainer =
    product.servingsPerContainer ||
    inferServingsFromName(product.name || "");
  const costPerServing = formatCostPerServing(
    product.price,
    servingsPerContainer,
  );
  return {
    ...product,
    ...(servingsPerContainer ? { servingsPerContainer } : {}),
    ...(costPerServing ? { costPerServing } : {}),
  };
}
