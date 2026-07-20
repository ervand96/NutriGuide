import Link from "next/link";
import { Article } from "@/types";
import ArticleCard from "./ArticleCard";
import AffiliateButton from "./AffiliateButton";
import AnimateOnScroll from "./AnimateOnScroll";

const META: Record<
  string,
  {
    emoji: string;
    title: string;
    subtitle: string;
    partner: "iherb" | "myprotein";
    query: string;
    shopLabel: string;
    tone: string;
  }
> = {
  diets: {
    emoji: "🥗",
    title: "Diets",
    subtitle: "Practical eating plans — keto, Mediterranean, IF, and more.",
    partner: "iherb",
    query: "diet electrolytes fiber omega",
    shopLabel: "Shop diet essentials →",
    tone: "from-leaf-50 to-white",
  },
  reviews: {
    emoji: "⭐",
    title: "Reviews",
    subtitle: "Independent product picks ranked by ingredients, not hype.",
    partner: "myprotein",
    query: "protein creatine best sellers",
    shopLabel: "Shop top rated →",
    tone: "from-amber-50/80 to-white",
  },
  supplements: {
    emoji: "💊",
    title: "Supplements",
    subtitle: "What actually works — magnesium, omega-3, vitamins, and stacks.",
    partner: "iherb",
    query: "vitamins magnesium omega",
    shopLabel: "Shop supplements →",
    tone: "from-sky-50/80 to-white",
  },
};

interface Props {
  category: "diets" | "reviews" | "supplements";
  posts: Article[];
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
    <section className={`border-y border-gray-100 bg-gradient-to-b ${meta.tone} py-12 sm:py-16`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <AnimateOnScroll animation="fade-up">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <p className="text-leaf-600 text-xs font-bold uppercase tracking-[0.16em] mb-2">
                {meta.emoji} Browse {meta.title}
              </p>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-bark">
                {`${meta.title}: top ${list.length} guides`}
              </h2>
              <p className="text-gray-500 text-sm sm:text-base mt-1 max-w-xl">
                {meta.subtitle}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
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
        </AnimateOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {list.map((post, i) => (
            <AnimateOnScroll key={post.slug} animation="fade-up" delay={i * 60}>
              <ArticleCard article={post} />
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
