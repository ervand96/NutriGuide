import Link from "next/link";
import AnimateOnScroll from "./AnimateOnScroll";
import AffiliateButton from "./AffiliateButton";

interface Guide {
  title: string;
  description: string;
  href: string;
  category: string;
  shop?: { partner: "iherb" | "myprotein"; q: string };
}

export default function TrendingGuides({ guides }: { guides: Guide[] }) {
  if (!guides?.length) return null;

  return (
    <section className="bg-white border-y border-gray-100 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <AnimateOnScroll animation="fade-up">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <h2 className="font-display font-black text-2xl sm:text-3xl mb-1">
              Trending guides this week
            </h2>
            <p className="text-gray-500 text-sm sm:text-base">
              Most-read topics — jump in, then shop the matching stack.
            </p>
          </div>
        </div>
      </AnimateOnScroll>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {guides.map((g, i) => (
          <AnimateOnScroll key={g.href} animation="fade-up" delay={i * 80}>
            <article className="h-full flex flex-col bg-cream border border-gray-100 rounded-2xl p-5 sm:p-6 hover:border-leaf-200 hover:shadow-md transition-all duration-300">
              <span className="category-badge mb-3 w-fit">{g.category}</span>
              <Link href={g.href} className="no-underline flex-1 group">
                <h3 className="font-display font-bold text-lg text-bark mb-2 group-hover:text-leaf-600 transition-colors leading-snug">
                  {g.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">
                  {g.description}
                </p>
                <span className="text-leaf-600 font-bold text-sm">
                  Read guide →
                </span>
              </Link>
              {g.shop && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <AffiliateButton
                    partner={g.shop.partner}
                    source="trending-guide"
                    query={g.shop.q}
                    className="w-full !py-2.5 !text-xs"
                  >
                    Shop related →
                  </AffiliateButton>
                </div>
              )}
            </article>
          </AnimateOnScroll>
        ))}
      </div>
      </div>
    </section>
  );
}
