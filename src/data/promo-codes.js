/**
 * Verified iHerb & MyProtein promo / referral deals.
 * Update lastVerified whenever you re-check a code.
 * Set expired: true (or delete) when a deal stops working.
 */

import { IHERB_DISCOUNT_PCT } from "../lib/affiliate.js";

/**
 * @typedef {"iHerb" | "MyProtein"} PromoStore
 * @typedef {{
 *   id: string,
 *   store: PromoStore,
 *   code: string | null,
 *   discount: string,
 *   description: string,
 *   link: string,
 *   category?: string,
 *   lastVerified: string,
 *   expiryDate?: string,
 *   expired?: boolean,
 * }} PromoCode
 */

/** @type {PromoCode[]} */
export const PROMO_CODES = [
  {
    id: "iherb-rewards",
    store: "iHerb",
    code: "QXH0410",
    discount: `Up to ${IHERB_DISCOUNT_PCT}% off`,
    description:
      "iHerb Rewards referral link — typically 5% off most products, up to 10% on iHerb-brand items for eligible new referred shoppers. Code applies via our tracked link.",
    link: "/go/iherb?source=promo-codes-iherb-rewards",
    category: "First order / Rewards",
    lastVerified: "2026-07-22",
  },
  {
    id: "iherb-search-magnesium",
    store: "iHerb",
    code: null,
    discount: "Live prices + Rewards",
    description:
      "Jump straight into magnesium searches with our Rewards tracking applied automatically — no code to paste.",
    link: "/go/iherb?source=promo-codes-iherb-magnesium&q=magnesium%20glycinate",
    category: "Supplements",
    lastVerified: "2026-07-22",
  },
  {
    id: "myprotein-referral",
    store: "MyProtein",
    code: "ERVAND-R5",
    discount: "Exclusive code applied",
    description:
      "MyProtein referral code is pre-applied when you shop through our link. Extra sitewide sales may stack depending on MyProtein rules at checkout.",
    link: "/go/myprotein?source=promo-codes-myprotein",
    category: "Sitewide",
    lastVerified: "2026-07-22",
  },
  {
    id: "myprotein-protein",
    store: "MyProtein",
    code: null,
    discount: "Code auto-applied",
    description:
      "Browse whey & protein with our referral code attached — useful during MyProtein flash sales.",
    link: "/go/myprotein?source=promo-codes-myprotein-whey&q=whey%20protein",
    category: "Supplements",
    lastVerified: "2026-07-22",
  },
];

/** Active (non-expired) promos for the public page */
export function getActivePromoCodes() {
  return PROMO_CODES.filter((p) => !p.expired);
}

/** Newest lastVerified among active codes (YYYY-MM-DD) */
export function getLatestPromoVerifiedDate(codes = getActivePromoCodes()) {
  if (!codes.length) return new Date().toISOString().slice(0, 10);
  return codes
    .map((c) => c.lastVerified)
    .filter(Boolean)
    .sort()
    .at(-1);
}

export function formatPromoMonthYear(isoDate) {
  const d = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function formatPromoDisplayDate(isoDate) {
  const d = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** schema.org Offer list for SEO */
export function promoCodesOfferJsonLd(codes, pageUrl, siteUrl = "") {
  const origin = String(siteUrl || "").replace(/\/$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Verified iHerb & MyProtein Promo Codes",
    url: pageUrl,
    numberOfItems: codes.length,
    itemListElement: codes.map((p, i) => {
      const offerUrl = p.link.startsWith("http")
        ? p.link
        : `${origin}${p.link.startsWith("/") ? p.link : `/${p.link}`}`;
      return {
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Offer",
          name: `${p.store}: ${p.discount}`,
          description: p.description,
          url: offerUrl,
          category: p.category || p.store,
          availability: "https://schema.org/InStock",
          ...(p.expiryDate ? { validThrough: p.expiryDate } : {}),
          seller: {
            "@type": "Organization",
            name: p.store,
          },
          ...(p.code
            ? {
                identifier: p.code,
                priceSpecification: {
                  "@type": "UnitPriceSpecification",
                  priceCurrency: "USD",
                  name: `Promo code ${p.code}`,
                },
              }
            : {}),
        },
      };
    }),
  };
}
