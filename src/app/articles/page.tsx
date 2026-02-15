import { Metadata } from "next";
import ArticleCard from "@/components/ArticleCard";
import { articles } from "@/data/articles";

export const metadata: Metadata = {
  title: "記事一覧 — DojoC",
  description: "サイバーセキュリティに関する最新の記事を無料でお読みいただけます。",
};

export default function ArticlesPage() {
  const categories = Array.from(new Set(articles.map((a) => a.category)));

  return (
    <>
      {/* Page Header */}
      <section className="bg-hero-pattern py-16">
        <div className="container-narrow text-center">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            セキュリティ記事
          </h1>
          <p className="mt-3 text-lg text-dark-300">
            最新の脅威情報から実践的な対策まで、すべて無料でお読みいただけます
          </p>

          {/* Category Tags */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <span key={cat} className="badge-teal">
                {cat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Article List */}
      <section className="py-12 sm:py-16">
        <div className="container-narrow">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>

          {/* Load More Placeholder */}
          <div className="mt-12 text-center">
            <p className="text-sm text-dark-500">
              現在 {articles.length} 本の記事を公開中。新着記事は毎週追加されます。
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
