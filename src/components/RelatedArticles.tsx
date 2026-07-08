import ArticleCard from "@/components/ArticleCard";
import { getAllPosts } from "@/lib/posts";

export default function RelatedArticles({
  currentSlug,
  category,
}: {
  currentSlug: string;
  category: string;
}) {
  const related = getAllPosts()
    .filter(
      (p) =>
        p.category === category &&
        p.slug !== currentSlug,
    )
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="mt-16 pt-10 border-t border-gray-100">
      <h2 className="font-display font-black text-2xl mb-6">
        Related Articles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {related.map((post) => (
          <ArticleCard key={post.slug} article={post} />
        ))}
      </div>
    </section>
  );
}
