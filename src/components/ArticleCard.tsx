import Link from "next/link";
import { Article } from "@/types";

const categoryColors: Record<string, string> = {
  基礎知識: "bg-accent-500/20 text-accent-300",
  脅威対策: "bg-red-500/20 text-red-300",
  企業セキュリティ: "bg-blue-500/20 text-blue-300",
  ネットワーク: "bg-purple-500/20 text-purple-300",
};

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/articles/${article.slug}`} className="card group block overflow-hidden">
      {/* Color Bar */}
      <div className="h-1 bg-gradient-to-r from-primary-600 to-primary-400" />

      <div className="p-6">
        {/* Category & Meta */}
        <div className="mb-3 flex items-center gap-3">
          <span
            className={`badge ${
              categoryColors[article.category] || "badge-slate"
            }`}
          >
            {article.category}
          </span>
          <span className="text-xs text-dark-500">{article.readTime}分で読める</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold leading-snug text-white group-hover:text-primary-400 transition-colors">
          {article.title}
        </h3>

        {/* Description */}
        <p className="mt-2 text-sm leading-relaxed text-dark-400 line-clamp-2">
          {article.description}
        </p>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-dark-700/50 pt-4">
          <span className="text-xs text-dark-500">{article.publishedAt}</span>
          <span className="text-sm font-medium text-primary-400 group-hover:underline">
            続きを読む
          </span>
        </div>
      </div>
    </Link>
  );
}
