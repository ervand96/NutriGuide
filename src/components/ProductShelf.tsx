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
  subtitle = "Swipe to browse — prices & ratings at a glance",
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
      <div className="flex items-end justify-between gap-3 mb-4">
        <div>
          <h2 className="font-display font-black text-xl sm:text-3xl text-bark">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
          )}
        </div>
        <span className="text-leaf-600 text-xs font-bold bg-leaf-50 px-2 py-1 rounded-full shrink-0">
          {sorted.length} picks
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 md:gap-4 md:overflow-visible md:pb-0 md:snap-none">
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
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <AffiliateButton
            partner="iherb"
            source={`shelf-${slugPrefix}`}
            query={sorted[0]?.name?.split(",")[0]}
            className="sm:w-auto sm:min-w-[220px] !py-3 !text-sm !px-8"
          >
            🌿 View all on iHerb →
          </AffiliateButton>
          <AffiliateButton
            partner="myprotein"
            source={`shelf-${slugPrefix}`}
            variant="outline"
            className="sm:w-auto sm:min-w-[220px] !py-3 !text-sm !px-8"
          >
            🥤 View all on MyProtein →
          </AffiliateButton>
        </div>
      )}

      <p className="text-center text-gray-400 text-xs mt-3">
        Affiliate links — we may earn a commission.{" "}
        <Link href="/affiliate-disclosure" className="text-leaf-600 no-underline hover:underline">
          Disclosure
        </Link>
      </p>
    </section>
  );
}
