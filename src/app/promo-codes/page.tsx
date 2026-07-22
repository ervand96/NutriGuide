import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryNavStrip from "@/components/CategoryNavStrip";
import PromoCodesClient from "@/components/PromoCodesClient";
import NewsletterStrip from "@/components/NewsletterStrip";
import { SITE_CONTAINER } from "@/lib/layout.js";
import {
  SITE_URL,
  pageMetadata,
  breadcrumbJsonLd,
} from "@/lib/seo.js";
import {
  formatPromoDisplayDate,
  formatPromoMonthYear,
  getActivePromoCodes,
  getLatestPromoVerifiedDate,
  promoCodesOfferJsonLd,
} from "@/data/promo-codes.js";
import type { Metadata } from "next";

const codes = getActivePromoCodes();
const latest = getLatestPromoVerifiedDate(codes);
const monthYear = formatPromoMonthYear(latest);

export const metadata: Metadata = pageMetadata({
  title: `iHerb & MyProtein Promo Codes — Verified ${monthYear}`,
  description: `Verified iHerb and MyProtein promo codes and Rewards links, last checked ${formatPromoDisplayDate(latest)}. Copy codes or shop with tracked discount links.`,
  path: "/promo-codes",
});

export default function PromoCodesPage() {
  const pageUrl = `${SITE_URL}/promo-codes`;
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", url: SITE_URL },
      { name: "Promo Codes", url: pageUrl },
    ]),
    promoCodesOfferJsonLd(codes, pageUrl, SITE_URL),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <CategoryNavStrip active="promo-codes" />
      <main className="bg-cream">
        <section className={`${SITE_CONTAINER} py-10 sm:py-14`}>
          <p className="text-leaf-600 text-xs font-bold uppercase tracking-[0.16em] mb-2">
            Deals desk
          </p>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-bark tracking-tight mb-3 max-w-4xl">
            Verified iHerb &amp; MyProtein Promo Codes — Updated{" "}
            {formatPromoDisplayDate(latest)}
          </h1>
          <p className="text-gray-500 text-base sm:text-lg max-w-2xl mb-8 leading-relaxed">
            All codes below were last verified on{" "}
            <strong className="text-bark font-semibold">
              {formatPromoDisplayDate(latest)}
            </strong>
            . We remove or expire deals that stop working — always double-check
            at checkout.
          </p>

          <PromoCodesClient codes={codes} />

          <p className="text-gray-400 text-xs mt-8 max-w-2xl leading-relaxed">
            Affiliate disclosure: NutriGuide may earn a commission when you shop
            through our links. Discount availability depends on store rules,
            region, and account eligibility.
          </p>
        </section>

        <NewsletterStrip
          eyebrow="Deal alerts"
          title="Get new codes in your inbox"
          subtitle="Occasional emails when we verify a fresh iHerb or MyProtein deal — no spam."
          diet="promo-codes"
        />
      </main>
      <Footer />
    </>
  );
}
