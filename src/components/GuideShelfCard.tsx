import Link from "next/link";

export type GuideCardPost = {
  slug: string;
  title: string;
  category: string;
  description: string;
  readTime?: string;
  date?: string;
  products?: Array<{ name?: string; imageUrl?: string; price?: string; rating?: number }>;
};

/** Only clean bottle product shots — no busy lifestyle photos */
const BOTTLE_COVERS = [
  { match: /ashwagandha|adaptogen|ksm/i, src: "/products/bottle-ashwagandha.jpg" },
  { match: /creatine|protein|whey|pre-workout|pre workout/i, src: "/products/bottle-creatine.jpg" },
  { match: /omega|fish oil|dha|epa|mct|plant-based|vegan|mediterranean/i, src: "/products/bottle-omega.jpg" },
  { match: /magnesium|electrolyte|hydration|dash|mind|keto/i, src: "/products/bottle-magnesium.jpg" },
  { match: /zinc/i, src: "/products/bottle-zinc.jpg" },
  { match: /vitamin d|d3|multi|popular diet|diet/i, src: "/products/bottle-vitamin-d.jpg" },
  { match: /b-?12|probiotic|fiber|psyllium/i, src: "/products/bottle-zinc.jpg" },
];

const CATEGORY_DEFAULT: Record<string, string> = {
  diets: "/products/bottle-omega.jpg",
  reviews: "/products/bottle-creatine.jpg",
  supplements: "/products/bottle-magnesium.jpg",
};

function bottleCoverForGuide(post: GuideCardPost) {
  const haystack = [
    post.title,
    post.products?.[0]?.name || "",
    post.category,
  ].join(" ");

  for (const row of BOTTLE_COVERS) {
    if (row.match.test(haystack)) return row.src;
  }

  // Prefer a bottle imageUrl if it already points to /products/bottle-
  const existing = post.products?.find((p) =>
    p.imageUrl?.includes("/products/bottle-"),
  )?.imageUrl;
  if (existing) return existing;

  return (
    CATEGORY_DEFAULT[post.category.toLowerCase()] ||
    "/products/bottle-vitamin-d.jpg"
  );
}

function categoryShop(
  category: string,
): { partner: "iherb" | "myprotein"; query: string } {
  const c = category.toLowerCase();
  if (c === "reviews") {
    return { partner: "myprotein", query: "best sellers protein" };
  }
  if (c === "supplements") {
    return { partner: "iherb", query: "vitamins minerals supplements" };
  }
  return { partner: "iherb", query: "diet electrolytes omega" };
}

export default function GuideShelfCard({
  post,
  rank,
}: {
  post: GuideCardPost;
  rank: number;
}) {
  const href = `/category/${post.category.toLowerCase()}/${post.slug}`;
  const imageUrl = bottleCoverForGuide(post);
  const product = post.products?.[0];
  const fallback = categoryShop(post.category);
  const shopPartner = product?.name
    ? /protein|creatine|whey|pre-workout/i.test(product.name)
      ? "myprotein"
      : "iherb"
    : fallback.partner;
  const shopQuery = product?.name || fallback.query;
  const shopHref = `/go/${shopPartner}?source=guide-shelf&q=${encodeURIComponent(shopQuery)}`;
  const price = product?.price || "See price";

  return (
    <article className="group flex flex-col h-full shrink-0 snap-start overflow-hidden rounded-3xl bg-white border border-leaf-100/80 shadow-[0_8px_30px_rgba(44,36,22,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(45,122,58,0.12)] w-[210px] sm:w-[230px] md:w-full min-h-[480px]">
      <Link href={href} className="no-underline block relative shrink-0">
        <div className="relative aspect-square bg-white flex items-center justify-center overflow-hidden border-b border-gray-50">
          <span className="absolute top-3 left-3 z-10 h-8 w-8 flex items-center justify-center rounded-full bg-bark text-white text-xs font-display font-black">
            {rank}
          </span>
          <span className="absolute top-3 right-3 z-10 text-[10px] font-bold bg-leaf-50 text-leaf-700 px-2.5 py-1 rounded-full uppercase tracking-wide">
            {post.category}
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        </div>
      </Link>

      <div className="p-4 sm:p-5 flex flex-col flex-1 min-h-0">
        <Link href={href} className="no-underline block mb-3">
          <h3 className="font-display font-bold text-[15px] text-bark leading-snug line-clamp-2 min-h-[2.6em] group-hover:text-leaf-600 transition-colors">
            {post.title}
          </h3>
        </Link>

        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 min-h-[2.5em] mb-3">
          {post.description}
        </p>

        <div className="flex items-center justify-between text-[11px] text-gray-400 mb-3">
          <span>{post.readTime || "5 min read"}</span>
          <span>
            {post.date
              ? new Date(post.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : ""}
          </span>
        </div>

        <div className="mt-auto">
          <div className="mb-3">
            <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-0.5">
              From
            </div>
            <div className="font-display font-black text-2xl text-bark leading-none">
              {price}
            </div>
          </div>

          <Link
            href={href}
            className="no-underline block w-full text-center bg-leaf-500 hover:bg-leaf-600 text-white font-bold text-sm py-3 rounded-xl transition-colors active:scale-[0.98]"
          >
            Read guide →
          </Link>
          <Link
            href={shopHref}
            target="_blank"
            rel="nofollow sponsored noopener"
            className="mt-2 block text-center text-xs font-semibold text-leaf-600 no-underline hover:underline min-h-[1.25rem]"
          >
            Check price on store →
          </Link>
        </div>
      </div>
    </article>
  );
}
