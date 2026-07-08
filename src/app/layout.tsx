import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#2D7A3A",
};

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
    types: {
      "application/rss+xml": `${siteUrl}/rss.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  verification: {
    google: "uqylzVectumXuyrmQ6We8IjpAhHXvYQrvdxS-0_HZ0I",
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
    <html lang="en" className={inter.variable}>
      <body className="font-body">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
