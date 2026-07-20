"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function NewsletterStrip() {
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
        body: JSON.stringify({ email, diet: "newsletter" }),
      });
      if (!res.ok) throw new Error("fail");
      setStatus("ok");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="bg-gradient-to-b from-leaf-50 to-cream border-y border-leaf-100 py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-leaf-600 text-xs font-bold uppercase tracking-widest mb-2">
          Free weekly email
        </p>
        <h2 className="font-display font-black text-2xl sm:text-3xl text-bark mb-2">
          Get weekly pick alerts
        </h2>
        <p className="text-gray-500 text-sm sm:text-base mb-6 leading-relaxed">
          New reviews, stack ideas, and iHerb / MyProtein deal drops — once a
          week. No spam. Unsubscribe anytime.
        </p>

        {status === "ok" ? (
          <p className="text-leaf-600 font-bold text-sm sm:text-base">
            You&apos;re in — check your inbox soon.
          </p>
        ) : (
          <form
            onSubmit={onSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <label className="sr-only" htmlFor="newsletter-email">
              Email
            </label>
            <input
              id="newsletter-email"
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
              {status === "loading" ? "Saving…" : "Subscribe →"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="text-red-600 text-xs mt-3">
            Something went wrong — try again or use the{" "}
            <Link href="/quiz" className="underline text-leaf-600">
              quiz
            </Link>
            .
          </p>
        )}

        <p className="text-gray-400 text-xs mt-4">
          Prefer a personalized plan?{" "}
          <Link href="/quiz" className="text-leaf-600 font-semibold no-underline hover:underline">
            Take the 2-minute quiz →
          </Link>
        </p>
      </div>
    </section>
  );
}
