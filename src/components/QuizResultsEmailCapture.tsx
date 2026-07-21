"use client";

import { FormEvent, useState } from "react";

export default function QuizResultsEmailCapture({
  goal,
  recommendedProduct,
}: {
  goal: string;
  recommendedProduct: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/quiz-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          diet: "quiz-results",
          source: "quiz-results",
          quiz_goal: goal,
          recommended_product: recommendedProduct,
        }),
      });
      if (!res.ok) throw new Error("fail");
      setStatus("ok");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="mb-8 rounded-2xl border border-leaf-100 bg-leaf-50/70 p-5 sm:p-7">
      <h2 className="font-display font-black text-xl sm:text-2xl text-bark mb-1">
        Want a reminder before you run out?
      </h2>
      <p className="text-gray-500 text-sm mb-5 leading-relaxed">
        We&apos;ll email you a restock reminder + your saved picks.
      </p>

      {status === "ok" ? (
        <p className="text-leaf-700 font-bold text-sm sm:text-base">
          ✓ Saved! Check your inbox.
        </p>
      ) : (
        <form
          onSubmit={onSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-xl"
        >
          <label className="sr-only" htmlFor="quiz-results-email">
            Email
          </label>
          <input
            id="quiz-results-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="flex-1 min-h-[48px] px-4 rounded-xl border border-gray-200 bg-white text-bark text-sm focus:outline-none focus:ring-2 focus:ring-leaf-500/40 focus:border-leaf-500"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="min-h-[48px] px-6 rounded-xl bg-leaf-500 hover:bg-leaf-600 disabled:opacity-60 text-white font-bold text-sm transition-colors active:scale-[0.98]"
          >
            {status === "loading" ? "Saving…" : "Save my plan"}
          </button>
        </form>
      )}

      {status === "error" ? (
        <p className="text-red-600 text-xs mt-3">
          Something went wrong — try again in a moment.
        </p>
      ) : null}
    </section>
  );
}
