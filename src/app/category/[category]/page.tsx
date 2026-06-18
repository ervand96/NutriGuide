import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import { getAllPosts } from "@/lib/posts";

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const allPosts = getAllPosts();

  const posts = allPosts.filter(
    (post) => post.category.toLowerCase() === params.category.toLowerCase(),
  );

  return (
    <>
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-black mb-2 capitalize">
          {params.category}
        </h1>

        <p className="text-gray-400 mb-12">All articles in {params.category}</p>

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
