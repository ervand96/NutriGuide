import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo.js";

export const metadata: Metadata = pageMetadata({
  title: "Personalized Supplement Quiz — Free 2-Minute Plan",
  description:
    "Answer a few questions and get personalized supplement picks with shop links. Free NutriGuide quiz — then browse iHerb or MyProtein.",
  path: "/quiz",
});

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
