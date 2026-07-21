"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@/types";
import { shopLinksForProduct } from "@/lib/affiliate.js";

type SortKey = "rank" | "rating" | "price" | "cost";

function parsePrice(price?: string) {
  const n = Number(String(price || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY;
}

function parseCost(cost?: string) {
  const n = Number(String(cost || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY;
}

export default function ProductComparisonTable({
  products,
  slug,
}: {
  products: Product[];
  slug: string;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const rows = useMemo(() => {
    const list = [...(products || [])].slice(0, 5);
    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "rank") cmp = (a.rank || 99) - (b.rank || 99);
      else if (sortKey === "rating") cmp = (b.rating || 0) - (a.rating || 0);
      else if (sortKey === "price")
        cmp = parsePrice(a.price) - parsePrice(b.price);
      else cmp = parseCost(a.costPerServing) - parseCost(b.costPerServing);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [products, sortKey, sortDir]);

  if (!products?.length) return null;

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "rating" ? "desc" : "asc");
    }
  }

  function SortHeader({
    label,
    keyName,
  }: {
    label: string;
    keyName: SortKey;
  }) {
    const active = sortKey === keyName;
    return (
      <th className="px-5 py-3.5 font-display font-bold text-bark text-sm">
        <button
          type="button"
          onClick={() => toggleSort(keyName)}
          className={`inline-flex items-center gap-1 bg-transparent border-0 p-0 cursor-pointer font-display font-bold text-sm ${
            active ? "text-leaf-600" : "text-bark"
          }`}
        >
          {label}
          <span className="text-[10px] text-gray-400" aria-hidden>
            {active ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
          </span>
        </button>
      </th>
    );
  }

  return (
    <section className="mb-8 sm:mb-10">
      <h2 className="font-display font-black text-xl sm:text-2xl text-bark mb-1">
        Quick comparison
      </h2>
      <p className="text-gray-500 text-sm mb-4">
        Side-by-side snapshot — tap a column header to sort.
      </p>

      <div className="md:hidden flex flex-col gap-3">
        {rows.map((p) => {
          const shop = shopLinksForProduct(p, `compare-${slug}-${p.rank}`);
          return (
            <div
              key={p.rank}
              className={`rounded-2xl border p-4 ${
                p.highlight
                  ? "border-leaf-500 bg-leaf-50/50"
                  : "border-gray-100 bg-white"
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                {p.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-16 h-16 rounded-xl object-contain bg-white border border-gray-100 shrink-0"
                    loading="lazy"
                  />
                ) : null}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-leaf-600 uppercase tracking-wide">
                    #{p.rank} {p.badge}
                  </div>
                  <div className="font-display font-bold text-bark text-sm leading-snug mt-0.5">
                    {p.name}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm">
                    <span className="font-display font-black text-leaf-600">
                      {p.price}
                    </span>
                    {p.costPerServing ? (
                      <span className="text-gray-500 text-xs">
                        {p.costPerServing}/serving
                      </span>
                    ) : null}
                    <span className="text-amber-400 text-xs">★ {p.rating}</span>
                  </div>
                </div>
              </div>
              <Link
                href={shop.primaryHref}
                target="_blank"
                rel="nofollow sponsored noopener"
                className="no-underline block text-center bg-leaf-500 hover:bg-leaf-600 text-white font-bold text-sm py-3 rounded-xl active:scale-[0.98]"
              >
                {shop.primaryLabel}
              </Link>
            </div>
          );
        })}
      </div>

      <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-leaf-50">
              <SortHeader label="Rank" keyName="rank" />
              <th className="px-5 py-3.5 font-display font-bold text-bark text-sm">
                Product
              </th>
              <SortHeader label="Rating" keyName="rating" />
              <SortHeader label="Price" keyName="price" />
              <SortHeader label="Cost/Serving" keyName="cost" />
              <th className="px-5 py-3.5 font-display font-bold text-bark text-sm">
                Shop
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p, i) => {
              const shop = shopLinksForProduct(p, `compare-${slug}-${p.rank}`);
              return (
                <tr
                  key={p.rank}
                  className={
                    p.highlight
                      ? "bg-leaf-50/60"
                      : i % 2 === 0
                        ? "bg-white"
                        : "bg-gray-50/50"
                  }
                >
                  <td className="px-5 py-4 text-sm font-bold text-leaf-600 whitespace-nowrap">
                    #{p.rank}
                    {p.badge ? (
                      <span className="block text-xs font-semibold text-gray-500 normal-case tracking-normal mt-0.5">
                        {p.badge}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-5 py-4 text-sm font-bold text-bark max-w-xs">
                    <div className="flex items-center gap-3">
                      {p.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.imageUrl}
                          alt=""
                          className="w-12 h-12 rounded-lg object-contain bg-white border border-gray-100 shrink-0"
                          loading="lazy"
                        />
                      ) : null}
                      <span className="leading-snug">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-amber-500 whitespace-nowrap">
                    ★ {p.rating}
                  </td>
                  <td className="px-5 py-4 text-sm font-display font-black text-leaf-600 whitespace-nowrap">
                    {p.price}
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-bark whitespace-nowrap">
                    {p.costPerServing || "—"}
                  </td>
                  <td className="px-5 py-4 text-sm whitespace-nowrap">
                    <Link
                      href={shop.primaryHref}
                      target="_blank"
                      rel="nofollow sponsored noopener"
                      className="text-leaf-600 font-semibold hover:underline no-underline"
                    >
                      Check price →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
