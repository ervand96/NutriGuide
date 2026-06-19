import { NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/posts";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET(
  req: Request,
  { params }: { params: { slug: string } },
) {
  const slug = params.slug;
  const post = getPostBySlug(slug);

  const title =
    post?.title ||
    slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const subtitle = post?.description || "Honest nutrition reviews & guides";
  const safeTitle = escapeXml(title);
  const safeSubtitle = escapeXml(subtitle);

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#f4fbf0"/>
        <stop offset="100%" stop-color="#e3f2da"/>
      </linearGradient>
      <linearGradient id="accent" x1="0" x2="1">
        <stop offset="0%" stop-color="#6fa96d"/>
        <stop offset="100%" stop-color="#2f6f3d"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bg)"/>
    <circle cx="970" cy="140" r="70" fill="#dcefd1"/>
    <circle cx="1030" cy="490" r="110" fill="#f7f6d7"/>
    <rect x="60" y="60" width="1080" height="510" rx="28" fill="#ffffff"/>
    <rect x="90" y="90" width="4" height="450" rx="2" fill="url(#accent)"/>
    <text x="118" y="170" fill="#4a7c59" font-size="22" font-family="Arial, sans-serif" font-weight="700">NutriGuide</text>
    <text x="118" y="255" fill="#1f2937" font-size="42" font-family="Arial, sans-serif" font-weight="700">${safeTitle}</text>
    <text x="118" y="335" fill="#6b7280" font-size="22" font-family="Arial, sans-serif">${safeSubtitle}</text>
    <rect x="118" y="395" width="250" height="56" rx="14" fill="url(#accent)"/>
    <text x="155" y="432" fill="#ffffff" font-size="20" font-family="Arial, sans-serif" font-weight="700">Read the full guide</text>
    <text x="118" y="520" fill="#9ca3af" font-size="18" font-family="Arial, sans-serif">nutrition • wellness • healthy habits</text>
  </svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
