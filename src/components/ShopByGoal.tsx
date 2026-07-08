import Link from "next/link";
import AffiliateButton from "./AffiliateButton";

const goals = [
  {
    emoji: "💪",
    title: "Build Muscle",
    desc: "Protein, creatine & recovery",
    partner: "myprotein" as const,
    query: "whey protein",
    source: "shop-goal-muscle",
  },
  {
    emoji: "⚖️",
    title: "Lose Weight",
    desc: "Metabolism & appetite support",
    partner: "iherb" as const,
    query: "weight management supplements",
    source: "shop-goal-weight",
  },
  {
    emoji: "⚡",
    title: "More Energy",
    desc: "Vitamins, B12 & adaptogens",
    partner: "iherb" as const,
    query: "energy supplements",
    source: "shop-goal-energy",
  },
  {
    emoji: "❤️",
    title: "Heart Health",
    desc: "Omega-3, magnesium & fiber",
    partner: "iherb" as const,
    query: "omega 3 fish oil",
    source: "shop-goal-heart",
  },
  {
    emoji: "🧠",
    title: "Brain & Focus",
    desc: "Omega-3, magnesium L-threonate",
    partner: "iherb" as const,
    query: "brain health supplements",
    source: "shop-goal-brain",
  },
  {
    emoji: "🛌",
    title: "Sleep Better",
    desc: "Magnesium, melatonin & calm",
    partner: "iherb" as const,
    query: "sleep supplements",
    source: "shop-goal-sleep",
  },
];

export default function ShopByGoal() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h2 className="font-display font-black text-3xl mb-2">
        Shop by Goal
      </h2>
      <p className="text-gray-500 mb-8 max-w-2xl">
        Jump straight to the supplements people buy most for each goal — every
        link goes through our tracked iHerb or MyProtein offer.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((g) => (
          <div
            key={g.source}
            className="group bg-white border border-gray-100 rounded-2xl p-5 hover:border-leaf-200 hover:shadow-sm transition-all flex flex-col"
          >
            <div className="text-3xl mb-2">{g.emoji}</div>
            <div className="font-display font-bold text-lg text-bark mb-1">
              {g.title}
            </div>
            <p className="text-gray-500 text-sm mb-4 flex-1">{g.desc}</p>
            <AffiliateButton
              partner={g.partner}
              source={g.source}
              query={g.query}
              className="w-full !py-2.5 !text-sm"
            >
              Shop {g.title} →
            </AffiliateButton>
          </div>
        ))}
      </div>
    </section>
  );
}
