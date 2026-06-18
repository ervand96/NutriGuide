import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "src/content/posts");

// безопасный массив (чтобы не падал .map)
function safeArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [];
}

// безопасная дата
function safeDate(date) {
  if (!date) return new Date().toISOString().split("T")[0];
  return String(date);
}

// ─────────────────────────────
// GET ALL POSTS (BLOG PAGE)
// ─────────────────────────────
export function getAllPosts() {
  const files = fs.readdirSync(postsDirectory);

  return files.map((file) => {
    const slug = file.replace(".md", "");
    const filePath = path.join(postsDirectory, file);
    const content = fs.readFileSync(filePath, "utf8");

    const { data, content: body } = matter(content);

    return {
      slug,
      title: data.title || slug,
      description: data.description || body.slice(0, 120),
      category: data.category || "Diets",
      date: safeDate(data.date),
      readTime: data.readTime || "5 min read",
      content: body,

      products: safeArray(data.products),
    };
  });
}

// ─────────────────────────────
// GET SINGLE POST (/[slug])
// ─────────────────────────────
export function getPostBySlug(slug) {
  const filePath = path.join(postsDirectory, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, "utf8");
  const { data, content: body } = matter(content);

  return {
    slug,
    title: data.title || slug,
    description: data.description || body.slice(0, 120),
    category: data.category || "Diets",
    date: safeDate(data.date),
    readTime: data.readTime || "5 min read",
    content: body,

    products: safeArray(data.products),
  };
}
