"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { PromoCode, PromoStore } from "@/data/promo-codes.js";
import { formatPromoDisplayDate } from "@/data/promo-codes.js";

type Filter = "all" | PromoStore;

export default function PromoCodesClient({ codes }: { codes: PromoCode[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const visible = useMemo(() => {
    if (filter === "all") return codes;
    return codes.filter((c) => c.store === filter);
  }, [codes, filter]);

  async function copyCode(id: string, code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setCopiedId(null);
    }
  }

  const tabs: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "iHerb", label: "iHerb" },
    { id: "MyProtein", label: "MyProtein" },
  ];

  return (
    <div>
      <div
        className="flex flex-wrap gap-2 mb-8"
        role="tablist"
        aria-label="Filter by store"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={filter === t.id}
            onClick={() => setFilter(t.id)}
            className={`min-h-[44px] px-4 rounded-full text-sm font-bold border transition-colors cursor-pointer ${
              filter === t.id
                ? "bg-leaf-500 text-white border-leaf-500"
                : "bg-white text-bark border-gray-200 hover:border-leaf-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {visible.map((promo) => (
          <article
            key={promo.id}
            className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 flex flex-col shadow-[0_8px_30px_rgba(44,36,22,0.04)]"
          >
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl" aria-hidden>
                  {promo.store === "iHerb" ? "🌿" : "🥤"}
                </span>
                <span className="font-display font-bold text-bark text-sm sm:text-base">
                  {promo.store}
                </span>
              </div>
              {promo.category ? (
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide text-leaf-700 bg-leaf-50 border border-leaf-100 px-2.5 py-1 rounded-full">
                  {promo.category}
                </span>
              ) : null}
            </div>

            <p className="font-display font-black text-2xl sm:text-3xl text-leaf-600 leading-tight mb-2">
              {promo.discount}
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1">
              {promo.description}
            </p>

            {promo.code ? (
              <div className="mb-3 rounded-xl bg-cream border border-gray-100 px-4 py-3 flex items-center justify-between gap-3">
                <code className="font-mono font-bold text-bark text-sm sm:text-base tracking-wide">
                  {promo.code}
                </code>
                <button
                  type="button"
                  onClick={() => copyCode(promo.id, promo.code!)}
                  className="shrink-0 min-h-[40px] px-3 rounded-lg bg-leaf-500 hover:bg-leaf-600 text-white text-xs sm:text-sm font-bold border-0 cursor-pointer"
                >
                  {copiedId === promo.id ? "Copied!" : "Copy Code"}
                </button>
              </div>
            ) : null}

            <Link
              href={promo.link}
              target="_blank"
              rel="nofollow sponsored noopener"
              className="no-underline inline-flex min-h-[48px] items-center justify-center rounded-xl bg-bark hover:bg-bark/90 text-white font-bold text-sm px-4"
            >
              {promo.code ? "Shop with this deal →" : "Get Deal →"}
            </Link>

            <p className="text-gray-400 text-xs mt-3">
              Verified {formatPromoDisplayDate(promo.lastVerified)}
              {promo.expiryDate
                ? ` · Expires ${formatPromoDisplayDate(promo.expiryDate)}`
                : ""}
            </p>
          </article>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No active codes for this filter right now — check back soon.
        </p>
      ) : null}
    </div>
  );
}
