"use client";

import { useState } from "react";
import Link from "next/link";
import AffiliateButton from "./AffiliateButton";

const links = [
  { href: "/category/diets", label: "Diets" },
  { href: "/category/reviews", label: "Reviews" },
  { href: "/category/supplements", label: "Supplements" },
  { href: "/quiz", label: "Quiz" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <img
            src="/logo.svg"
            alt="NutriGuide logo"
            className="h-9 w-9 object-contain"
          />
          <span className="font-display font-black text-xl text-leaf-500 tracking-tight">
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

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/category/reviews"
            className="hidden sm:inline-flex text-gray-500 hover:text-leaf-500 text-sm font-bold no-underline"
          >
            Best Picks
          </Link>
          <AffiliateButton
            partner="iherb"
            source="navbar"
            className="!px-3 !py-2 text-xs sm:!text-sm"
          >
            iHerb →
          </AffiliateButton>
          <AffiliateButton
            partner="myprotein"
            source="navbar"
            variant="outline"
            className="hidden sm:inline-flex !px-3 !py-2 !text-sm"
          >
            MyProtein →
          </AffiliateButton>
          <button
            type="button"
            className="md:hidden p-2 text-gray-600"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-gray-600 font-medium no-underline py-1"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <AffiliateButton
            partner="myprotein"
            source="navbar-mobile"
            className="w-full !text-sm"
          >
            Shop MyProtein →
          </AffiliateButton>
        </div>
      )}
    </nav>
  );
}
