import Link from "next/link";
import AffiliateButton from "./AffiliateButton";
import AnimateOnScroll from "./AnimateOnScroll";

const paths = [
  {
    title: "Lose weight",
    desc: "Electrolytes, fiber, and appetite support that fit real life — not crash diets.",
    guideHref: "/category/diets/the-keto-diet-a-practical-beginner-guide-to-low-carb-eating-17177",
    partner: "iherb" as const,
    query: "weight management",
    source: "quick-path-weight",
    accent: "bg-leaf-50 border-leaf-100",
  },
  {
    title: "Build muscle",
    desc: "Protein, creatine, and recovery — shop MyProtein with our code pre-applied.",
    guideHref: "/category/reviews",
    partner: "myprotein" as const,
    query: "whey protein creatine",
    source: "quick-path-muscle",
    accent: "bg-white border-gray-100",
  },
  {
    title: "Sleep better",
    desc: "Magnesium glycinate, ashwagandha, and calm stacks we actually link to.",
    guideHref: "/category/supplements",
    partner: "iherb" as const,
    query: "magnesium glycinate",
    source: "quick-path-sleep",
    accent: "bg-leaf-50 border-leaf-100",
  },
];

export default function QuickPaths() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <AnimateOnScroll animation="fade-up">
        <h2 className="font-display font-black text-2xl sm:text-3xl mb-2">
          Start with your goal
        </h2>
        <p className="text-gray-500 mb-8 max-w-2xl text-sm sm:text-base">
          Pick one path — read the guide, then shop the matching products with
          our tracked discount links.
        </p>
      </AnimateOnScroll>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {paths.map((p, i) => (
          <AnimateOnScroll key={p.title} animation="fade-up" delay={i * 80}>
            <div
              className={`h-full flex flex-col rounded-2xl border p-5 sm:p-6 ${p.accent}`}
            >
              <h3 className="font-display font-bold text-xl text-bark mb-2">
                {p.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-5 flex-1">
                {p.desc}
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  href={p.guideHref}
                  className="text-center text-sm font-bold text-leaf-600 hover:underline no-underline py-2"
                >
                  Read guide →
                </Link>
                <AffiliateButton
                  partner={p.partner}
                  source={p.source}
                  query={p.query}
                  className="!py-3 !text-sm"
                >
                  Shop this goal →
                </AffiliateButton>
              </div>
            </div>
          </AnimateOnScroll>
        ))}
      </div>
    </section>
  );
}
