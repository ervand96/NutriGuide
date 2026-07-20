import GuideShelfCard from "@/components/GuideShelfCard";
import { getAllPosts } from "@/lib/posts";

export default function RelatedArticles({
  currentSlug,
  category,
}: {
  currentSlug: string;
  category: string;
}) {
  const related = getAllPosts()
    .filter((p) => p.category === category && p.slug !== currentSlug)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="mt-16 pt-12 pb-2 border-t border-leaf-100">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
        <div>
          <p className="text-leaf-600 text-xs font-bold uppercase tracking-[0.16em] mb-2">
            Editor shelf
          </p>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-bark tracking-tight">
            Related Articles
          </h2>
          <p className="text-gray-500 text-sm sm:text-base mt-1">
            More guides like this — tap to check prices or read the full review.
          </p>
        </div>
        <span className="text-leaf-700 text-xs font-bold bg-leaf-50 border border-leaf-100 px-3 py-1.5 rounded-full w-fit">
          {related.length} picks
        </span>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:pb-0 md:snap-none md:items-stretch">
        {related.map((post, i) => (
          <GuideShelfCard key={post.slug} post={post} rank={i + 1} />
        ))}
      </div>
    </section>
  );
}
