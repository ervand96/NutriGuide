import { getAllPosts } from "@/lib/posts";
import { SITE_URL } from "@/lib/seo.js";

const staticRoutes = [
  { path: "", priority: 1, changeFrequency: "daily" as const },
  { path: "/best-picks", priority: 0.95, changeFrequency: "daily" as const },
  { path: "/quiz", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/category/diets", priority: 0.85, changeFrequency: "weekly" as const },
  { path: "/category/reviews", priority: 0.85, changeFrequency: "weekly" as const },
  { path: "/category/supplements", priority: 0.85, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.4, changeFrequency: "monthly" as const },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/affiliate-disclosure", priority: 0.4, changeFrequency: "yearly" as const },
];

export default function sitemap() {
  const posts = getAllPosts();
  const now = new Date();

  const staticEntries = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const postEntries = posts.map((post) => ({
    url: `${SITE_URL}/category/${post.category.toLowerCase()}/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...postEntries];
}
