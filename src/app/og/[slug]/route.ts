import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } },
) {
  const slug = params.slug;
  const title = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#eef7ea"/>
    <rect x="60" y="60" width="1080" height="510" rx="28" fill="#ffffff"/>
    <text x="110" y="170" fill="#4a7c59" font-size="22" font-family="Arial, sans-serif" font-weight="700">NutriGuide</text>
    <text x="110" y="260" fill="#1f2937" font-size="48" font-family="Arial, sans-serif" font-weight="700">${title}</text>
    <text x="110" y="340" fill="#6b7280" font-size="24" font-family="Arial, sans-serif">Honest nutrition reviews & guides</text>
    <rect x="110" y="420" width="220" height="60" rx="12" fill="#5c8d4f"/>
    <text x="155" y="458" fill="#ffffff" font-size="22" font-family="Arial, sans-serif" font-weight="700">Read the article</text>
  </svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
