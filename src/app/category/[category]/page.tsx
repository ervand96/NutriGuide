import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import ArticleCard from "../../../components/ArticleCard";
import OfferStrip from "../../../components/OfferStrip";
import AffiliateButton from "../../../components/AffiliateButton";
import CategoryNavStrip from "../../../components/CategoryNavStrip";
import ProductShelf from "../../../components/ProductShelf";
import GuideShelfCard from "../../../components/GuideShelfCard";
import { getAllPosts } from "../../../lib/posts";
import {
  SITE_URL,
  breadcrumbJsonLd,
  itemListJsonLd,
} from "@/lib/seo.js";
import type { Metadata } from "next";

const categoryShop: Record<
  string,
  { partner: "iherb" | "myprotein"; query: string; label: string }
> = {
  diets: {
    partner: "iherb",
    query: "diet supplements fiber omega",
    label: "Shop Diet Essentials on iHerb",
  },
  reviews: {
    partner: "myprotein",
    query: "best sellers protein",
    label: "Shop Top Rated on MyProtein",
  },
  supplements: {
    partner: "iherb",
    query: "vitamins minerals supplements",
    label: "Shop Supplements on iHerb",
  },
};

const categoryMeta: Record<
  string,
  { title: string; description: string }
> = {
  diets: {
    title: "Diet Guides — Keto, Mediterranean, IF & More",
    description:
      "Science-backed diet guides to help you pick the eating plan that fits your goals and lifestyle.",
  },
  reviews: {
    title: "Supplement & Product Reviews",
    description:
      "Honest, independent reviews of protein powders, vitamins, and nutrition products on iHerb and MyProtein.",
  },
  supplements: {
    title: "Supplement Guides — What Actually Works",
    description:
      "Expert supplement guides covering vitamins, minerals, protein, and wellness products we recommend.",
  },
};

export function generateMetadata({
  params,
}: {
  params: { category: string };
}): Metadata {
  const key = params.category.toLowerCase();
  const meta = categoryMeta[key] || {
    title: `${params.category} Articles`,
    description: `All ${params.category} articles on NutriGuide.`,
  };
  const url = `${SITE_URL}/category/${key}`;

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: url },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      images: [
        {
          url: `${SITE_URL}/og/default`,
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [`${SITE_URL}/og/default`],
    },
  };
}

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const key = params.category.toLowerCase() as
    | "diets"
    | "reviews"
    | "supplements";
  const allPosts = getAllPosts();
  const posts = allPosts.filter(
    (post) => post.category.toLowerCase() === key,
  );
  const meta = categoryMeta[key];
  const shop = categoryShop[key];

  const topProducts = posts
    .flatMap((post) => post.products || [])
    .filter((p) => p.rating)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 5);

  const featured = posts.slice(0, 3);
  const rest = posts.slice(3);

  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", url: SITE_URL },
      {
        name: params.category,
        url: `${SITE_URL}/category/${key}`,
      },
    ]),
    itemListJsonLd({
      name: meta?.title || `${params.category} guides`,
      description: meta?.description || `Guides in ${params.category}`,
      items: posts.map((p) => ({
        name: p.title,
        url: `${SITE_URL}/category/${key}/${p.slug}`,
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
      <CategoryNavStrip active={["diets", "reviews", "supplements"].includes(key) ? key : undefined} />
      <OfferStrip source={`category-${params.category}`} />
      <main>
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-10">
            <div>
              <h1 className="font-display font-black text-3xl sm:text-4xl mb-2 capitalize">
                {params.category}
              </h1>
              <p className="text-gray-500 max-w-2xl text-sm sm:text-base">
                {meta?.description || `All articles in ${params.category}`}
              </p>
              <p className="text-leaf-600 text-sm font-semibold mt-2">
                Showing {posts.length} guides · top 3 featured below
              </p>
            </div>
            {shop && (
              <AffiliateButton
                partner={shop.partner}
                source={`category-hero-${params.category}`}
                query={shop.query}
                className="w-full md:w-auto shrink-0 !py-3"
              >
                {shop.label} →
              </AffiliateButton>
            )}
          </div>

          <h2 className="font-display font-black text-xl sm:text-2xl text-bark mb-4">
            {`Top 3 ${params.category} guides`}
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:pb-0 md:items-stretch">
            {featured.map((post, i) => (
              <GuideShelfCard key={post.slug} post={post} rank={i + 1} />
            ))}
          </div>
        </section>

        {topProducts.length > 0 && (
          <section className="relative overflow-hidden border-y border-leaf-100 py-12 sm:py-16">
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-leaf-50 via-cream to-leaf-100/40"
              aria-hidden
            />
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
              <ProductShelf
                title={`Top products in ${params.category}`}
                subtitle="Concrete picks from our guides — tap to check price on iHerb or MyProtein."
                products={topProducts.map((p, i) => ({
                  ...p,
                  rank: i + 1,
                  highlight: i === 0,
                }))}
                slugPrefix={`cat-${key}`}
                compact
              />
            </div>
          </section>
        )}

        {rest.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <div className="mb-8">
              <p className="text-leaf-600 text-xs font-bold uppercase tracking-[0.16em] mb-2">
                Editor shelf
              </p>
              <h2 className="font-display font-black text-xl sm:text-3xl text-bark">
                More {params.category}
              </h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-5 md:overflow-visible md:pb-0 md:items-stretch">
              {rest.map((post, i) => (
                <ArticleCard key={post.slug} article={post} rank={i + 1} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
