import Link from "next/link";
import { photoForProductName } from "@/lib/product-image.js";

export type GuideCardPost = {
  slug: string;
  title: string;
  category: string;
  description: string;
  readTime?: string;
  date?: string;
  products?: Array<{ name?: string; imageUrl?: string; price?: string; rating?: number }>;
};

function coverForGuide(post: GuideCardPost) {
  const first = post.products?.find((p) => p.imageUrl)?.imageUrl;
  if (first) return first;
  if (post.products?.[0]?.name) return photoForProductName(post.products[0].name);
  return photoForProductName(post.title);
}

function categoryTone(category: string) {
  const c = category.toLowerCase();
  if (c === "diets") return "from-leaf-50 to-emerald-100";
  if (c === "reviews") return "from-amber-50 to-orange-100";
  return "from-sky-50 to-blue-100";
}

export default function GuideShelfCard({
  post,
  rank,
}: {
  post: GuideCardPost;
  rank: number;
}) {
  const href = `/category/${post.category.toLowerCase()}/${post.slug}`;
  const imageUrl = coverForGuide(post);
  const product = post.products?.[0];
  const shopHref = product?.name
    ? `/go/${/protein|creatine|whey|pre-workout/i.test(product.name) ? "myprotein" : "iherb"}?source=guide-shelf&q=${encodeURIComponent(product.name)}`
    : null;

  return (
    <article className="group flex flex-col shrink-0 snap-start overflow-hidden rounded-3xl bg-white/90 backdrop-blur-sm border border-white shadow-[0_8px_30px_rgba(44,36,22,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(45,122,58,0.12)] w-[200px] sm:w-[220px] md:w-full">
      <Link href={href} className="no-underline block relative">
        <div
          className={`relative aspect-[4/5] bg-gradient-to-br ${categoryTone(post.category)} flex items-center justify-center overflow-hidden`}
        >
          <span className="absolute top-3 left-3 z-10 h-8 w-8 flex items-center justify-center rounded-full bg-bark/90 text-white text-xs font-display font-black">
            {rank}
          </span>
          <span className="absolute top-3 right-3 z-10 text-[10px] font-bold bg-white/95 text-leaf-700 px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wide">
            {post.category}
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-contain p-4 sm:p-5 bg-white/70 transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        </div>
      </Link>

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <Link href={href} className="no-underline flex-1">
          <h3 className="font-display font-bold text-[15px] sm:text-base text-bark leading-snug line-clamp-2 mb-2 group-hover:text-leaf-600 transition-colors">
            {post.title}
          </h3>
          <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">
            {post.description}
          </p>
        </Link>

        <div className="flex items-center justify-between text-[11px] text-gray-400 mb-3">
          <span>{post.readTime || "5 min read"}</span>
          <span>
            {post.date ? new Date(post.date).toLocaleDateString() : ""}
          </span>
        </div>

        {product?.price && (
          <div className="font-display font-black text-xl text-bark mb-3 leading-none">
            {product.price}
          </div>
        )}

        <Link
          href={href}
          className="no-underline block w-full text-center bg-leaf-500 hover:bg-leaf-600 text-white font-bold text-sm py-3 rounded-xl transition-colors active:scale-[0.98]"
        >
          Read guide →
        </Link>
        {shopHref && (
          <Link
            href={shopHref}
            target="_blank"
            rel="nofollow sponsored noopener"
            className="mt-2 text-center text-xs font-semibold text-leaf-600 no-underline hover:underline"
          >
            Check price on store →
          </Link>
        )}
      </div>
    </article>
  );
}
