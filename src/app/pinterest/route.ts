import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://nutri-guide-indol.vercel.app";

export async function GET() {
  const posts = getAllPosts().slice(0, 12);

  const payload = posts.map((post) => ({
    title: post.title,
    description: post.description,
    url: `${siteUrl}/category/${post.category.toLowerCase()}/${post.slug}`,
    imageUrl: `${siteUrl}/og/${post.slug}`,
    board: "Nutrition Guides",
    tags: [post.category.toLowerCase(), "nutrition", "wellness"],
  }));

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "public, max-age=300",
    },
  });
}
