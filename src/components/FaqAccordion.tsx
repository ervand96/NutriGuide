"use client";

import { useState } from "react";

interface Faq {
  q: string;
  a: string;
}

export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div
            key={f.q}
            className="bg-leaf-50 border border-leaf-100 rounded-2xl overflow-hidden"
          >
            <button
              type="button"
              className="w-full flex items-center justify-between gap-4 text-left p-5 sm:p-6 min-h-[56px]"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : i)}
            >
              <span className="font-display font-bold text-bark text-sm sm:text-base">
                {f.q}
              </span>
              <span
                className={`shrink-0 text-leaf-600 text-xl leading-none transition-transform duration-200 ${
                  isOpen ? "rotate-45" : ""
                }`}
                aria-hidden
              >
                +
              </span>
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-gray-500 text-sm leading-relaxed -mt-1">
                  {f.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
