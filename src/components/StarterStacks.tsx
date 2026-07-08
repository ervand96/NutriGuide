import Link from "next/link";
import AnimateOnScroll from "./AnimateOnScroll";

const stacks = [
  {
    emoji: "💪",
    title: "Muscle Starter Stack",
    desc: "Everything you need to start building — protein, creatine, and recovery.",
    partner: "myprotein" as const,
    items: ["Whey Protein", "Creatine Monohydrate", "Pre-Workout"],
    source: "stack-muscle",
    query: "whey protein creatine",
  },
  {
    emoji: "🌿",
    title: "Daily Wellness Stack",
    desc: "Cover the basics most people miss — multivitamin, omega-3, and vitamin D.",
    partner: "iherb" as const,
    items: ["Multivitamin", "Omega-3 Fish Oil", "Vitamin D3"],
    source: "stack-wellness",
    query: "multivitamin omega 3 vitamin d",
  },
  {
    emoji: "😴",
    title: "Sleep & Recovery Stack",
    desc: "Better sleep and less stress — magnesium, ashwagandha, and melatonin.",
    partner: "iherb" as const,
    items: ["Magnesium Glycinate", "Ashwagandha KSM-66", "Melatonin"],
    source: "stack-sleep",
    query: "magnesium ashwagandha sleep",
  },
];

export default function StarterStacks() {
  return (
    <section className="bg-gradient-to-b from-leaf-50/80 to-cream py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <AnimateOnScroll animation="fade-up">
          <h2 className="font-display font-black text-2xl sm:text-3xl mb-2">
            Starter Stacks by Goal
          </h2>
          <p className="text-gray-500 mb-8 max-w-2xl text-sm sm:text-base">
            Curated 3-product bundles — click once and browse the full stack on
            the right store. No guesswork, no filler.
          </p>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {stacks.map((s, i) => (
            <AnimateOnScroll key={s.source} animation="fade-up" delay={i * 100}>
              <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 h-full flex flex-col hover:border-leaf-200 hover:shadow-md transition-all duration-300">
                <div className="text-3xl mb-3">{s.emoji}</div>
                <h3 className="font-display font-bold text-lg text-bark mb-1">
                  {s.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4 flex-1">{s.desc}</p>
                <ul className="space-y-1.5 mb-5">
                  {s.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <span className="text-leaf-500 font-bold">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/go/${s.partner}?source=${s.source}&q=${encodeURIComponent(s.query)}`}
                  target="_blank"
                  rel="nofollow sponsored noopener"
                  className="block text-center bg-leaf-500 hover:bg-leaf-600 text-white font-bold py-3 rounded-xl no-underline transition-colors text-sm sm:text-base"
                >
                  Shop Stack on {s.partner === "iherb" ? "iHerb" : "MyProtein"} →
                </Link>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
