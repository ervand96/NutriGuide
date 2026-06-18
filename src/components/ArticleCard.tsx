import Link from "next/link";
import { Article } from "@/types";

export default function ArticleCard({ article }: { article: Article }) {
  const categoryColors: Record<string, string> = {
    Diets: "bg-green-50 text-green-700",
    Supplements: "bg-blue-50 text-blue-700",
    Reviews: "bg-amber-50 text-amber-700",
    Tips: "bg-purple-50 text-purple-700",
  };

  return (
    <Link href={`/blog/${article.slug}`} className="no-underline">
      <div className="card cursor-pointer h-full flex flex-col">
        <span
          className={`inline-block text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 ${categoryColors[article.category] || "bg-gray-50 text-gray-600"}`}
        >
          {article.category}
        </span>
        <h3 className="font-display font-bold text-lg leading-snug text-bark mb-3 flex-1">
          {article.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4">
          {article.description}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-4 border-t border-gray-50">
          <span>{article.readTime}</span>
          <span>
            {article.date ? new Date(article.date).toLocaleDateString() : ""}
          </span>
        </div>
      </div>
    </Link>
  );
}
