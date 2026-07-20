import AffiliateButton from "./AffiliateButton";

const stores = [
  {
    partner: "iherb" as const,
    emoji: "🌿",
    name: "iHerb",
    bestFor: "Vitamins, omega-3, herbs, wellness",
    perks: ["50,000+ products", "Ships to 180+ countries", "5–10% commission tracked"],
    source: "store-guide-iherb",
    query: "best sellers supplements",
  },
  {
    partner: "myprotein" as const,
    emoji: "🥤",
    name: "MyProtein",
    bestFor: "Protein, creatine, sports nutrition",
    perks: ["Exclusive referral code", "Frequent sales", "8–10% on sports nutrition"],
    source: "store-guide-myprotein",
    query: "best sellers",
  },
];

export default function StoreGuide() {
  return (
    <section className="bg-gradient-to-b from-leaf-50/80 to-white py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display font-black text-2xl sm:text-3xl mb-2 text-center">
          Where to Buy — Our Two Trusted Stores
        </h2>
        <p className="text-gray-500 text-center mb-8 sm:mb-10 max-w-2xl mx-auto text-sm sm:text-base">
          We only link to iHerb and MyProtein. Click any button below — your
          discount code is applied automatically and we earn a small
          commission at no extra cost to you.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {stores.map((s) => (
            <div
              key={s.partner}
              className="bg-white border-2 border-leaf-100 rounded-3xl p-5 sm:p-8 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{s.emoji}</span>
                <div>
                  <div className="font-display font-black text-2xl text-bark">
                    {s.name}
                  </div>
                  <div className="text-leaf-600 text-sm font-semibold">
                    Best for: {s.bestFor}
                  </div>
                </div>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {s.perks.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-leaf-500 mt-0.5">✓</span>
                    {p}
                  </li>
                ))}
              </ul>
              <AffiliateButton
                partner={s.partner}
                source={s.source}
                query={s.query}
                className="w-full"
              >
                Shop {s.name} with Our Code →
              </AffiliateButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
