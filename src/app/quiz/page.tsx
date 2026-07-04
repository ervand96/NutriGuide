"use client";

import { useState } from "react";
import Link from "next/link";

interface Question {
  id: number;
  question: string;
  options: { label: string; value: string; emoji: string }[];
}

interface Result {
  diet: string;
  emoji: string;
  description: string;
  pros: string[];
  affiliateLabel: string;
  affiliateUrl: string;
  moreLabel: string;
  moreHref: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "What is your main goal?",
    options: [
      { label: "Lose weight fast", value: "lose_fast", emoji: "⚡" },
      { label: "Lose weight steadily", value: "lose_slow", emoji: "📉" },
      { label: "Build healthy habits", value: "habits", emoji: "🌱" },
      { label: "Improve energy & mood", value: "energy", emoji: "✨" },
    ],
  },
  {
    id: 2,
    question: "How do you feel about carbs?",
    options: [
      { label: "I can cut them completely", value: "no_carbs", emoji: "🚫" },
      { label: "I want to reduce them", value: "less_carbs", emoji: "📊" },
      { label: "I love carbs, keep some", value: "some_carbs", emoji: "🍞" },
      { label: "Carbs are fine for me", value: "carbs_ok", emoji: "✅" },
    ],
  },
  {
    id: 3,
    question: "How much time can you spend on meal prep?",
    options: [
      { label: "Minimal — keep it simple", value: "minimal", emoji: "⏱" },
      { label: "30 min per day", value: "medium", emoji: "🍳" },
      { label: "I enjoy cooking", value: "enjoy", emoji: "👨‍🍳" },
      { label: "I prefer meal delivery", value: "delivery", emoji: "📦" },
    ],
  },
  {
    id: 4,
    question: "Do you exercise regularly?",
    options: [
      { label: "Not yet, just starting", value: "none", emoji: "🛋️" },
      { label: "1–2 times a week", value: "light", emoji: "🚶" },
      { label: "3–4 times a week", value: "moderate", emoji: "🏃" },
      { label: "Almost every day", value: "active", emoji: "💪" },
    ],
  },
  {
    id: 5,
    question: "Have you tried dieting before?",
    options: [
      { label: "No, this is my first time", value: "first", emoji: "👋" },
      { label: "Yes, but nothing stuck", value: "failed", emoji: "😅" },
      { label: "Yes, had some success", value: "partial", emoji: "📈" },
      { label: "Yes, I know what works", value: "veteran", emoji: "🎯" },
    ],
  },
];

const results: Record<string, Result> = {
  keto: {
    diet: "Keto Diet",
    emoji: "🥑",
    description:
      "You're a great fit for keto. It's a high-fat, low-carb diet that switches your body into fat-burning mode. Great for fast, visible results.",
    pros: ["Fast weight loss", "Reduces hunger", "Boosts mental clarity"],
    affiliateLabel: "Shop Keto-Friendly Products on iHerb",
    affiliateUrl: "/go/iherb?source=quiz-keto&q=keto",
    moreLabel: "Explore all Diet guides",
    moreHref: "/category/diets",
  },
  intermittent: {
    diet: "Intermittent Fasting",
    emoji: "⏰",
    description:
      "Intermittent fasting fits your lifestyle perfectly. You eat within a specific time window — no calorie counting, no complicated meal prep.",
    pros: ["No food restrictions", "Easy to maintain", "Improves metabolism"],
    affiliateLabel: "Try Noom — Best App for IF",
    affiliateUrl: "/go/noom?source=quiz-if",
    moreLabel: "Explore all Diet guides",
    moreHref: "/category/diets",
  },
  mediterranean: {
    diet: "Mediterranean Diet",
    emoji: "🫒",
    description:
      "The Mediterranean diet is the world's healthiest. Lots of vegetables, olive oil, fish, and whole grains. Sustainable and delicious.",
    pros: [
      "Proven long-term results",
      "Heart-healthy",
      "No strict restrictions",
    ],
    affiliateLabel: "Shop Mediterranean Diet Essentials on iHerb",
    affiliateUrl: "/go/iherb?source=quiz-mediterranean",
    moreLabel: "Read our Mediterranean Diet guide",
    moreHref:
      "/category/diets/the-mediterranean-diet-your-path-to-a-healthier-happier-life-03601",
  },
  noom: {
    diet: "Noom Program",
    emoji: "🧠",
    description:
      "Based on your answers, you need more than a diet — you need a system. Noom uses psychology to change how you think about food.",
    pros: [
      "Real human coaches",
      "Psychology-based",
      "Tracks habits, not just calories",
    ],
    affiliateLabel: "Try Noom Free for 14 Days",
    affiliateUrl: "/go/noom?source=quiz-noom",
    moreLabel: "Explore all Reviews",
    moreHref: "/category/reviews",
  },
};

