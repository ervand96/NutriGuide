import { getAllPosts } from "@/lib/posts";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://nutri-guide-indol.vercel.app";

const staticRoutes = [
  "",
  "/quiz",
  "/about",
  "/contact",
  "/privacy-policy",
  "/affiliate-disclosure",
  "/category/diets",
  "/category/reviews",
  "/category/supplements",
];

export default function sitemap() {
  const posts = getAllPosts();
  const now = new Date();

  const staticEntries = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
  }));

  const postEntries = posts.map((post) => ({
    url: `${siteUrl}/category/${post.category.toLowerCase()}/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  return [...staticEntries, ...postEntries];
}
