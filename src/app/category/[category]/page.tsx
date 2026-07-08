import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import ArticleCard from "../../../components/ArticleCard";
import OfferStrip from "../../../components/OfferStrip";
import AffiliateButton from "../../../components/AffiliateButton";
import { getAllPosts } from "../../../lib/posts";
import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://nutri-guide-indol.vercel.app";

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
  const url = `${siteUrl}/category/${key}`;

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: url },
    openGraph: { title: meta.title, description: meta.description, url },
  };
}

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const allPosts = getAllPosts();
  const posts = allPosts.filter(
    (post) => post.category.toLowerCase() === params.category.toLowerCase(),
  );
  const meta = categoryMeta[params.category.toLowerCase()];
  const shop = categoryShop[params.category.toLowerCase()];

  return (
    <>
      <Navbar />
      <OfferStrip source={`category-${params.category}`} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div>
            <h1 className="font-display font-black text-3xl sm:text-4xl mb-2 capitalize">
              {params.category}
            </h1>
            <p className="text-gray-500 max-w-2xl text-sm sm:text-base">
              {meta?.description ||
                `All articles in ${params.category}`}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {posts.map((post) => (
            <ArticleCard key={post.slug} article={post} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
