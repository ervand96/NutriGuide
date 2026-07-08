import Link from "next/link";

export interface DietRow {
  name: string;
  difficulty: string;
  bestFor: string;
  avgCost: string;
  href?: string;
  shop?: { partner: "iherb" | "myprotein"; q: string; source: string };
}

export default function DietComparisonCards({ diets }: { diets: DietRow[] }) {
  return (
    <div className="md:hidden flex flex-col gap-4">
      {diets.map((d) => (
        <div
          key={d.name}
          className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="font-display font-bold text-lg text-bark">
              {d.href ? (
                <Link href={d.href} className="text-leaf-600 no-underline">
                  {d.name}
                </Link>
              ) : (
                d.name
              )}
            </h3>
            <span className="text-xs font-bold bg-leaf-50 text-leaf-600 px-2 py-1 rounded-full shrink-0">
              {d.difficulty}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
            <div>
              <div className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">
                Best for
              </div>
              <div className="text-gray-600">{d.bestFor}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">
                Cost
              </div>
              <div className="text-gray-600">{d.avgCost}</div>
            </div>
          </div>
          {d.shop ? (
            <Link
              href={`/go/${d.shop.partner}?source=${d.shop.source}&q=${encodeURIComponent(d.shop.q)}`}
              target="_blank"
              rel="nofollow sponsored noopener"
              className="block text-center bg-leaf-500 hover:bg-leaf-600 text-white font-bold py-2.5 rounded-xl no-underline text-sm transition-colors"
            >
              Shop {d.name} Essentials →
            </Link>
          ) : (
            <Link
              href="/quiz"
              className="block text-center border-2 border-leaf-500 text-leaf-600 font-bold py-2.5 rounded-xl no-underline text-sm"
            >
              Find My Diet →
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
