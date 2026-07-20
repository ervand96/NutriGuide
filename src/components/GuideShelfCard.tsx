import Link from "next/link";
import { shopLinksForProduct } from "@/lib/affiliate.js";
import {
  productBrand,
  productShortName,
  productVisual,
  reviewCountFromProduct,
  soldHintFromProduct,
  starsDisplay,
} from "@/lib/product-visual.js";

export type GuideCardPost = {
  slug: string;
  title: string;
  category: string;
  description: string;
  readTime?: string;
  date?: string;
  products?: Array<{
    name?: string;
    imageUrl?: string;
    price?: string;
    rating?: number;
    badge?: string;
    description?: string;
    pros?: string[];
    cons?: string[];
    affiliateUrl?: string;
    buttonText?: string;
    rank?: number;
  }>;
};

const BOTTLE_COVERS = [
  { match: /ashwagandha|adaptogen|ksm/i, src: "/products/bottle-ashwagandha.jpg" },
  { match: /creatine|protein|whey|pre-workout|pre workout/i, src: "/products/bottle-creatine.jpg" },
  { match: /omega|fish oil|dha|epa|mct|plant-based|vegan|mediterranean/i, src: "/products/bottle-omega.jpg" },
  { match: /magnesium|electrolyte|hydration|dash|mind|keto/i, src: "/products/bottle-magnesium.jpg" },
  { match: /zinc/i, src: "/products/bottle-zinc.jpg" },
  { match: /vitamin d|d3|multi|popular diet/i, src: "/products/bottle-vitamin-d.jpg" },
  { match: /b-?12|probiotic|fiber|psyllium/i, src: "/products/bottle-zinc.jpg" },
];

const CATEGORY_DEFAULT: Record<string, string> = {
  diets: "/products/bottle-omega.jpg",
  reviews: "/products/bottle-creatine.jpg",
  supplements: "/products/bottle-magnesium.jpg",
};

const CATEGORY_BADGE: Record<string, string> = {
  diets: "Diet Guide",
  reviews: "Best Overall",
  supplements: "Editor Pick",
};

function bottleCover(post: GuideCardPost, productName?: string) {
  const haystack = [post.title, productName || "", post.category].join(" ");
  for (const row of BOTTLE_COVERS) {
    if (row.match.test(haystack)) return row.src;
  }
  const existing = post.products?.find((p) =>
    p.imageUrl?.includes("/products/bottle-"),
  )?.imageUrl;
  if (existing) return existing;
  return (
    CATEGORY_DEFAULT[post.category.toLowerCase()] ||
    "/products/bottle-vitamin-d.jpg"
  );
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

export default function GuideShelfCard({
  post,
  rank,
}: {
  post: GuideCardPost;
  rank: number;
}) {
  const guideHref = `/category/${post.category.toLowerCase()}/${post.slug}`;
  const raw = post.products?.[0];
  const productName = raw?.name || post.title.split(":")[0].trim();
  const product = {
    rank,
    name: productName,
    badge: raw?.badge || CATEGORY_BADGE[post.category.toLowerCase()] || "Top Pick",
    rating: raw?.rating || 4.8,
    price: raw?.price || "See deal",
    description: raw?.description || post.description,
    pros: raw?.pros || [],
    cons: raw?.cons || [],
    affiliateUrl: raw?.affiliateUrl || "",
    buttonText: raw?.buttonText || "",
    imageUrl: raw?.imageUrl?.includes("/products/bottle-")
      ? raw.imageUrl
      : bottleCover(post, productName),
    highlight: rank === 1,
  };

  const source = `guide-shelf-${post.slug}`;
  const shop = shopLinksForProduct(product, source);
  const visual = productVisual(product.name);
  const brand = productBrand(product.name);
  const title = productShortName(product.name);
  const reviews = reviewCountFromProduct(product);
  const soldHint = soldHintFromProduct(product);
  const imageUrl = product.imageUrl;

  return (
    <article
      className={`group flex flex-col shrink-0 snap-start overflow-hidden rounded-3xl bg-white/90 backdrop-blur-sm border border-white shadow-[0_8px_30px_rgba(44,36,22,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(45,122,58,0.12)] w-[min(200px,78vw)] sm:w-[220px] md:w-full ${
        product.highlight ? "ring-2 ring-leaf-400/70" : ""
      }`}
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
          <span className="absolute top-3 right-3 z-10 text-[10px] font-bold bg-white/95 text-leaf-700 px-2.5 py-1 rounded-full max-w-[55%] truncate shadow-sm">
            {product.badge}
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-contain p-4 sm:p-6 bg-white transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
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
          <span className="text-gray-400 text-xs font-medium">
            {Number(reviews).toLocaleString()}
          </span>
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
          href={guideHref}
          className="mt-2 inline-flex min-h-[44px] w-full items-center justify-center text-sm font-semibold text-leaf-600 no-underline hover:underline"
        >
          Read full guide →
        </Link>
      </div>
    </article>
  );
}
