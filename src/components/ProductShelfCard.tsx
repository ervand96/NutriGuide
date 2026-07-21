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
    <span className="inline-flex items-center gap-0.5 text-amber-500 text-[13px] leading-none tracking-tight">
      {"★".repeat(full)}
      {half ? "⯨" : ""}
      <span className="text-gray-300">{"☆".repeat(empty)}</span>
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
  const imageUrl = product.imageUrl || null;
  const rank = product.rank || 1;

  return (
    <article
      className={`group flex flex-col shrink-0 snap-start overflow-hidden rounded-3xl bg-white/90 backdrop-blur-sm border border-white shadow-[0_8px_30px_rgba(44,36,22,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(45,122,58,0.12)] ${
        product.highlight ? "ring-2 ring-leaf-400/70" : ""
      } ${compact ? "w-[min(200px,78vw)] sm:w-[220px] md:w-full" : "w-[min(220px,78vw)] sm:w-[240px] md:w-full"}`}
    >
      <Link
        href={shop.primaryHref}
        target="_blank"
        rel="nofollow sponsored noopener"
        className="no-underline block relative"
      >
        <div
          className={`relative aspect-[4/5] bg-gradient-to-br ${visual.bg} flex items-center justify-center overflow-hidden`}
        >
          <span className="absolute top-3 left-3 z-10 h-8 w-8 flex items-center justify-center rounded-full bg-bark/90 text-white text-xs font-display font-black">
            {rank}
          </span>
          {product.badge && (
            <span className="absolute top-3 right-3 z-10 text-[10px] font-bold bg-white/95 text-leaf-700 px-2.5 py-1 rounded-full max-w-[55%] truncate shadow-sm">
              {product.badge}
            </span>
          )}
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-contain p-4 sm:p-6 bg-white transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="text-center p-5">
              <div
                className={`${compact ? "text-5xl" : "text-6xl"} mb-3 drop-shadow-sm transition-transform duration-500 group-hover:scale-110`}
              >
                {visual.emoji}
              </div>
              <div className="text-[10px] sm:text-xs font-bold text-bark/50 uppercase tracking-[0.14em] truncate max-w-[160px] mx-auto">
                {brand}
              </div>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-leaf-600 mb-1.5">
          {brand}
        </p>

        <Link
          href={shop.primaryHref}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="no-underline flex-1"
        >
          <h3 className="font-display font-bold text-[15px] sm:text-base text-bark leading-snug line-clamp-2 mb-3 group-hover:text-leaf-600 transition-colors">
            {title}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mb-1">
          <StarRow rating={product.rating} />
          {reviews ? (
            <span className="text-gray-400 text-xs font-medium">
              {Number(reviews).toLocaleString()}
            </span>
          ) : null}
        </div>
        <p className="text-gray-400 text-[11px] mb-4 truncate">{soldHint}</p>

        <div className="mt-auto flex items-end justify-between gap-3 mb-3">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-0.5">
              From
            </div>
            <div className="font-display font-black text-2xl text-bark leading-none">
              {product.price}
            </div>
          </div>
        </div>

        <Link
          href={shop.primaryHref}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="no-underline flex min-h-[44px] w-full items-center justify-center bg-leaf-500 hover:bg-leaf-600 text-white font-bold text-sm py-3 rounded-xl transition-colors active:scale-[0.98]"
        >
          Check price →
        </Link>
        <Link
          href={shop.secondaryHref}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="mt-2 inline-flex min-h-[44px] w-full items-center justify-center text-sm font-semibold text-leaf-600 no-underline hover:underline"
        >
          {shop.secondaryLabel}
        </Link>
      </div>
    </article>
  );
}
