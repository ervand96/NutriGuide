"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { discountStackLabel } from "@/lib/affiliate.js";
import { buildResultsSharePath } from "@/lib/quiz-recommendations.js";

export default function QuizShareResults({
  goal,
  keys,
  siteOrigin,
}: {
  goal: string;
  keys: string[];
  siteOrigin?: string;
}) {
  const [copied, setCopied] = useState(false);
  const path = useMemo(
    () => buildResultsSharePath(goal, keys),
    [goal, keys],
  );
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${path}`
      : `${siteOrigin || "https://nutri-guide-indol.vercel.app"}${path}`;

  const tweetText = `I just found my personalized supplement pick on NutriGuide — check yours: ${shareUrl}`;
  const tweetHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mr-1">
        Share your results
      </span>
      <a
        href={tweetHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center min-h-[44px] text-sm font-semibold text-bark bg-leaf-50 hover:bg-leaf-100 border border-leaf-100 px-4 py-2.5 rounded-full no-underline transition-colors"
      >
        X
      </a>
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center min-h-[44px] text-sm font-semibold text-bark bg-white hover:bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-full transition-colors"
      >
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}

export function QuizStackShopButtons({
  partners,
  picks,
}: {
  partners: string[];
  picks: { name: string; affiliateUrl?: string }[];
}) {
  if (!picks?.length) return null;

  const queries = picks
    .map((p) => (p.name || "").split(",")[0].trim())
    .filter(Boolean);
  const q = queries.length
    ? `&q=${encodeURIComponent(queries.join(" "))}`
    : "";

  if (partners.length <= 1) {
    const partner = partners[0] || "iherb";
    const href =
      picks[0]?.affiliateUrl ||
      `/go/${partner}?source=quiz-stack${q}`;
    return (
      <Link
        href={href}
        target="_blank"
        rel="nofollow sponsored noopener"
        className="no-underline inline-flex min-h-[52px] w-full sm:w-auto items-center justify-center rounded-xl bg-leaf-500 hover:bg-leaf-600 text-white font-bold px-8 text-sm sm:text-base"
      >
        {discountStackLabel(partner)}
      </Link>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      {partners.map((partner) => (
        <Link
          key={partner}
          href={`/go/${partner}?source=quiz-stack-${partner}${q}`}
          target="_blank"
          rel="nofollow sponsored noopener"
          className={`no-underline inline-flex min-h-[52px] flex-1 items-center justify-center rounded-xl font-bold px-6 text-sm sm:text-base ${
            partner === "iherb"
              ? "bg-leaf-500 hover:bg-leaf-600 text-white"
              : "border-2 border-leaf-500 text-leaf-600 hover:bg-leaf-50 bg-white"
          }`}
        >
          {partner === "iherb"
            ? discountStackLabel("iherb")
            : "Shop this stack on MyProtein →"}
        </Link>
      ))}
    </div>
  );
}
