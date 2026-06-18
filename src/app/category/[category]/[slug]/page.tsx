import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/posts";
import ProductCard from "@/components/ProductCard";

export default function ArticlePage({
  params,
}: {
  params: { category: string; slug: string };
}) {
  const post = getPostBySlug(params.slug);

  if (!post) return notFound();

  // 🔥 защита от неправильной категории

  if (post.category.toLowerCase() !== params.category.toLowerCase()) {
    return notFound();
  }

  return (
    <>
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-14">
        {/* HEADER */}
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

        {/* DESCRIPTION */}
        <p className="text-lg text-gray-600 leading-relaxed mb-8 font-body">
          {post.description}
        </p>

        {/* QUICK ANSWER */}
        <div className="bg-leaf-50 border border-leaf-100 rounded-2xl p-6 mb-10">
          <div className="font-bold text-leaf-600 text-sm uppercase tracking-wider mb-3">
            ⚡ Quick Answer
          </div>

          <ul className="space-y-1 text-sm text-gray-600">
            <li>🥇 Best Overall option</li>
            <li>💰 Best Budget option</li>
            <li>🧠 Best Strategy option</li>
          </ul>
        </div>

        {/* PRODUCTS */}
        {(post.products ?? []).map((product: any) => (
          <ProductCard key={product.rank} product={product} />
        ))}

        {/* DISCLAIMER */}
        <div className="mt-12 bg-gray-50 border border-gray-100 rounded-xl p-5">
          <p className="text-xs text-gray-400 leading-relaxed">
            <strong className="text-gray-500">Affiliate Disclosure:</strong>{" "}
            This article may contain affiliate links.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
