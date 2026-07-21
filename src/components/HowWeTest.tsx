const CRITERIA = [
  {
    title: "Dose & form",
    desc: "We check clinically useful doses and absorbable forms — not filler-heavy labels.",
  },
  {
    title: "Transparency",
    desc: "Clear ingredient lists beat proprietary blends. We flag vague formulas.",
  },
  {
    title: "Testing & reputation",
    desc: "Third-party testing, brand track record, and consistent customer feedback matter.",
  },
  {
    title: "Value",
    desc: "Price per effective serving — not just the sticker price on the bottle.",
  },
];

export default function HowWeTest({ category }: { category: string }) {
  const cat = category.toLowerCase();
  if (cat !== "reviews" && cat !== "supplements") return null;

  return (
    <section className="mb-8 sm:mb-10 rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
      <h2 className="font-display font-black text-lg sm:text-xl text-bark mb-1">
        How we evaluate these picks
      </h2>
      <p className="text-gray-500 text-sm mb-4 leading-relaxed">
        Brands cannot pay for a higher ranking. We use the same checklist on
        every supplement review.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CRITERIA.map((c) => (
          <div
            key={c.title}
            className="rounded-xl bg-leaf-50/70 border border-leaf-100 px-4 py-3"
          >
            <div className="font-display font-bold text-bark text-sm mb-0.5">
              {c.title}
            </div>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
              {c.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
