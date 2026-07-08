import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import ArticleCard from "../../../components/ArticleCard";
import { getAllPosts } from "../../../lib/posts";
import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://nutri-guide-indol.vercel.app";

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

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="font-display font-black text-4xl mb-2 capitalize">
          {params.category}
        </h1>
        <p className="text-gray-500 mb-12 max-w-2xl">
          {meta?.description ||
            `All articles in ${params.category}`}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <ArticleCard key={post.slug} article={post} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
