import Link from "next/link";
import AffiliateButton from "./AffiliateButton";
import GuideShelfCard, { GuideCardPost } from "./GuideShelfCard";

const META: Record<
  string,
  {
    emoji: string;
    title: string;
    subtitle: string;
    partner: "iherb" | "myprotein";
    query: string;
    shopLabel: string;
  }
> = {
  diets: {
    emoji: "🥗",
    title: "Diets",
    subtitle:
      "Five practical eating plans — tap a card to read, then shop matching essentials.",
    partner: "iherb",
    query: "diet electrolytes fiber omega",
    shopLabel: "Shop diet essentials →",
  },
  reviews: {
    emoji: "⭐",
    title: "Reviews",
    subtitle:
      "Five independent product picks — photos, prices, and honest takeaways.",
    partner: "myprotein",
    query: "protein creatine best sellers",
    shopLabel: "Shop top rated →",
  },
  supplements: {
    emoji: "💊",
    title: "Supplements",
    subtitle:
      "Five evidence-based guides — magnesium, omega-3, vitamins, and more.",
    partner: "iherb",
    query: "vitamins magnesium omega",
    shopLabel: "Shop supplements →",
  },
};

interface Props {
  category: "diets" | "reviews" | "supplements";
  posts: GuideCardPost[];
  limit?: number;
}

export default function CategoryGuides({
  category,
  posts,
  limit = 5,
}: Props) {
  const meta = META[category];
  if (!meta || !posts?.length) return null;

  const list = posts.slice(0, limit);

  return (
    <section className="relative overflow-hidden border-y border-leaf-100 py-14 sm:py-20">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-leaf-50 via-cream to-leaf-100/40"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-leaf-500/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-28 -left-10 h-80 w-80 rounded-full bg-leaf-600/10 blur-3xl"
        aria-hidden
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="max-w-xl">
            <p className="text-leaf-600 text-xs font-bold uppercase tracking-[0.16em] mb-2">
              {meta.emoji} Editor shelf · {meta.title}
            </p>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-bark tracking-tight">
              {`${meta.title}: top ${list.length} guides`}
            </h2>
            <p className="text-gray-500 text-sm sm:text-base mt-2 leading-relaxed">
              {meta.subtitle}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
            <span className="text-leaf-700 text-xs font-bold bg-white/80 border border-leaf-100 px-3 py-1.5 rounded-full text-center">
              {list.length} top picks
            </span>
            <AffiliateButton
              partner={meta.partner}
              source={`cat-guides-${category}`}
              query={meta.query}
              className="!py-2.5 !text-sm !px-4"
            >
              {meta.shopLabel}
            </AffiliateButton>
            <Link
              href={`/category/${category}`}
              className="inline-flex items-center justify-center text-sm font-bold text-leaf-600 no-underline hover:underline px-3 py-2"
            >
              View all {meta.title} →
            </Link>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-3 xl:grid-cols-5 md:gap-5 lg:gap-6 md:overflow-visible md:pb-0 md:snap-none md:items-stretch">
          {list.map((post, i) => (
            <GuideShelfCard
              key={post.slug}
              post={post}
              rank={i + 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
