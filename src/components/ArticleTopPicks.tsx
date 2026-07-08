import Link from "next/link";
import { Product } from "@/types";
import { shopLinksForProduct } from "@/lib/affiliate.js";

export default function ArticleTopPicks({
  products,
  slug,
}: {
  products: Product[];
  slug: string;
}) {
  if (!products?.length) return null;

  const sorted = [...products].sort(
    (a, b) => (a.rank || 99) - (b.rank || 99),
  );

  return (
    <section className="mb-8 sm:mb-10">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="font-display font-black text-xl sm:text-2xl text-bark">
          Top Picks & Prices
        </h2>
        <span className="text-gray-400 text-xs sm:text-sm shrink-0">
          {sorted.length} product{sorted.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {sorted.map((product) => {
          const source = `top-strip-${slug}-${product.rank}`;
          const shop = shopLinksForProduct(product, source);
          return (
            <div
              key={product.rank}
              className={`bg-white border-2 rounded-2xl p-4 sm:p-5 ${
                product.highlight
                  ? "border-leaf-500 shadow-sm shadow-leaf-100"
                  : "border-gray-100"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-bold bg-leaf-500 text-white px-2 py-0.5 rounded-full">
                      #{product.rank}
                    </span>
                    {product.badge && (
                      <span className="text-xs font-bold text-leaf-600 bg-leaf-50 px-2 py-0.5 rounded-full">
                        {product.badge}
                      </span>
                    )}
                    {product.rating && (
                      <span className="text-amber-500 text-xs font-bold">
                        ★ {product.rating}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display font-bold text-sm sm:text-base text-bark leading-snug">
                    {product.name}
                  </h3>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                    From
                  </div>
                  <div className="font-display font-black text-2xl sm:text-3xl text-leaf-600 leading-none">
                    {product.price}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Link
                  href={shop.primaryHref}
                  target="_blank"
                  rel="nofollow sponsored noopener"
                  className="no-underline flex-1 text-center bg-leaf-500 hover:bg-leaf-600 text-white font-bold py-3 rounded-xl text-sm transition-colors active:scale-[0.98]"
                >
                  {shop.primaryLabel}
                </Link>
                <Link
                  href={shop.secondaryHref}
                  target="_blank"
                  rel="nofollow sponsored noopener"
                  className="no-underline flex-1 text-center border-2 border-leaf-500 text-leaf-600 hover:bg-leaf-50 font-bold py-3 rounded-xl text-sm transition-colors active:scale-[0.98]"
                >
                  {shop.secondaryLabel}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
