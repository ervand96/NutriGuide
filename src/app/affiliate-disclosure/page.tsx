import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description:
    "How NutriGuide uses affiliate links and how that affects (or doesn't affect) our recommendations.",
};

export default function AffiliateDisclosurePage() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-16">
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
            Some links on NutriGuide — including links to iHerb, MyProtein,
            Amazon, Noom, and HelloFresh — are affiliate links. If you click
            one of these links and make a purchase or sign up, we may earn a
            commission. This comes at no additional cost to you; prices are
            the same whether or not you use our link.
          </p>

          <h2 className="text-2xl font-bold text-bark pt-2">
            This Doesn't Change Our Recommendations
          </h2>
          <p>
            No brand can pay us for a better review or a higher ranking. We
            choose what to feature based on ingredient quality, third-party
            testing where available, pricing, and user feedback — the same
            criteria we'd use if there were no affiliate program at all.
          </p>

          <h2 className="text-2xl font-bold text-bark pt-2">
            Amazon Associates Disclosure
          </h2>
          <p>
            NutriGuide is a participant in the Amazon Services LLC Associates
            Program, an affiliate advertising program designed to provide a
            means for sites to earn advertising fees by advertising and
            linking to Amazon.com.
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
