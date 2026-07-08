import { NextRequest, NextResponse } from "next/server";
import { productBrand, productVisual } from "@/lib/product-visual.js";

export const runtime = "nodejs";

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name") || "Supplement";
  const brand = productBrand(name);
  const visual = productVisual(name);
  const emoji = visual.emoji;

  const gradients: Record<string, [string, string]> = {
    "from-sky-50 to-blue-100": ["#f0f9ff", "#dbeafe"],
    "from-cyan-50 to-teal-100": ["#ecfeff", "#ccfbf1"],
    "from-violet-50 to-purple-100": ["#f5f3ff", "#ede9fe"],
    "from-green-50 to-emerald-100": ["#f0fdf4", "#d1fae5"],
    "from-amber-50 to-yellow-100": ["#fffbeb", "#fef3c7"],
    "from-lime-50 to-green-100": ["#f7fee7", "#dcfce7"],
    "from-indigo-50 to-blue-100": ["#eef2ff", "#dbeafe"],
    "from-orange-50 to-red-100": ["#fff7ed", "#ffedd5"],
    "from-gray-50 to-slate-100": ["#f9fafb", "#f1f5f9"],
  };
  const [c1, c2] = gradients[visual.bg] || ["#f9fafb", "#f1f5f9"];

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${c1}"/>
      <stop offset="100%" style="stop-color:${c2}"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bg)"/>
  <rect x="120" y="80" width="160" height="220" rx="24" fill="white" opacity="0.92"/>
  <rect x="135" y="95" width="130" height="80" rx="8" fill="${c2}"/>
  <text x="200" y="200" font-size="72" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
  <text x="200" y="330" font-family="system-ui,sans-serif" font-size="14" font-weight="700" fill="#374151" text-anchor="middle">${escapeXml(brand.slice(0, 28))}</text>
  <text x="200" y="355" font-family="system-ui,sans-serif" font-size="11" fill="#9ca3af" text-anchor="middle">NutriGuide Pick</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
