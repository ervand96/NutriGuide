"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CategoryNavStrip from "@/components/CategoryNavStrip";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import {
  clearQuizAnswers,
  loadQuizAnswers,
  mapQuizToPicks,
  type QuizAnswers,
} from "@/lib/quiz-recommendations.js";

export default function QuizResultsPage() {
  const [answers, setAnswers] = useState<QuizAnswers | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setAnswers(loadQuizAnswers());
    setReady(true);
  }, []);

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

  const { picks, guide, headline } = mapQuizToPicks(answers);

  return (
    <>
      <Navbar />
      <CategoryNavStrip active="quiz" />
      <main className="bg-cream pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <AnimateOnScroll animation="fade-up">
            <p className="text-leaf-500 text-xs font-bold tracking-[3px] uppercase mb-3">
              Quiz results
            </p>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-bark mb-3 max-w-3xl">
              {headline}
            </h1>
            <p className="text-gray-500 text-base sm:text-lg mb-8 max-w-2xl">
              Based on your goal
              {answers.goal ? ` (${answers.goal.replace("_", " ")})` : ""}, gut
              comfort, and budget — here are practical first picks. Not medical
              advice.
            </p>
          </AnimateOnScroll>

          <div className="mb-10">
            {picks.map((product) => (
              <ProductCard
                key={product.name}
                product={product}
                slug="quiz-result"
              />
            ))}
          </div>

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
      </main>
      <Footer />
    </>
  );
}
