import Link from "next/link";
import { Product } from "@/types";
import { shopLinksForProduct } from "@/lib/affiliate.js";
import {
  productBrand,
  productShortName,
  productVisual,
  reviewCountFromProduct,
  soldHintFromProduct,
  starsDisplay,
} from "@/lib/product-visual.js";

interface Props {
  product: Product;
  slug: string;
  compact?: boolean;
}

function StarRow({ rating }: { rating: number }) {
  const { full, half, empty } = starsDisplay(rating);
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-400 text-sm leading-none">
      {"★".repeat(full)}
      {half ? "⯨" : ""}
      {"☆".repeat(empty)}
    </span>
  );
}

export default function ProductShelfCard({ product, slug, compact }: Props) {
  const source = `shelf-${slug}-${product.rank}`;
  const shop = shopLinksForProduct(product, source);
  const visual = productVisual(product.name);
  const brand = productBrand(product.name);
  const title = compact ? productShortName(product.name) : product.name;
  const reviews = reviewCountFromProduct(product);
  const soldHint = soldHintFromProduct(product);

  return (
    <article
      className={`flex flex-col bg-white border rounded-2xl overflow-hidden shrink-0 snap-start transition-all duration-200 hover:shadow-lg hover:border-leaf-200 ${
        product.highlight
          ? "border-leaf-400 ring-2 ring-leaf-100"
          : "border-gray-100"
      } ${compact ? "w-[168px]" : "w-[200px] sm:w-[220px]"}`}
    >
      {/* Product image area — iHerb-style */}
      <Link
        href={shop.primaryHref}
        target="_blank"
        rel="nofollow sponsored noopener"
        className="no-underline block"
      >
        <div
          className={`relative aspect-square bg-gradient-to-br ${visual.bg} flex items-center justify-center p-4`}
        >
          {product.badge && (
            <span className="absolute top-2 left-2 text-[10px] font-bold bg-leaf-500 text-white px-2 py-0.5 rounded-full max-w-[90%] truncate">
              {product.badge}
            </span>
          )}
          <div className="text-center">
            <div className={`${compact ? "text-5xl" : "text-6xl"} mb-2 drop-shadow-sm`}>
              {visual.emoji}
            </div>
            <div className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider truncate max-w-[160px]">
              {brand}
            </div>
          </div>
        </div>
      </Link>

      <div className="p-3 flex flex-col flex-1">
        <Link
          href={shop.secondaryHref}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="text-leaf-600 text-xs font-semibold no-underline hover:underline mb-1.5"
        >
          + More options
        </Link>

        <Link
          href={shop.primaryHref}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="no-underline flex-1"
        >
          <h3 className="font-body font-semibold text-sm text-bark leading-snug line-clamp-3 mb-2 hover:text-leaf-600 transition-colors">
            {title}
          </h3>
        </Link>

        <div className="flex items-center gap-1.5 mb-1">
          <StarRow rating={product.rating} />
          <span className="text-gray-400 text-xs font-medium">
            {Number(reviews).toLocaleString()}
          </span>
        </div>

        <p className="text-gray-400 text-[11px] mb-2 truncate">{soldHint}</p>

        <div className="font-display font-black text-xl text-bark mb-3 leading-none">
          {product.price}
        </div>

        <Link
          href={shop.primaryHref}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="no-underline block w-full text-center bg-leaf-500 hover:bg-leaf-600 text-white font-bold text-xs py-2.5 rounded-lg transition-colors active:scale-[0.98]"
        >
          Add to cart →
        </Link>
      </div>
    </article>
  );
}
