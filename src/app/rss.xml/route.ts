import { getAllPosts } from "@/lib/posts";

export async function GET() {
  const posts = getAllPosts();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>NutriGuide</title>
    <link>https://www.nutriguide.com</link>
    <description>Nutrition reviews, diets, and supplement guides</description>
    ${posts
      .slice(0, 15)
      .map(
        (post) => `
    <item>
      <title>${post.title}</title>
      <link>https://www.nutriguide.com/category/${post.category.toLowerCase()}/${post.slug}</link>
      <description>${post.description}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`,
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
