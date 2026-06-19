import { getAllPosts } from "@/lib/posts";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://nutri-guide-indol.vercel.app";

export default function sitemap() {
  const posts = getAllPosts();

  const postEntries = posts.map((post) => ({
    url: `${siteUrl}/category/${post.category.toLowerCase()}/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/quiz`,
      lastModified: new Date(),
    },
    ...postEntries,
  ];
}
