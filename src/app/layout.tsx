import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.nutriguide.com"),
  title: {
    default: "NutriGuide — Honest Diet & Supplement Reviews",
    template: "%s | NutriGuide",
  },
  description:
    "Science-backed reviews of diets, supplements, and nutrition programs to help you make the right choice.",
  keywords: [
    "nutrition reviews",
    "diet advice",
    "supplement guides",
    "healthy eating",
    "weight loss tips",
  ],
  alternates: {
    canonical: "https://www.nutriguide.com",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.nutriguide.com",
    siteName: "NutriGuide",
    title: "NutriGuide — Honest Diet & Supplement Reviews",
    description:
      "Science-backed reviews of diets, supplements, and nutrition programs to help you make the right choice.",
    images: [
      {
        url: "https://www.nutriguide.com/og/default",
        width: 1200,
        height: 630,
        alt: "NutriGuide nutrition reviews",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NutriGuide — Honest Diet & Supplement Reviews",
    description:
      "Science-backed reviews of diets, supplements, and nutrition programs to help you make the right choice.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
