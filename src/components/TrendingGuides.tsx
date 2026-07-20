import GuideShelfCard, { GuideCardPost } from "./GuideShelfCard";

export default function TrendingGuides({
  posts,
}: {
  posts: GuideCardPost[];
}) {
  if (!posts?.length) return null;

  const list = posts.slice(0, 3);

  return (
    <section className="relative overflow-hidden border-y border-leaf-100 py-14 sm:py-16">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-leaf-50 via-cream to-leaf-100/40"
        aria-hidden
      />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <p className="text-leaf-600 text-xs font-bold uppercase tracking-[0.16em] mb-2">
              Editor shelf
            </p>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-bark tracking-tight mb-1">
              Trending guides this week
            </h2>
            <p className="text-gray-500 text-sm sm:text-base">
              Most-read topics — tap a card to check price or read the full guide.
            </p>
          </div>
          <span className="text-leaf-700 text-xs font-bold bg-white/80 border border-leaf-100 px-3 py-1.5 rounded-full w-fit">
            {list.length} top picks
          </span>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:pb-0 md:items-stretch">
          {list.map((post, i) => (
            <GuideShelfCard key={post.slug} post={post} rank={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
