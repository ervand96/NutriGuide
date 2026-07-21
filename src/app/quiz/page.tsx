"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CategoryNavStrip from "@/components/CategoryNavStrip";
import Footer from "@/components/Footer";
import {
  clearQuizAnswers,
  loadQuizAnswers,
  saveQuizAnswers,
  type QuizAnswers,
} from "@/lib/quiz-recommendations.js";

interface Question {
  id: string;
  question: string;
  options: { label: string; value: string; emoji: string }[];
  freeTextWhen?: string;
}

const questions: Question[] = [
  {
    id: "goal",
    question: "What is your main goal?",
    options: [
      { label: "Better sleep", value: "sleep", emoji: "😴" },
      { label: "Less stress", value: "stress", emoji: "🧘" },
      { label: "More energy", value: "energy", emoji: "⚡" },
      { label: "Weight loss support", value: "weight_loss", emoji: "⚖️" },
      { label: "Muscle & training", value: "muscle", emoji: "💪" },
      { label: "Heart health", value: "heart", emoji: "❤️" },
    ],
  },
  {
    id: "gut",
    question: "Do you have gut / digestion issues?",
    options: [
      { label: "Yes", value: "yes", emoji: "🫤" },
      { label: "No", value: "no", emoji: "✅" },
    ],
  },
  {
    id: "budget",
    question: "What's your monthly supplement budget?",
    options: [
      { label: "$ — keep it lean", value: "$", emoji: "💵" },
      { label: "$$ — solid mid-range", value: "$$", emoji: "💰" },
      { label: "$$$ — premium is fine", value: "$$$", emoji: "💎" },
    ],
  },
  {
    id: "alreadySupplementing",
    question: "Are you already taking supplements?",
    options: [
      { label: "Yes", value: "yes", emoji: "💊" },
      { label: "No", value: "no", emoji: "🌱" },
    ],
    freeTextWhen: "yes",
  },
];

export default function QuizPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [whichSupplements, setWhichSupplements] = useState("");
  const [savedPlan, setSavedPlan] = useState<QuizAnswers | null>(null);

  useEffect(() => {
    setSavedPlan(loadQuizAnswers());
  }, []);

  const question = questions[current];
  const progress = Math.round(((current + 1) / questions.length) * 100);
  const needsFreeText =
    question.freeTextWhen && selected === question.freeTextWhen;

  function handleNext() {
    if (!selected) return;

    const nextAnswers = { ...answers, [question.id]: selected };
    if (question.id === "alreadySupplementing" && selected === "yes") {
      nextAnswers.whichSupplements = whichSupplements.trim();
    }
    setAnswers(nextAnswers);
    setSelected(null);
    setWhichSupplements("");

    if (current + 1 >= questions.length) {
      saveQuizAnswers({
        goal: nextAnswers.goal,
        gut: nextAnswers.gut,
        budget: nextAnswers.budget,
        alreadySupplementing: nextAnswers.alreadySupplementing,
        whichSupplements: nextAnswers.whichSupplements || "",
      });
      router.push("/quiz/results");
      return;
    }
    setCurrent((c) => c + 1);
  }

  function startFresh() {
    clearQuizAnswers();
    setSavedPlan(null);
    setCurrent(0);
    setAnswers({});
    setSelected(null);
    setWhichSupplements("");
  }

  return (
    <>
      <Navbar />
      <CategoryNavStrip active="quiz" />
      <main className="min-h-[calc(100dvh-3.5rem)] bg-cream flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16">
          <div className="w-full max-w-2xl">
            {savedPlan ? (
              <div className="text-center">
                <p className="text-leaf-500 text-xs font-bold tracking-[3px] uppercase mb-3">
                  Welcome back
                </p>
                <h1 className="font-display font-black text-3xl sm:text-4xl text-bark mb-3">
                  Here&apos;s your plan
                </h1>
                <p className="text-gray-500 text-base mb-8">
                  We saved your last quiz answers. Jump back to your picks or
                  retake the quiz.
                </p>
                <Link
                  href="/quiz/results"
                  className="affiliate-btn max-w-md mx-auto mb-4 block no-underline"
                >
                  View my personalized picks →
                </Link>
                <button
                  type="button"
                  onClick={startFresh}
                  className="text-gray-400 text-sm hover:text-gray-600 underline bg-transparent border-0 cursor-pointer min-h-[44px]"
                >
                  Retake quiz
                </button>
              </div>
            ) : (
              <div>
                <div className="text-center mb-8 sm:mb-10">
                  <p className="text-leaf-500 text-xs font-bold tracking-[3px] uppercase mb-3">
                    2-Minute Quiz
                  </p>
                  <h1 className="font-display font-black text-3xl sm:text-4xl text-bark">
                    Find your personalized picks
                  </h1>
                </div>

                <div className="mb-6 sm:mb-8">
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

                <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-5 sm:p-8 shadow-sm">
                  <h2 className="font-display font-bold text-xl sm:text-2xl text-bark mb-5 sm:mb-6">
                    {question.question}
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 sm:mb-8">
                    {question.options.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setSelected(opt.value)}
                        className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-150 cursor-pointer min-h-[56px] active:scale-[0.98]
                        ${
                          selected === opt.value
                            ? "border-leaf-500 bg-leaf-50 text-leaf-700"
                            : "border-gray-100 bg-gray-50 hover:border-leaf-200 hover:bg-leaf-50 text-bark"
                        }`}
                      >
                        <span className="text-2xl shrink-0">{opt.emoji}</span>
                        <span className="font-medium text-sm leading-snug">
                          {opt.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  {needsFreeText ? (
                    <div className="mb-6">
                      <label
                        htmlFor="which-supps"
                        className="block text-xs font-bold text-bark uppercase tracking-wide mb-2"
                      >
                        Which ones? (optional notes)
                      </label>
                      <input
                        id="which-supps"
                        value={whichSupplements}
                        onChange={(e) => setWhichSupplements(e.target.value)}
                        placeholder="e.g. vitamin D, fish oil"
                        className="w-full min-h-[48px] px-4 rounded-xl border border-gray-200 text-sm"
                      />
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!selected}
                    className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-200 min-h-[52px]
                    ${
                      selected
                        ? "bg-leaf-500 hover:bg-leaf-600 text-white cursor-pointer active:scale-[0.98]"
                        : "bg-gray-100 text-gray-300 cursor-not-allowed"
                    }`}
                  >
                    {current + 1 === questions.length
                      ? "See my picks →"
                      : "Next question →"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
