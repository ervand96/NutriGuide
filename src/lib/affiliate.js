export const PARTNERS = ["iherb", "myprotein"];

/**
 * iHerb Rewards referral is typically 5% off (10% on iHerb-brand items) for
 * referred shoppers — not a blanket sitewide promo. Keep CTA copy honest.
 */
export const IHERB_DISCOUNT_PCT = 10;
export const IHERB_DISCOUNT_TAG = `Up to ${IHERB_DISCOUNT_PCT}% off`;
export const MYPROTEIN_DISCOUNT_TAG = "Exclusive code applied";

export function discountShopLabel(partner) {
  if (String(partner).toLowerCase() === "myprotein") {
    return "Shop this pick with code on MyProtein →";
  }
  return `Get up to ${IHERB_DISCOUNT_PCT}% off on iHerb →`;
}

export function discountStackLabel(partner) {
  if (String(partner).toLowerCase() === "myprotein") {
    return "Shop this stack on MyProtein →";
  }
  return `Get up to ${IHERB_DISCOUNT_PCT}% off this stack on iHerb →`;
}

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

/**
 * Map visitor country → iHerb regional host so rcode lands on the same
 * storefront they shop on (avoids www→am/uk strip races). Unknown → www.
 */
export const IHERB_COUNTRY_HOSTS = {
  US: "www.iherb.com",
  GB: "uk.iherb.com",
  UK: "uk.iherb.com",
  AM: "am.iherb.com",
  AU: "au.iherb.com",
  CA: "ca.iherb.com",
  DE: "de.iherb.com",
  FR: "fr.iherb.com",
  IT: "it.iherb.com",
  ES: "es.iherb.com",
  NL: "nl.iherb.com",
  SE: "se.iherb.com",
  NO: "no.iherb.com",
  DK: "dk.iherb.com",
  FI: "fi.iherb.com",
  IE: "ie.iherb.com",
  NZ: "nz.iherb.com",
  SG: "sg.iherb.com",
  HK: "hk.iherb.com",
  TW: "tw.iherb.com",
  JP: "jp.iherb.com",
  KR: "kr.iherb.com",
  MX: "mx.iherb.com",
  BR: "br.iherb.com",
  IL: "il.iherb.com",
  AE: "ae.iherb.com",
  SA: "sa.iherb.com",
  TR: "tr.iherb.com",
  RU: "ru.iherb.com",
  UA: "ua.iherb.com",
  PL: "pl.iherb.com",
  CZ: "cz.iherb.com",
  RO: "ro.iherb.com",
  HU: "hu.iherb.com",
  AT: "at.iherb.com",
  CH: "ch.iherb.com",
  BE: "be.iherb.com",
  PT: "pt.iherb.com",
  GR: "gr.iherb.com",
  PH: "ph.iherb.com",
  MY: "my.iherb.com",
  TH: "th.iherb.com",
  VN: "vn.iherb.com",
  IN: "in.iherb.com",
  CL: "cl.iherb.com",
  CO: "co.iherb.com",
  PE: "pe.iherb.com",
  AR: "ar.iherb.com",
  ZA: "za.iherb.com",
};

export function iherbHostForCountry(countryCode, env = process.env) {
  // Explicit override always wins (testing / forced storefront)
  const forced = String(env.IHERB_HOST || "")
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
  if (forced) return forced;

  const cc = String(countryCode || "")
    .trim()
    .toUpperCase();
  return IHERB_COUNTRY_HOSTS[cc] || "www.iherb.com";
}

/** Prefer clean Rewards links — UTM on iHerb can confuse geo redirects. */
export function buildAffiliateUrl(
  partner,
  query,
  env = process.env,
  options = {},
) {
  const IHERB_CODE = String(env.IHERB_RCODE || "QXH0410").trim();
  const MY_PROTEIN = String(env.MY_PROTEIN_RCODE || "ERVAND-R5").trim();
  const iherbHost = iherbHostForCountry(options.country, env);
  const p = partner?.toLowerCase();

  switch (p) {
    case "myprotein":
      return query
        ? `https://www.myprotein.com/search/?q=${encodeURIComponent(query)}&applyCode=${encodeURIComponent(MY_PROTEIN)}`
        : `https://www.myprotein.com/c/referrals/?applyCode=${encodeURIComponent(MY_PROTEIN)}`;
    case "iherb":
    default: {
      const params = new URLSearchParams();
      params.set("rcode", IHERB_CODE);
      if (query) {
        params.set("kw", query);
        return `https://${iherbHost}/search?${params.toString()}`;
      }
      return `https://${iherbHost}/?${params.toString()}`;
    }
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

/**
 * Attach UTM tags for analytics. Skip for iHerb — extra query params on the
 * destination confuse regional redirects and are redundant (we already log
 * clicks on /go/[partner]).
 */
export function appendUtm(url, source, partner) {
  if (String(partner).toLowerCase() === "iherb") {
    return url;
  }
  const u = new URL(url);
  u.searchParams.set("utm_source", "nutriguide");
  u.searchParams.set("utm_medium", "affiliate");
  u.searchParams.set("utm_campaign", source || "unknown");
  u.searchParams.set("utm_content", partner);
  return u.toString();
}
