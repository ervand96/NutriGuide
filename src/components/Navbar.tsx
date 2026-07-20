"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AffiliateButton from "./AffiliateButton";
import { SITE_CONTAINER } from "@/lib/layout.js";

const links = [
  { href: "/category/diets", label: "Diets" },
  { href: "/category/reviews", label: "Reviews" },
  { href: "/category/supplements", label: "Supplements" },
  { href: "/quiz", label: "Quiz" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className={`${SITE_CONTAINER} h-14 sm:h-16 flex items-center justify-between gap-2`}>
        <Link href="/" className="flex items-center gap-2 no-underline shrink-0">
          <img
            src="/logo.svg"
            alt="NutriGuide logo"
            className="h-8 w-8 sm:h-9 sm:w-9 object-contain"
          />
          <span className="font-display font-black text-base sm:text-xl text-leaf-500 tracking-tight">
            NutriGuide
          </span>
        </Link>

        <div className="hidden md:flex gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-gray-500 hover:text-leaf-500 text-sm font-medium transition-colors no-underline"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/best-picks"
            className="hidden lg:inline-flex text-gray-500 hover:text-leaf-500 text-sm font-bold no-underline"
          >
            Best Picks
          </Link>
          <AffiliateButton
            partner="iherb"
            source="navbar"
            className="hidden sm:inline-flex !px-2.5 sm:!px-3 !py-2 text-xs sm:!text-sm"
          >
            iHerb →
          </AffiliateButton>
          <AffiliateButton
            partner="myprotein"
            source="navbar"
            variant="outline"
            className="hidden sm:inline-flex !px-2.5 sm:!px-3 !py-2 !text-xs sm:!text-sm"
          >
            MyProtein →
          </AffiliateButton>
          <button
            type="button"
            className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="text-xl leading-none">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {open && (
        <>
          <div
            className="md:hidden fixed inset-0 top-14 sm:top-16 bg-black/20 z-40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="md:hidden relative z-50 border-t border-gray-100 bg-white px-4 py-5 flex flex-col gap-1 max-h-[calc(100dvh-3.5rem)] overflow-y-auto">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-gray-700 font-medium no-underline py-3 px-2 rounded-xl hover:bg-leaf-50 transition-colors min-h-[44px] flex items-center"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/best-picks"
              className="text-gray-700 font-medium no-underline py-3 px-2 rounded-xl hover:bg-leaf-50 min-h-[44px] flex items-center"
              onClick={() => setOpen(false)}
            >
              Best Picks
            </Link>
            <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-gray-100">
              <AffiliateButton
                partner="iherb"
                source="navbar-mobile"
                className="w-full !text-sm !py-3"
              >
                🌿 Shop iHerb →
              </AffiliateButton>
              <AffiliateButton
                partner="myprotein"
                source="navbar-mobile"
                variant="outline"
                className="w-full !text-sm !py-3"
              >
                🥤 Shop MyProtein →
              </AffiliateButton>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
