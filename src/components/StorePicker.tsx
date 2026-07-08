"use client";

import { useState } from "react";
import Link from "next/link";
import AffiliateButton from "./AffiliateButton";
import AnimateOnScroll from "./AnimateOnScroll";

const options = [
  {
    id: "vitamins",
    label: "Vitamins & wellness",
    emoji: "🌿",
    examples: "Multivitamins, omega-3, probiotics, herbs",
    partner: "iherb" as const,
    source: "picker-vitamins",
  },
  {
    id: "protein",
    label: "Protein & sports nutrition",
    emoji: "🥤",
    examples: "Whey, creatine, pre-workout, snacks",
    partner: "myprotein" as const,
    source: "picker-protein",
  },
  {
    id: "both",
    label: "Both — not sure yet",
    emoji: "🤔",
    examples: "Start with our quiz or browse reviews",
    partner: null,
    source: "picker-both",
  },
];

export default function StorePicker() {
  const [selected, setSelected] = useState<string | null>(null);
  const choice = options.find((o) => o.id === selected);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <AnimateOnScroll animation="fade-up">
        <h2 className="font-display font-black text-2xl sm:text-3xl mb-2">
          Which Store Should You Use?
        </h2>
        <p className="text-gray-500 mb-8 max-w-2xl text-sm sm:text-base">
          We only partner with two stores. Pick what you&apos;re buying and
          we&apos;ll send you to the right place with your discount applied.
        </p>
      </AnimateOnScroll>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {options.map((o, i) => (
          <AnimateOnScroll key={o.id} animation="scale-in" delay={i * 80}>
            <button
              type="button"
              onClick={() => setSelected(o.id)}
              className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                selected === o.id
                  ? "border-leaf-500 bg-leaf-50 shadow-md shadow-leaf-100"
                  : "border-gray-100 bg-white hover:border-leaf-200"
              }`}
            >
              <div className="text-2xl mb-2">{o.emoji}</div>
              <div className="font-display font-bold text-bark mb-1 text-sm sm:text-base">
                {o.label}
              </div>
              <p className="text-gray-500 text-xs sm:text-sm">{o.examples}</p>
            </button>
          </AnimateOnScroll>
        ))}
      </div>

      {choice && (
        <AnimateOnScroll animation="fade-in" className="text-center">
          {choice.partner ? (
            <div className="bg-leaf-50 border border-leaf-100 rounded-2xl p-6 max-w-md mx-auto">
              <p className="text-gray-600 text-sm mb-4">
                {choice.partner === "iherb"
                  ? "iHerb is best for vitamins, herbs, and wellness products — ships to 180+ countries."
                  : "MyProtein is best for protein powders, creatine, and sports nutrition — our code applies automatically."}
              </p>
              <AffiliateButton
                partner={choice.partner}
                source={choice.source}
                className="w-full max-w-xs mx-auto"
              >
                Shop {choice.partner === "iherb" ? "iHerb" : "MyProtein"} →
              </AffiliateButton>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/quiz"
                className="inline-block bg-leaf-500 hover:bg-leaf-600 text-white font-bold px-6 py-3 rounded-xl no-underline transition-colors text-sm text-center"
              >
                Take the Quiz →
              </Link>
              <Link
                href="/category/reviews"
                className="inline-block border-2 border-leaf-500 text-leaf-600 font-bold px-6 py-3 rounded-xl no-underline hover:bg-leaf-50 transition-colors text-sm text-center"
              >
                Browse Reviews →
              </Link>
            </div>
          )}
        </AnimateOnScroll>
      )}
    </section>
  );
}
