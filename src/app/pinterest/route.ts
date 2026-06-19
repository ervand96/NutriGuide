import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";

export async function GET() {
  const posts = getAllPosts().slice(0, 12);

  const payload = posts.map((post) => ({
    title: post.title,
    description: post.description,
    url: `https://www.nutriguide.com/category/${post.category.toLowerCase()}/${post.slug}`,
    imageUrl: `https://www.nutriguide.com/og/${post.slug}`,
    board: "Nutrition Guides",
    tags: [post.category.toLowerCase(), "nutrition", "wellness"],
  }));

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "public, max-age=300",
    },
  });
}
