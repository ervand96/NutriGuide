"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CategoryNavStrip from "@/components/CategoryNavStrip";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductShelf from "@/components/ProductShelf";
import QuizResultsEmailCapture from "@/components/QuizResultsEmailCapture";
import QuizShareResults, {
  QuizStackShopButtons,
} from "@/components/QuizShareResults";
import {
  answersFromShareParams,
  clearQuizAnswers,
  loadQuizAnswers,
  mapQuizToPicks,
  mapSharedToPicks,
  type QuizAnswers,
} from "@/lib/quiz-recommendations.js";

function QuizResultsInner() {
  const searchParams = useSearchParams();
  const [answers, setAnswers] = useState<QuizAnswers | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const shared = answersFromShareParams({
      goal: searchParams.get("goal"),
      stack: searchParams.get("stack"),
      product: searchParams.get("product"),
    });
    if (shared) {
      setAnswers(shared);
    } else {
      setAnswers(loadQuizAnswers());
    }
    setReady(true);
  }, [searchParams]);

  if (!ready) {
    return (
      <>
        <Navbar />
        <main className="min-h-[40vh] bg-cream" />
        <Footer />
      </>
    );
  }

  if (!answers) {
    return (
      <>
        <Navbar />
        <CategoryNavStrip active="quiz" />
        <main className="bg-cream py-16 px-4">
          <div className="max-w-xl mx-auto text-center">
            <h1 className="font-display font-black text-3xl text-bark mb-3">
              No quiz answers yet
            </h1>
            <p className="text-gray-500 mb-6">
              Take the 2-minute quiz to get personalized supplement picks.
            </p>
            <Link href="/quiz" className="affiliate-btn inline-block no-underline">
              Start quiz →
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const mapped = answers.fromShare
    ? mapSharedToPicks(answers)
    : mapQuizToPicks(answers);
  const { picks, keys, guide, headline, stackTotal, partners, goal } = mapped;
  const topName = picks[0]?.name || "";

  return (
    <>
      <Navbar />
      <CategoryNavStrip active="quiz" />
      <main className="bg-cream pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div>
            <p className="text-leaf-500 text-xs font-bold tracking-[3px] uppercase mb-3">
              Quiz results
            </p>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-bark mb-3 max-w-3xl">
              {headline}
            </h1>
            <p className="text-gray-500 text-base sm:text-lg mb-8 max-w-2xl">
              Based on your goal
              {goal ? ` (${goal.replace("_", " ")})` : ""}, gut comfort, and
              budget — here is a practical starter stack. Not medical advice.
            </p>
          </div>

          {picks.length > 1 ? (
            <div className="mb-8">
              <ProductShelf
                title="Your starter stack"
                subtitle="Complementary picks matched to your quiz answers"
                products={picks}
                slugPrefix="quiz-stack"
                showStoreButtons={false}
              />
            </div>
          ) : null}

          <div className="mb-6">
            {(picks.length === 1 ? picks : picks.slice(0, 1)).map((product) => (
              <ProductCard
                key={product.name}
                product={product}
                slug="quiz-result"
              />
            ))}
          </div>

          <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Stack total
                </p>
                <p className="font-display font-black text-2xl sm:text-3xl text-bark">
                  Total for this stack: {stackTotal}
                </p>
              </div>
            </div>
            <QuizStackShopButtons partners={partners} picks={picks} />
          </div>

          <QuizResultsEmailCapture goal={goal} recommendedProduct={topName} />

          <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-7 mb-8">
            <h2 className="font-display font-bold text-xl text-bark mb-2">
              Read the full guide
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Dig into forms, dosing context, and how we compare brands.
            </p>
            <Link
              href={guide.href}
              className="text-leaf-600 font-bold hover:underline no-underline"
            >
              {guide.title} →
            </Link>
          </div>

          <div className="flex flex-col gap-5">
            <QuizShareResults goal={goal} keys={keys} />
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/quiz"
                onClick={() => clearQuizAnswers()}
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl border-2 border-leaf-500 text-leaf-600 font-bold px-6 no-underline hover:bg-leaf-50"
              >
                Retake quiz
              </Link>
              <Link
                href="/best-picks"
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-leaf-500 text-white font-bold px-6 no-underline hover:bg-leaf-600"
              >
                Browse all top picks →
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function QuizResultsPage() {
  return (
    <Suspense
      fallback={
        <>
          <Navbar />
          <main className="min-h-[40vh] bg-cream" />
          <Footer />
        </>
      }
    >
      <QuizResultsInner />
    </Suspense>
  );
}
