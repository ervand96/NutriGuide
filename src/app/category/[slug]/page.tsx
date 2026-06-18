import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import { articles } from "@/lib/articles";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const filtered = articles.filter(
    (a) => a.category.toLowerCase() === params.slug,
  );

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="font-display font-black text-4xl mb-2 capitalize">
          {params.slug}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
