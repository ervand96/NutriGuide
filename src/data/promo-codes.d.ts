export type PromoStore = "iHerb" | "MyProtein";

export type PromoCode = {
  id: string;
  store: PromoStore;
  code: string | null;
  discount: string;
  description: string;
  link: string;
  category?: string;
  lastVerified: string;
  expiryDate?: string;
  expired?: boolean;
};

export const PROMO_CODES: PromoCode[];
export function getActivePromoCodes(): PromoCode[];
export function getLatestPromoVerifiedDate(codes?: PromoCode[]): string;
export function formatPromoMonthYear(isoDate: string): string;
export function formatPromoDisplayDate(isoDate: string): string;
export function promoCodesOfferJsonLd(
  codes: PromoCode[],
  pageUrl: string,
  siteUrl?: string,
): Record<string, unknown>;
