import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Product } from "@/types";
import { getPostBySlug } from "@/lib/posts";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";

// ────────────────────────────────────────────
// Sample article — replace with your CMS / MDX
// ────────────────────────────────────────────

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) return notFound();

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-14">
        {/* Header */}
        <div className="mb-10">
          <span className="category-badge mb-4 inline-block">
            {post.category}
          </span>
          <h1 className="font-display font-black text-4xl md:text-5xl leading-none tracking-tight text-bark mb-4">
            {post.title}
          </h1>
          <div className="text-gray-400 text-sm font-body">
            ⏱ {post.readTime} · Updated {post.date}
          </div>
        </div>

        {/* Intro */}
        <p className="text-lg text-gray-600 leading-relaxed mb-8 font-body">
          {post.description}
        </p>

        {/* Quick answer box */}
        <div className="bg-leaf-50 border border-leaf-100 rounded-2xl p-6 mb-10">
          <div className="font-bold text-leaf-600 text-sm uppercase tracking-wider mb-3">
            ⚡ Quick Answer
          </div>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>
              🥇 <strong>Best Overall:</strong> MyProtein Impact Whey — high
              protein, low cost
            </li>
            <li>
              💰 <strong>Best Budget:</strong> iHerb Garcinia Cambogia — natural
              & affordable
            </li>
            <li>
              🧠 <strong>Best Program:</strong> Noom — targets the psychology of
              eating
            </li>
          </ul>
        </div>

        {/* Products */}
        {(post.products ?? []).map((product) => (
          <ProductCard key={product.rank} product={product} />
        ))}

        {/* Affiliate disclaimer */}
        <div className="mt-12 bg-gray-50 border border-gray-100 rounded-xl p-5">
          <p className="text-xs text-gray-400 leading-relaxed">
            <strong className="text-gray-500">Affiliate Disclosure:</strong>{" "}
            This article contains affiliate links. We may earn a small
            commission if you purchase through our links at no extra cost to
            you. All reviews and opinions are our own and are not influenced by
            affiliate relationships.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