function getResult(answers: string[]): Result {
  const noCarbs = answers.includes("no_carbs");
  const loseFast = answers.includes("lose_fast");
  const habits = answers.includes("habits") || answers.includes("failed");
  const delivery = answers.includes("delivery");

  if (noCarbs && loseFast) return results.keto;
  if (habits || delivery) return results.noom;
  if (answers.includes("some_carbs") || answers.includes("carbs_ok"))
    return results.mediterranean;
  return results.intermittent;
}

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const question = questions[current];
  const result = done ? getResult(answers) : null;
  const progress = Math.round((current / questions.length) * 100);

  function handleSelect(value: string) {
    setSelected(value);
  }

  function handleNext() {
    if (!selected) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected(null);
    if (current + 1 >= questions.length) {
      setDone(true);
    } else {
      setCurrent((c) => c + 1);
    }
  }

  function handleRestart() {
    setCurrent(0);
    setAnswers([]);
    setSelected(null);
    setDone(false);
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 px-6 h-16 flex items-center">
        <Link
          href="/"
          className="flex items-center gap-2 no-underline"
        >
          <img src="/logo.svg" alt="NutriGuide logo" className="h-8 w-8" />
          <span className="font-display font-black text-xl text-leaf-500">
            NutriGuide
          </span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl">
          {!done ? (
            <>
              {/* Header */}
              <div className="text-center mb-10">
                <p className="text-leaf-500 text-xs font-bold tracking-[3px] uppercase mb-3">
                  2-Minute Quiz
                </p>
                <h1 className="font-display font-black text-4xl text-bark">
                  Find Your Perfect Diet
                </h1>
              </div>

              {/* Progress */}
              <div className="mb-8">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>
                    Question {current + 1} of {questions.length}
                  </span>
                  <span>{progress}% complete</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-leaf-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Question card */}
              <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                <h2 className="font-display font-bold text-2xl text-bark mb-6">
                  {question.question}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {question.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(opt.value)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-150 cursor-pointer
                        ${
                          selected === opt.value
                            ? "border-leaf-500 bg-leaf-50 text-leaf-700"
                            : "border-gray-100 bg-gray-50 hover:border-leaf-200 hover:bg-leaf-50 text-bark"
                        }`}
                    >
                      <span className="text-2xl">{opt.emoji}</span>
                      <span className="font-medium text-sm leading-snug">
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  disabled={!selected}
                  className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-200
                    ${
                      selected
                        ? "bg-leaf-500 hover:bg-leaf-600 text-white cursor-pointer"
                        : "bg-gray-100 text-gray-300 cursor-not-allowed"
                    }`}
                >
                  {current + 1 === questions.length
                    ? "See My Result →"
                    : "Next Question →"}
                </button>
              </div>
            </>
          ) : result ? (
            /* RESULT */
            <div className="text-center">
              <div className="text-7xl mb-4">{result.emoji}</div>
              <p className="text-leaf-500 text-xs font-bold tracking-[3px] uppercase mb-2">
                Your Match
              </p>
              <h1 className="font-display font-black text-5xl text-bark mb-4">
                {result.diet}
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed max-w-lg mx-auto mb-8">
                {result.description}
              </p>

              {/* Pros */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6 text-left max-w-md mx-auto">
                <div className="text-xs font-bold text-leaf-500 uppercase tracking-widest mb-4">
                  Why it works for you
                </div>
                {result.pros.map((pro) => (
                  <div key={pro} className="flex items-center gap-3 mb-3">
                    <div className="w-5 h-5 rounded-full bg-leaf-50 flex items-center justify-center text-leaf-500 text-xs flex-shrink-0">
                      ✓
                    </div>
                    <span className="text-gray-600 text-sm">{pro}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <a
                href={result.affiliateUrl}
                target="_blank"
                rel="nofollow sponsored noopener"
                className="affiliate-btn max-w-md mx-auto mb-4 block"
              >
                {result.affiliateLabel} →
              </a>

              <Link
                href={result.moreHref}
                className="block text-center text-leaf-500 font-semibold text-sm hover:underline no-underline max-w-md mx-auto mb-8"
              >
                {result.moreLabel} →
              </Link>

              <button
                onClick={handleRestart}
                className="text-gray-400 text-sm hover:text-gray-600 transition-colors underline cursor-pointer bg-transparent border-none"
              >
                Retake quiz
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
