import type { Metadata } from "next";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://nutri-guide-indol.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "NutriGuide",
    title: "NutriGuide — Honest Diet & Supplement Reviews",
    description:
      "Science-backed reviews of diets, supplements, and nutrition programs to help you make the right choice.",
    images: [
      {
        url: `${siteUrl}/og/default`,
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
