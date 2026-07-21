"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "ng_email_popup_dismissed";
const DISMISS_DAYS = 7;

function wasDismissed() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const until = Number(raw);
    return Number.isFinite(until) && Date.now() < until;
  } catch {
    return false;
  }
}

function dismiss() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      String(Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000),
    );
  } catch {
    /* ignore */
  }
}

export default function EmailCapturePopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );

  useEffect(() => {
    if (typeof window === "undefined" || wasDismissed()) return;

    let shown = false;
    const show = () => {
      if (shown || wasDismissed()) return;
      shown = true;
      setOpen(true);
    };

    const onScroll = () => {
      const doc = document.documentElement;
      const scrolled =
        (window.scrollY + window.innerHeight) / Math.max(doc.scrollHeight, 1);
      if (scrolled >= 0.5) show();
    };

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) show();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  function close() {
    dismiss();
    setOpen(false);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/quiz-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, diet: "newsletter-popup" }),
      });
      if (!res.ok) throw new Error("fail");
      setStatus("ok");
      setEmail("");
      dismiss();
      setTimeout(() => setOpen(false), 1600);
    } catch {
      setStatus("error");
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-4 bg-bark/40 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="email-popup-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl border border-gray-100 p-5 sm:p-6 animate-[fadeIn_0.2s_ease-out]">
        <button
          type="button"
          onClick={close}
          className="absolute top-3 right-3 w-9 h-9 rounded-full text-gray-400 hover:text-bark hover:bg-gray-50 text-xl leading-none"
          aria-label="Close"
        >
          ×
        </button>

        <p className="text-leaf-600 text-xs font-bold uppercase tracking-widest mb-1">
          Free weekly picks
        </p>
        <h2
          id="email-popup-title"
          className="font-display font-black text-xl text-bark mb-2 pr-8"
        >
          Get deal alerts before they sell out
        </h2>
        <p className="text-gray-500 text-sm mb-4 leading-relaxed">
          New reviews + iHerb / MyProtein drops — once a week. No spam.
        </p>

        {status === "ok" ? (
          <p className="text-leaf-600 font-bold text-sm">You&apos;re in. Thanks!</p>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <label className="sr-only" htmlFor="popup-email">
              Email
            </label>
            <input
              id="popup-email"
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="min-h-[48px] px-4 rounded-xl border border-gray-200 text-bark text-sm focus:outline-none focus:ring-2 focus:ring-leaf-500/40 focus:border-leaf-500"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="min-h-[48px] rounded-xl bg-leaf-500 hover:bg-leaf-600 disabled:opacity-60 text-white font-bold text-sm transition-colors"
            >
              {status === "loading" ? "Saving…" : "Subscribe free →"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="text-red-600 text-xs mt-2">
            Something went wrong — try again or{" "}
            <Link href="/quiz" className="underline text-leaf-600">
              take the quiz
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}
