import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SITE_URL, DEFAULT_DESCRIPTION } from "@/lib/seo.js";
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "NutriGuide — Honest Diet & Supplement Reviews",
    template: "%s | NutriGuide",
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "nutrition reviews",
    "diet advice",
    "supplement guides",
    "best protein powder",
    "creatine review",
    "mediterranean diet",
    "iHerb deals",
    "MyProtein code",
    "healthy eating",
    "weight loss tips",
  ],
  alternates: {
    canonical: SITE_URL,
    types: {
      "application/rss+xml": `${SITE_URL}/rss.xml`,
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
    url: SITE_URL,
    siteName: "NutriGuide",
    title: "NutriGuide — Honest Diet & Supplement Reviews",
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/og/default`,
        width: 1200,
        height: 630,
        alt: "NutriGuide nutrition reviews",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NutriGuide — Honest Diet & Supplement Reviews",
    description: DEFAULT_DESCRIPTION,
    images: [`${SITE_URL}/og/default`],
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
