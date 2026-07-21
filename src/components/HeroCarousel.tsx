"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import AffiliateButton from "./AffiliateButton";

/** Landscape 3:2 only — fills full-screen desktop and mobile cleanly */
const SLIDES = [
  {
    src: "/hero/fresh-bowl.jpg",
    alt: "Colorful fresh vegetable bowl",
  },
  {
    src: "/hero/kitchen-prep.jpg",
    alt: "Healthy meal prep with fresh ingredients",
  },
  {
    src: "/hero/greens.jpg",
    alt: "Fresh greens and produce",
  },
  {
    src: "/hero/oatmeal.jpg",
    alt: "Nourishing oatmeal breakfast bowl",
  },
  {
    src: "/hero/fruit-bowl.jpg",
    alt: "Fresh fruit bowl for daily wellness",
  },
];

const INTERVAL_MS = 4000;

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  const goTo = useCallback((next: number) => {
    setIndex(((next % SLIDES.length) + SLIDES.length) % SLIDES.length);
    setProgressKey((k) => k + 1);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
      setProgressKey((k) => k + 1);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [index, reduceMotion]);

  useEffect(() => {
    SLIDES.forEach((slide) => {
      const img = new Image();
      img.src = slide.src;
    });
  }, []);

  return (
    <section
      className="relative h-[100svh] min-h-[560px] overflow-hidden text-white"
      aria-roledescription="carousel"
      aria-label="NutriGuide lifestyle photos"
    >
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
            i === index ? "opacity-100 z-[1]" : "opacity-0 z-0"
          }`}
          aria-hidden={i !== index}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.src}
            alt={slide.alt}
            className={`absolute inset-0 h-full w-full object-cover object-center will-change-transform ${
              reduceMotion
                ? ""
                : i === index
                  ? "animate-[heroKen_4s_ease-out_forwards]"
                  : ""
            }`}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={i === 0 ? "high" : "auto"}
          />
        </div>
      ))}

      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-bark/55 via-bark/40 to-bark/80"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-r from-bark/50 via-transparent to-bark/15"
        aria-hidden
      />

      <div className="relative z-10 flex h-full items-end sm:items-center px-4 sm:px-6 pt-16 pb-28 sm:py-24">
        <div className="max-w-6xl mx-auto w-full">
          <div className="max-w-3xl">
            <p className="font-display font-black text-2xl sm:text-4xl md:text-5xl tracking-tight text-white drop-shadow-sm mb-3 sm:mb-5 animate-[heroFade_0.8s_ease-out]">
              NutriGuide
            </p>
            <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] tracking-tight mb-3 sm:mb-6 animate-[heroFade_1s_ease-out]">
              Find the Diet That
              <br />
              <span className="text-leaf-100">Actually Works</span>
            </h1>
            <p className="text-white/90 text-sm sm:text-lg md:text-xl leading-relaxed max-w-xl mb-5 sm:mb-10 animate-[heroFade_1.15s_ease-out]">
              Science-backed reviews of diets, supplements, and programs — then
              shop iHerb &amp; MyProtein with our discount links.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 sm:gap-4 animate-[heroFade_1.3s_ease-out]">
              <Link
                href="/quiz"
                className="cta-pulse bg-leaf-500 text-white font-bold px-5 sm:px-8 py-3.5 sm:py-4 rounded-xl hover:bg-leaf-600 transition-all duration-200 no-underline active:scale-[0.98] text-center shadow-lg shadow-leaf-900/30 min-h-[52px] flex items-center justify-center text-base sm:text-lg"
              >
                Take the 2-Minute Quiz →
              </Link>
              <Link
                href="/category/reviews"
                className="border border-white/55 bg-white/10 backdrop-blur-sm text-white font-bold px-5 sm:px-8 py-3.5 sm:py-4 rounded-xl hover:bg-white/20 transition-colors no-underline text-center min-h-[48px] flex items-center justify-center"
              >
                Browse Reviews
              </Link>
            </div>
            <div className="mt-3 sm:mt-4 grid grid-cols-2 sm:flex sm:flex-row gap-2 sm:gap-3 max-w-md animate-[heroFade_1.45s_ease-out]">
              <AffiliateButton
                partner="iherb"
                source="hero"
                variant="ghost"
                className="!py-3 !text-xs sm:!text-sm !border-white/45 !px-2 sm:!px-6 min-h-[44px]"
              >
                iHerb →
              </AffiliateButton>
              <AffiliateButton
                partner="myprotein"
                source="hero"
                variant="ghost"
                className="!py-3 !text-xs sm:!text-sm !border-white/45 !px-2 sm:!px-6 min-h-[44px]"
              >
                MyProtein →
              </AffiliateButton>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 z-20 px-3 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center" role="tablist" aria-label="Hero slides">
            {SLIDES.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show photo ${i + 1}`}
                onClick={() => goTo(i)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <span
                  className={`relative overflow-hidden h-1.5 rounded-full transition-all duration-300 block ${
                    i === index
                      ? "w-8 sm:w-10 bg-white/30"
                      : "w-2 bg-white/45"
                  }`}
                >
                  {i === index && !reduceMotion && (
                    <span
                      key={progressKey}
                      className="absolute inset-y-0 left-0 bg-white rounded-full animate-[heroProgress_4s_linear_forwards]"
                    />
                  )}
                  {i === index && reduceMotion && (
                    <span className="absolute inset-0 bg-white rounded-full" />
                  )}
                </span>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => goTo(index - 1)}
              className="h-11 w-11 rounded-full border border-white/40 bg-bark/40 backdrop-blur-sm text-white text-xl leading-none hover:bg-bark/55 transition-colors"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => goTo(index + 1)}
              className="h-11 w-11 rounded-full border border-white/40 bg-bark/40 backdrop-blur-sm text-white text-xl leading-none hover:bg-bark/55 transition-colors"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
