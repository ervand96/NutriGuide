import AffiliateButton from "./AffiliateButton";
import AnimateOnScroll from "./AnimateOnScroll";

const steps = [
  {
    n: "01",
    title: "Read our guides",
    desc: "Short, evidence-based reviews — no hype, no paid rankings.",
  },
  {
    n: "02",
    title: "Click a shop button",
    desc: "Every product link goes to iHerb or MyProtein with our discount applied.",
  },
  {
    n: "03",
    title: "Buy & save",
    desc: "You pay the same price (or less). We earn a small commission at no extra cost.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white border-y border-gray-100 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <AnimateOnScroll animation="fade-up">
          <h2 className="font-display font-black text-2xl sm:text-3xl mb-2">
            How shopping with NutriGuide works
          </h2>
          <p className="text-gray-500 mb-10 max-w-2xl text-sm sm:text-base">
            Three steps. No account required. Your discount code is applied
            automatically when you click through.
          </p>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 mb-10 relative">
          <div
            className="hidden md:block absolute top-8 left-[16%] right-[16%] h-px bg-gradient-to-r from-leaf-100 via-leaf-300 to-leaf-100"
            aria-hidden
          />
          {steps.map((s, i) => (
            <AnimateOnScroll key={s.n} animation="fade-up" delay={i * 90}>
              <div className="relative h-full text-center md:text-left">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-leaf-50 border border-leaf-100 font-display font-black text-leaf-600 text-lg mb-4 relative z-10">
                  {s.n}
                </div>
                <h3 className="font-display font-bold text-lg text-bark mb-2">
                  {s.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
                  {s.desc}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <AffiliateButton
            partner="iherb"
            source="how-it-works"
            className="sm:min-w-[200px] !py-3.5"
          >
            🌿 Start on iHerb →
          </AffiliateButton>
          <AffiliateButton
            partner="myprotein"
            source="how-it-works"
            variant="outline"
            className="sm:min-w-[200px] !py-3.5"
          >
            🥤 Start on MyProtein →
          </AffiliateButton>
        </div>
      </div>
    </section>
  );
}
