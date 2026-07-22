import Link from "next/link";
import { SITE_CONTAINER } from "@/lib/layout.js";

const items = [
  { href: "/category/diets", label: "Diets", emoji: "🥗" },
  { href: "/category/reviews", label: "Reviews", emoji: "⭐" },
  { href: "/category/supplements", label: "Supplements", emoji: "💊" },
  { href: "/quiz", label: "Quiz", emoji: "🧭" },
  { href: "/promo-codes", label: "Codes", emoji: "🏷️" },
];

export default function CategoryNavStrip({
  active,
}: {
  active?: "diets" | "reviews" | "supplements" | "quiz" | "promo-codes";
}) {
  return (
    <nav
      aria-label="Browse topics"
      className="bg-white border-b border-gray-100 sticky top-14 sm:top-16 z-40"
    >
      <div className={SITE_CONTAINER}>
        <div className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide py-2">
          {items.map((item) => {
            const key = item.href.split("/").pop() || "";
            const isActive = active === key;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2.5 rounded-full text-sm font-semibold no-underline transition-colors ${
                  isActive
                    ? "bg-leaf-500 text-white"
                    : "bg-leaf-50 text-leaf-700 hover:bg-leaf-100"
                }`}
              >
                <span aria-hidden>{item.emoji}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
