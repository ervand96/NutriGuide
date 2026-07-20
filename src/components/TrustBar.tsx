const items = [
  { label: "Independent reviews", hint: "No paid rankings" },
  { label: "Discount applied", hint: "On every shop click" },
  { label: "iHerb + MyProtein", hint: "Two stores only" },
  { label: "Updated for 2026", hint: "Fresh product picks" },
];

export default function TrustBar({ reviewsCount }: { reviewsCount: number }) {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item, i) => (
            <div
              key={item.label}
              className="text-center sm:text-left sm:flex sm:items-start sm:gap-3"
            >
              <div className="hidden sm:flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-leaf-50 text-leaf-600 font-display font-black text-sm">
                {i === 0 ? reviewsCount : String(i + 1).padStart(2, "0")}
              </div>
              <div>
                <div className="font-display font-bold text-bark text-sm sm:text-base">
                  {i === 0 ? `${reviewsCount}+ reviews` : item.label}
                </div>
                <div className="text-gray-400 text-xs mt-0.5">{item.hint}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
