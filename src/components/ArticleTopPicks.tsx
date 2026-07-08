import Link from "next/link";
import { Product } from "@/types";
import ProductShelfCard from "./ProductShelfCard";
import AffiliateButton from "./AffiliateButton";

export default function ArticleTopPicks({
  products,
  slug,
  category = "Supplements",
}: {
  products: Product[];
  slug: string;
  category?: string;
}) {
  if (!products?.length) return null;

  const sorted = [...products].sort(
    (a, b) => (a.rank || 99) - (b.rank || 99),
  );

  return (
    <section className="mb-8 sm:mb-10 -mx-4 sm:mx-0">
      <div className="px-4 sm:px-0 flex items-end justify-between gap-3 mb-4">
        <div>
          <h2 className="font-display font-black text-xl sm:text-2xl text-bark">
            Shop Our Top Picks
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Swipe to compare — prices & ratings at a glance
          </p>
        </div>
        <span className="text-leaf-600 text-xs font-bold bg-leaf-50 px-2 py-1 rounded-full shrink-0">
          {sorted.length} picks
        </span>
      </div>

      {/* Horizontal shelf — iHerb-style scroll */}
      <div className="flex gap-3 overflow-x-auto pb-2 px-4 sm:px-0 snap-x snap-mandatory scrollbar-hide">
        {sorted.map((product) => (
          <ProductShelfCard
            key={product.rank}
            product={product}
            slug={slug}
          />
        ))}
      </div>

      <div className="px-4 sm:px-0 mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
        <AffiliateButton
          partner="iherb"
          source={`shelf-all-${slug}`}
          query={sorted[0]?.name?.split(",")[0]}
          className="flex-1 !py-3 !text-sm"
        >
          🌿 View all on iHerb →
        </AffiliateButton>
        <AffiliateButton
          partner="myprotein"
          source={`shelf-all-${slug}`}
          variant="outline"
          className="flex-1 !py-3 !text-sm"
        >
          🥤 View all on MyProtein →
        </AffiliateButton>
      </div>

      <p className="px-4 sm:px-0 text-center text-gray-400 text-xs mt-3">
        Affiliate links — we may earn a commission at no extra cost to you.{" "}
        <Link href="/affiliate-disclosure" className="text-leaf-600 no-underline hover:underline">
          Disclosure
        </Link>
      </p>
    </section>
  );
}
