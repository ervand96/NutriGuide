"use client";

import Link from "next/link";

interface Props {
  slug: string;
  category: string;
}

export default function MobileShopBar({ slug, category }: Props) {
  const cat = category.toLowerCase();
  const isSports =
    cat === "reviews" ||
    slug.includes("protein") ||
    slug.includes("creatine") ||
    slug.includes("pre-workout");

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_24px_rgba(0,0,0,0.08)] animate-slide-up-bar">
      <div className="flex gap-2 max-w-lg mx-auto">
        <Link
          href={`/go/iherb?source=mobile-bar-${slug}`}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="flex-1 text-center bg-leaf-500 hover:bg-leaf-600 text-white font-bold text-sm py-3.5 min-h-[48px] flex items-center justify-center rounded-xl no-underline transition-colors"
        >
          iHerb
        </Link>
        <Link
          href={`/go/myprotein?source=mobile-bar-${slug}${isSports ? "&q=protein" : ""}`}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="flex-1 text-center border-2 border-leaf-500 text-leaf-600 font-bold text-sm py-3.5 min-h-[48px] flex items-center justify-center rounded-xl no-underline transition-colors hover:bg-leaf-50"
        >
          MyProtein
        </Link>
      </div>
    </div>
  );
}
