"use client";

import { FormEvent, useMemo, useState } from "react";
import AffiliateButton from "./AffiliateButton";
import { dosageKeyForSlug } from "@/lib/dosage.js";

export { dosageKeyForSlug };

type SupplementKey = "magnesium" | "ashwagandha" | "creatine";

type GoalKey = string;

type DoseConfig = {
  label: string;
  goals: { value: GoalKey; label: string }[];
  calculate: (
    weightKg: number,
    goal: GoalKey,
  ) => { min: number; max: number; unit: string; timing: string };
  shopQuery: string;
  shopLabel: string;
  partner: "iherb" | "myprotein";
};

const CONFIG: Record<SupplementKey, DoseConfig> = {
  magnesium: {
    label: "Magnesium",
    goals: [
      { value: "sleep", label: "Sleep / relaxation" },
      { value: "stress", label: "Stress / calm" },
      { value: "cramps", label: "Muscle cramps" },
      { value: "general", label: "General wellness" },
    ],
    calculate(weightKg, goal) {
      const base: Record<string, [number, number]> = {
        sleep: [200, 300],
        stress: [200, 350],
        cramps: [250, 350],
        general: [200, 300],
      };
      const [min, max] = base[goal] || base.general;
      // Mild weight adjustment around a 70 kg baseline
      const factor = Math.min(1.25, Math.max(0.85, weightKg / 70));
      return {
        min: Math.round(min * factor),
        max: Math.round(max * factor),
        unit: "mg elemental magnesium",
        timing:
          goal === "sleep"
            ? "30–60 min before bed"
            : "with food, split morning/evening if needed",
      };
    },
    shopQuery: "NOW Foods Magnesium Glycinate",
    shopLabel: "Shop magnesium glycinate →",
    partner: "iherb",
  },
  ashwagandha: {
    label: "Ashwagandha",
    goals: [
      { value: "stress", label: "Stress relief" },
      { value: "sleep", label: "Sleep support" },
      { value: "focus", label: "Focus / mood" },
      { value: "general", label: "General adaptogen use" },
    ],
    calculate(_weightKg, goal) {
      const base: Record<string, [number, number]> = {
        stress: [300, 600],
        sleep: [300, 600],
        focus: [300, 600],
        general: [250, 500],
      };
      const [min, max] = base[goal] || base.general;
      return {
        min,
        max,
        unit: "mg KSM-66 (or similar root extract)",
        timing:
          goal === "sleep"
            ? "evening, with or without food"
            : "morning or split AM/PM with food",
      };
    },
    shopQuery: "NOW Foods KSM-66 Ashwagandha",
    shopLabel: "Shop ashwagandha KSM-66 →",
    partner: "iherb",
  },
  creatine: {
    label: "Creatine",
    goals: [
      { value: "strength", label: "Strength / power" },
      { value: "muscle", label: "Muscle support" },
      { value: "general", label: "General performance" },
    ],
    calculate(weightKg, goal) {
      const base = goal === "muscle" ? 5 : 3;
      const high = weightKg >= 90 ? base + 2 : base + 1;
      return {
        min: base,
        max: Math.max(base, high),
        unit: "g creatine monohydrate",
        timing: "any time daily — consistency matters more than timing",
      };
    },
    shopQuery: "Thorne Creatine",
    shopLabel: "Shop creatine monohydrate →",
    partner: "myprotein",
  },
};

export default function DosageCalculator({
  supplement,
  source = "dosage-calculator",
}: {
  supplement: SupplementKey;
  source?: string;
}) {
  const config = CONFIG[supplement];
  const [unit, setUnit] = useState<"kg" | "lb">("kg");
  const [weight, setWeight] = useState(70);
  const [goal, setGoal] = useState(config.goals[0].value);
  const [submitted, setSubmitted] = useState(false);

  const weightKg = unit === "kg" ? weight : weight / 2.20462;

  const result = useMemo(() => {
    if (!submitted) return null;
    return config.calculate(weightKg, goal);
  }, [submitted, config, weightKg, goal]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="my-8 sm:my-10 rounded-2xl border border-leaf-100 bg-leaf-50/60 p-5 sm:p-7">
      <p className="text-leaf-600 text-xs font-bold uppercase tracking-widest mb-1">
        Interactive tool
      </p>
      <h2 className="font-display font-black text-xl sm:text-2xl text-bark mb-1">
        {config.label} dosage calculator
      </h2>
      <p className="text-gray-500 text-sm mb-5 leading-relaxed">
        Get a practical starting range based on your goal — then shop a
        well-reviewed pick.
      </p>

      <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-bold text-bark uppercase tracking-wide mb-2">
            Body weight
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min={unit === "kg" ? 35 : 77}
              max={unit === "kg" ? 180 : 400}
              step={1}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value) || 0)}
              className="flex-1 min-h-[48px] px-4 rounded-xl border border-gray-200 bg-white text-bark text-sm focus:outline-none focus:ring-2 focus:ring-leaf-500/40"
              required
            />
            <div className="flex rounded-xl border border-gray-200 overflow-hidden bg-white">
              {(["kg", "lb"] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => {
                    if (u === unit) return;
                    setUnit(u);
                    setWeight((w) =>
                      u === "kg"
                        ? Math.round(w / 2.20462)
                        : Math.round(w * 2.20462),
                    );
                    setSubmitted(false);
                  }}
                  className={`px-3 min-h-[48px] text-sm font-bold ${
                    unit === u
                      ? "bg-leaf-500 text-white"
                      : "bg-white text-gray-500"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor={`dose-goal-${supplement}`}
            className="block text-xs font-bold text-bark uppercase tracking-wide mb-2"
          >
            Goal
          </label>
          <select
            id={`dose-goal-${supplement}`}
            value={goal}
            onChange={(e) => {
              setGoal(e.target.value);
              setSubmitted(false);
            }}
            className="w-full min-h-[48px] px-4 rounded-xl border border-gray-200 bg-white text-bark text-sm focus:outline-none focus:ring-2 focus:ring-leaf-500/40"
          >
            {config.goals.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            className="min-h-[48px] px-6 rounded-xl bg-leaf-500 hover:bg-leaf-600 text-white font-bold text-sm transition-colors"
          >
            Calculate dose →
          </button>
        </div>
      </form>

      {result ? (
        <div className="mt-5 rounded-2xl bg-white border border-leaf-100 p-5">
          <p className="font-display font-bold text-bark text-base sm:text-lg mb-1">
            Recommended: {result.min}–{result.max}
            {result.unit.startsWith("g") ? "" : " "}
            {result.unit}, taken {result.timing}
          </p>
          <p className="text-gray-400 text-xs leading-relaxed mb-4">
            This is a general estimate, not medical advice. Consult a healthcare
            provider before starting any supplement.
          </p>
          <AffiliateButton
            partner={config.partner}
            source={source}
            query={config.shopQuery}
            className="w-full sm:w-auto min-h-[48px]"
          >
            {config.shopLabel}
          </AffiliateButton>
        </div>
      ) : null}
    </section>
  );
}

// dosageKeyForSlug re-exported from @/lib/dosage.js above
