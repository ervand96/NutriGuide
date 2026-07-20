import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { SITE_CONTAINER } from "@/lib/layout.js";
import { pageMetadata } from "@/lib/seo.js";
import type { Metadata } from "next";

export const metadata: Metadata = pageMetadata({
  title: "Affiliate Disclosure",
  description:
    "How NutriGuide uses affiliate links and how that affects (or doesn't affect) our recommendations.",
  path: "/affiliate-disclosure",
});

export default function AffiliateDisclosurePage() {
  return (
    <>
      <Navbar />
      <main className={`${SITE_CONTAINER} py-16`}>
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-leaf-500 font-semibold mb-3">
            Transparency
          </p>
          <h1 className="font-display font-black text-4xl md:text-5xl text-bark mb-4">
            Affiliate Disclosure
          </h1>
          <p className="text-gray-500 text-sm">Last updated: July 2026</p>
        </div>

        <div className="prose prose-slate max-w-none text-gray-700 space-y-6 text-lg leading-relaxed">
          <p>
            In accordance with FTC guidelines, NutriGuide wants to be fully
            transparent about how this site makes money.
          </p>

          <h2 className="text-2xl font-bold text-bark pt-2">
            We Use Affiliate Links
          </h2>
          <p>
            Some links on NutriGuide — including links to iHerb and MyProtein —
            are affiliate links. If you click one of these links and make a
            purchase, we may earn a commission. This comes at no additional
            cost to you; prices are the same whether or not you use our link.
          </p>

          <h2 className="text-2xl font-bold text-bark pt-2">
            Our Partner Stores
          </h2>
          <p>
            NutriGuide focuses on two trusted retailers: iHerb for vitamins,
            supplements, and natural wellness products, and MyProtein for
            protein powders and sports nutrition. We only link to stores we
            personally recommend.
          </p>

          <h2 className="text-2xl font-bold text-bark pt-2">Questions?</h2>
          <p>
            If you have any questions about our affiliate relationships,
            please{" "}
            <a href="/contact" className="text-leaf-600 font-semibold">
              contact us
            </a>
            .
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
