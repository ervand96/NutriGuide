import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import StoreGuide from "../../components/StoreGuide";
import OfferStrip from "../../components/OfferStrip";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about NutriGuide's mission to provide honest, science-backed nutrition and supplement reviews.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-leaf-500 font-semibold mb-3">
            About Us
          </p>
          <h1 className="font-display font-black text-4xl md:text-5xl text-bark mb-4">
            Our Mission
          </h1>
        </div>

        <div className="prose prose-slate max-w-none text-gray-700 space-y-6 text-lg leading-relaxed">
          <p>
            NutriGuide was created because most nutrition advice online falls
            into one of two categories: paid promotion dressed up as advice,
            or unverified opinion with no evidence behind it. We wanted
            something different — reviews and guides that are actually
            useful when you're standing in front of a decision, like which
            diet to try or which supplement is worth your money.
          </p>

          <p>
            We research diets, supplements, and nutrition programs by looking
            at ingredient quality, third-party testing where available,
            pricing, and what independent users report after actually trying
            a product. We update our guides as new information or better
            options become available.
          </p>

          <h2 className="text-2xl font-bold text-bark pt-4">
            How We Make Money
          </h2>
          <p>
            NutriGuide is reader-supported. Some links on this site are
            affiliate links, meaning we may earn a small commission if you
            make a purchase — at no additional cost to you. This never
            determines which products we recommend or how we rank them; see
            our{" "}
            <a
              href="/affiliate-disclosure"
              className="text-leaf-600 font-semibold"
            >
              Affiliate Disclosure
            </a>{" "}
            for full details.
          </p>

          <h2 className="text-2xl font-bold text-bark pt-4">
            Questions or Feedback?
          </h2>
          <p>
            We'd love to hear from you. Visit our{" "}
            <a href="/contact" className="text-leaf-600 font-semibold">
              Contact page
            </a>{" "}
            to get in touch.
          </p>
        </div>
      </main>
      <StoreGuide />
      <OfferStrip source="about" />
      <Footer />
    </>
  );
}
