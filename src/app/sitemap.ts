import { getAllPosts } from "@/lib/posts";

export default function sitemap() {
  const baseUrl = "https://www.nutriguide.com";
  const posts = getAllPosts();

  const postEntries = posts.map((post) => ({
    url: `${baseUrl}/category/${post.category.toLowerCase()}/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/quiz`,
      lastModified: new Date(),
    },
    ...postEntries,
  ];
}
