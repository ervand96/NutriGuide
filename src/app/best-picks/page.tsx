import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OfferStrip from "@/components/OfferStrip";
import CategoryNavStrip from "@/components/CategoryNavStrip";
import ProductShelf from "@/components/ProductShelf";
import GuideShelfCard from "@/components/GuideShelfCard";
import AffiliateButton from "@/components/AffiliateButton";
import { SITE_CONTAINER } from "@/lib/layout.js";
import { getAllPosts } from "@/lib/posts";
import {
  SITE_URL,
  pageMetadata,
  itemListJsonLd,
  breadcrumbJsonLd,
} from "@/lib/seo.js";
import type { Metadata } from "next";

export const metadata: Metadata = pageMetadata({
  title: "Best Diet & Supplement Picks 2026",
  description:
    "Editor-ranked best picks for protein, creatine, vitamins, and diet essentials. Compare ratings, then shop iHerb or MyProtein with one click.",
  path: "/best-picks",
});

export default function BestPicksPage() {
  const posts = getAllPosts().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const topProducts = posts
    .flatMap((post) =>
      (post.products || []).map((p) => ({
        ...p,
        postSlug: post.slug,
        postCategory: post.category,
      })),
    )
    .filter((p) => p.rating)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 6);

  const topGuides = posts.slice(0, 6);

  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", url: SITE_URL },
      { name: "Best Picks", url: `${SITE_URL}/best-picks` },
    ]),
    itemListJsonLd({
      name: "NutriGuide Best Picks",
      description: "Top-rated diet and supplement guides",
      items: topGuides.map((p) => ({
        name: p.title,
        url: `${SITE_URL}/category/${p.category.toLowerCase()}/${p.slug}`,
      })),
    }),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <CategoryNavStrip />
      <OfferStrip source="best-picks" />
      <main>
        <section className={`${SITE_CONTAINER} py-10 sm:py-14`}>
          <p className="text-leaf-600 text-xs font-bold uppercase tracking-[0.16em] mb-2">
            Start here
          </p>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-bark tracking-tight mb-3">
            Best diet &amp; supplement picks
          </h1>
          <p className="text-gray-500 text-base sm:text-lg max-w-3xl mb-6 leading-relaxed">
            Our highest-rated products and most-read guides — built for people
            who want a clear next step, not another endless feed of opinions.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-10">
            <AffiliateButton
              partner="iherb"
              source="best-picks-hero"
              className="!py-3"
            >
              Shop iHerb deals →
            </AffiliateButton>
            <AffiliateButton
              partner="myprotein"
              source="best-picks-hero"
              variant="outline"
              className="!py-3"
            >
              Shop MyProtein →
            </AffiliateButton>
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center font-bold text-leaf-600 no-underline hover:underline px-4 py-3"
            >
              Or take the 2-min diet quiz →
            </Link>
          </div>
        </section>

        {topProducts.length > 0 && (
          <section className="relative overflow-hidden border-y border-leaf-100 py-14 sm:py-16">
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-leaf-50 via-cream to-leaf-100/40"
              aria-hidden
            />
            <div className={`relative ${SITE_CONTAINER}`}>
              <ProductShelf
                title="Top rated products"
                subtitle="Prices and ratings you can verify in one click"
                products={topProducts}
                slugPrefix="best-picks"
              />
            </div>
          </section>
        )}

        <section className={`${SITE_CONTAINER} py-14 sm:py-16`}>
          <div className="mb-8">
            <p className="text-leaf-600 text-xs font-bold uppercase tracking-[0.16em] mb-2">
              Editor shelf
            </p>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-bark tracking-tight">
              Most useful guides right now
            </h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:pb-0 md:items-stretch">
            {topGuides.slice(0, 3).map((post, i) => (
              <GuideShelfCard key={post.slug} post={post} rank={i + 1} />
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-4 text-sm font-bold">
            <Link href="/category/diets" className="text-leaf-600 no-underline hover:underline">
              All diets →
            </Link>
            <Link href="/category/reviews" className="text-leaf-600 no-underline hover:underline">
              All reviews →
            </Link>
            <Link href="/category/supplements" className="text-leaf-600 no-underline hover:underline">
              All supplements →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
