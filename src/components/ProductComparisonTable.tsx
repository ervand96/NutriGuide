import Link from "next/link";
import type { Product } from "@/types";
import { shopLinksForProduct } from "@/lib/affiliate.js";

export default function ProductComparisonTable({
  products,
  slug,
}: {
  products: Product[];
  slug: string;
}) {
  if (!products?.length) return null;

  const rows = [...products]
    .sort((a, b) => (a.rank || 99) - (b.rank || 99))
    .slice(0, 5);

  return (
    <section className="mb-8 sm:mb-10">
      <h2 className="font-display font-black text-xl sm:text-2xl text-bark mb-1">
        Quick comparison
      </h2>
      <p className="text-gray-500 text-sm mb-4">
        Side-by-side snapshot before you dig into the full reviews.
      </p>

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-3">
        {rows.map((p) => {
          const shop = shopLinksForProduct(p, `compare-${slug}-${p.rank}`);
          return (
            <div
              key={p.rank}
              className={`rounded-2xl border p-4 ${
                p.highlight
                  ? "border-leaf-500 bg-leaf-50/50"
                  : "border-gray-100 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="text-xs font-bold text-leaf-600 uppercase tracking-wide">
                    #{p.rank} {p.badge}
                  </div>
                  <div className="font-display font-bold text-bark text-sm leading-snug mt-0.5">
                    {p.name}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-display font-black text-leaf-600">
                    {p.price}
                  </div>
                  <div className="text-amber-400 text-xs">★ {p.rating}</div>
                </div>
              </div>
              <Link
                href={shop.primaryHref}
                target="_blank"
                rel="nofollow sponsored noopener"
                className="no-underline block text-center bg-leaf-500 hover:bg-leaf-600 text-white font-bold text-sm py-3 rounded-xl active:scale-[0.98]"
              >
                {shop.primaryLabel}
              </Link>
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-leaf-50">
              <th className="px-5 py-3.5 font-display font-bold text-bark text-sm">
                Rank
              </th>
              <th className="px-5 py-3.5 font-display font-bold text-bark text-sm">
                Product
              </th>
              <th className="px-5 py-3.5 font-display font-bold text-bark text-sm">
                Rating
              </th>
              <th className="px-5 py-3.5 font-display font-bold text-bark text-sm">
                Price
              </th>
              <th className="px-5 py-3.5 font-display font-bold text-bark text-sm">
                Shop
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p, i) => {
              const shop = shopLinksForProduct(p, `compare-${slug}-${p.rank}`);
              return (
                <tr
                  key={p.rank}
                  className={
                    p.highlight
                      ? "bg-leaf-50/60"
                      : i % 2 === 0
                        ? "bg-white"
                        : "bg-gray-50/50"
                  }
                >
                  <td className="px-5 py-4 text-sm font-bold text-leaf-600 whitespace-nowrap">
                    #{p.rank}
                    {p.badge ? (
                      <span className="block text-xs font-semibold text-gray-500 normal-case tracking-normal mt-0.5">
                        {p.badge}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-5 py-4 text-sm font-bold text-bark max-w-xs">
                    {p.name}
                  </td>
                  <td className="px-5 py-4 text-sm text-amber-500 whitespace-nowrap">
                    ★ {p.rating}
                  </td>
                  <td className="px-5 py-4 text-sm font-display font-black text-leaf-600 whitespace-nowrap">
                    {p.price}
                  </td>
                  <td className="px-5 py-4 text-sm whitespace-nowrap">
                    <Link
                      href={shop.primaryHref}
                      target="_blank"
                      rel="nofollow sponsored noopener"
                      className="text-leaf-600 font-semibold hover:underline no-underline"
                    >
                      Check price →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
