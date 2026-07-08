import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "src/content/posts");

const categories = ["diets", "reviews", "supplements"];

const ALLOWED_CATEGORIES = ["Diets", "Reviews", "Supplements", "Tips"];

// ─────────────────────────────
// SAFE HELPERS
// ─────────────────────────────
function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function safeDate(date) {
  if (!date) return new Date().toISOString().split("T")[0];
  return String(date);
}

function safeCategory(cat) {
  return ALLOWED_CATEGORIES.includes(cat) ? cat : "Diets";
}

// ─────────────────────────────
// READ ALL FILES
// ─────────────────────────────
function getAllFiles(dir, files = []) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);

    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, files);
    } else if (item.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

// ─────────────────────────────
// GET ALL POSTS
// ─────────────────────────────
export function getAllPosts() {
  let all = [];

  for (const cat of categories) {
    const dir = path.join(postsDirectory, cat);

    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);

      const raw = fs.readFileSync(filePath, "utf8");

      const { data, content } = matter(raw);

      all.push({
        slug: file.replace(".md", ""),
        category: safeCategory(data.category || cat),
        title: data.title || file.replace(".md", ""),
        description: data.description || content.slice(0, 120),
        readTime: data.readTime || "5 min read",
        date: safeDate(data.date),
        featured: Boolean(data.featured),
        content,
        products: safeArray(data.products),
      });
    }
  }

  return all.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

// ─────────────────────────────
// GET SINGLE POST
// ─────────────────────────────
export function getPostBySlug(slug) {
  for (const cat of categories) {
    const filePath = path.join(postsDirectory, cat, `${slug}.md`);

    if (!fs.existsSync(filePath)) continue;

    const raw = fs.readFileSync(filePath, "utf8");

    const { data, content } = matter(raw);

    return {
      slug,
      title: data.title || slug,
      description: data.description || content.slice(0, 120),
      category: safeCategory(data.category),
      date: safeDate(data.date),
      readTime: data.readTime || "5 min read",
      featured: Boolean(data.featured),
      content,
      products: safeArray(data.products),
    };
  }

  return null;
}
