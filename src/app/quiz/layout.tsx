import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo.js";

export const metadata: Metadata = pageMetadata({
  title: "Find Your Perfect Diet — Free 2-Minute Quiz",
  description:
    "Answer a few questions and get a practical diet match plus supplement starter tips. Free NutriGuide quiz — then shop iHerb or MyProtein if you need essentials.",
  path: "/quiz",
});

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
