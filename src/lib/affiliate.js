export const PARTNERS = ["iherb", "myprotein"];

const MYPROTEIN_KEYWORDS = [
  "myprotein",
  "my protein",
  "whey",
  "creatine",
  "pre-workout",
  "pre workout",
  "bcaa",
  "mass gainer",
  "impact whey",
  "clear whey",
];

export function isValidPartner(partner) {
  return PARTNERS.includes(partner?.toLowerCase());
}

export function buildAffiliateUrl(partner, query, env = process.env) {
  const IHERB_CODE = env.IHERB_RCODE || "QXH0410";
  const MY_PROTEIN = env.MY_PROTEIN_RCODE || "ERVAND-R5";
  const p = partner?.toLowerCase();

  switch (p) {
    case "myprotein":
      return query
        ? `https://www.myprotein.com/search/?q=${encodeURIComponent(query)}&applyCode=${MY_PROTEIN}`
        : `https://www.myprotein.com/c/referrals/?applyCode=${MY_PROTEIN}`;
    case "iherb":
    default:
      return query
        ? `https://www.iherb.com/search?kw=${encodeURIComponent(query)}&rcode=${IHERB_CODE}`
        : `https://www.iherb.com/?rcode=${IHERB_CODE}`;
  }
}

export function partnerForProduct(name = "", category = "") {
  const n = name.toLowerCase();
  const cat = String(category).toLowerCase();

  if (MYPROTEIN_KEYWORDS.some((k) => n.includes(k))) return "myprotein";
  if (cat === "reviews" && /protein|creatine|pre-workout|whey|bcaa/.test(n)) {
    return "myprotein";
  }
  return "iherb";
}

export function buttonTextForPartner(partner) {
  return partner === "myprotein"
    ? "Check Price on MyProtein"
    : "Check Price on iHerb";
}

export function alternatePartner(partner) {
  return partner === "myprotein" ? "iherb" : "myprotein";
}

/** Parse /go/[partner] URL from product affiliate links */
export function parseGoLink(href = "") {
  const path = String(href).split("?")[0] || "";
  const partner = path.includes("myprotein") ? "myprotein" : "iherb";
  let query = "";
  try {
    const params = new URL(href, "https://nutriguide.local").searchParams;
    query = params.get("q") || "";
  } catch {
    query = "";
  }
  return { partner, query };
}

export function shopLinksForProduct(product, source = "product-card") {
  const href = product.affiliateUrl || "";
  const parsed = href.startsWith("/go/") ? parseGoLink(href) : null;
  const primary = parsed?.partner || partnerForProduct(product.name || "", "");
  const query =
    parsed?.query ||
    (product.name ? product.name.split(",")[0].trim() : "");
  const secondary = alternatePartner(primary);
  const q = query ? `&q=${encodeURIComponent(query)}` : "";
  return {
    primary,
    secondary,
    query,
    primaryHref: href || `/go/${primary}?source=${source}${q}`,
    secondaryHref: `/go/${secondary}?source=${source}-alt${q}`,
    primaryLabel: product.buttonText || buttonTextForPartner(primary),
    secondaryLabel:
      secondary === "myprotein"
        ? "Also check MyProtein →"
        : "Also check iHerb →",
  };
}

export function appendUtm(url, source, partner) {
  const u = new URL(url);
  u.searchParams.set("utm_source", "nutriguide");
  u.searchParams.set("utm_medium", "affiliate");
  u.searchParams.set("utm_campaign", source || "unknown");
  u.searchParams.set("utm_content", partner);
  return u.toString();
}
