import Link from "next/link";
import { Product } from "@/types";
import ProductShelfCard from "./ProductShelfCard";
import AffiliateButton from "./AffiliateButton";

interface Props {
  title: string;
  subtitle?: string;
  products: Product[];
  slugPrefix: string;
  compact?: boolean;
  showStoreButtons?: boolean;
  className?: string;
}

export default function ProductShelf({
  title,
  subtitle = "Editor picks with prices you can verify in one click",
  products,
  slugPrefix,
  compact = false,
  showStoreButtons = true,
  className = "",
}: Props) {
  if (!products?.length) return null;

  const sorted = [...products].sort(
    (a, b) => (a.rank || 99) - (b.rank || 99),
  );

  return (
    <section className={`${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div className="max-w-xl">
          <p className="text-leaf-600 text-xs font-bold uppercase tracking-[0.16em] mb-2">
            Editor shelf
          </p>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-bark tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-500 text-sm sm:text-base mt-2 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-leaf-700 text-xs font-bold bg-white/80 border border-leaf-100 px-3 py-1.5 rounded-full">
            {sorted.length} top picks
          </span>
          <span className="inline md:hidden text-gray-400 text-xs">
            Swipe →
          </span>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-5 lg:gap-6 md:overflow-visible md:pb-0 md:snap-none">
        {sorted.map((product, i) => (
          <ProductShelfCard
            key={`${slugPrefix}-${product.rank}-${i}`}
            product={{ ...product, rank: product.rank || i + 1 }}
            slug={`${slugPrefix}-${product.rank || i}`}
            compact={compact}
          />
        ))}
      </div>

      {showStoreButtons && (
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <AffiliateButton
            partner="iherb"
            source={`shelf-${slugPrefix}`}
            query={sorted[0]?.name?.split(",")[0]}
            className="sm:w-auto sm:min-w-[220px] !py-3.5 !text-sm !px-8 min-h-[48px]"
          >
            🌿 View all on iHerb →
          </AffiliateButton>
          <AffiliateButton
            partner="myprotein"
            source={`shelf-${slugPrefix}`}
            variant="outline"
            className="sm:w-auto sm:min-w-[220px] !py-3.5 !text-sm !px-8 !bg-white min-h-[48px]"
          >
            🥤 View all on MyProtein →
          </AffiliateButton>
        </div>
      )}

      <p className="text-center text-gray-400 text-xs mt-4">
        Affiliate links — we may earn a commission.{" "}
        <Link
          href="/affiliate-disclosure"
          className="text-leaf-600 no-underline hover:underline"
        >
          Disclosure
        </Link>
      </p>
    </section>
  );
}
