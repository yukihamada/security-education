import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles } from "@/data/articles";
import { courses } from "@/data/courses";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return { title: "記事が見つかりません" };
  return {
    title: `${article.title} — DojoC`,
    description: article.description,
    openGraph: {
      title: `${article.title} — DojoC`,
      description: article.description,
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author],
      tags: article.tags,
    },
  };
}

function renderContent(content: string) {
  // Simple markdown-like rendering
  return content.split("\n\n").map((block, i) => {
    const trimmed = block.trim();

    if (trimmed.startsWith("## ")) {
      return (
        <h2 key={i} className="mb-3 mt-8 text-xl font-bold text-white">
          {trimmed.replace("## ", "")}
        </h2>
      );
    }
    if (trimmed.startsWith("### ")) {
      return (
        <h3 key={i} className="mb-2 mt-6 text-lg font-semibold text-dark-200">
          {trimmed.replace("### ", "")}
        </h3>
      );
    }

    // List items
    if (trimmed.includes("\n- ") || trimmed.startsWith("- ")) {
      const lines = trimmed.split("\n");
      const nonListLines = lines.filter((l) => !l.startsWith("- "));
      const listLines = lines.filter((l) => l.startsWith("- "));

      return (
        <div key={i}>
          {nonListLines.length > 0 && nonListLines[0].trim() && (
            <p className="mb-2 leading-relaxed text-dark-300">
              {nonListLines[0]}
            </p>
          )}
          <ul className="mb-4 ml-6 list-disc space-y-1 text-dark-300">
            {listLines.map((line, j) => (
              <li key={j} className="leading-relaxed">
                {renderInlineFormatting(line.replace(/^- /, ""))}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    // Numbered list
    if (/^\d+\.\s/.test(trimmed)) {
      const items = trimmed.split("\n").filter((l) => /^\d+\.\s/.test(l));
      return (
        <ol key={i} className="mb-4 ml-6 list-decimal space-y-1 text-dark-300">
          {items.map((line, j) => (
            <li key={j} className="leading-relaxed">
              {renderInlineFormatting(line.replace(/^\d+\.\s/, ""))}
            </li>
          ))}
        </ol>
      );
    }

    // Checkbox list
    if (trimmed.includes("- [ ]") || trimmed.includes("- [x]")) {
      const lines = trimmed.split("\n").filter((l) => l.startsWith("- ["));
      return (
        <ul key={i} className="mb-4 ml-4 space-y-1 text-dark-300">
          {lines.map((line, j) => {
            const checked = line.includes("[x]");
            const text = line.replace(/^- \[.\]\s?/, "");
            return (
              <li key={j} className="flex items-start gap-2 leading-relaxed">
                <input
                  type="checkbox"
                  checked={checked}
                  readOnly
                  className="mt-1.5 h-4 w-4 rounded border-dark-600 bg-dark-800 text-primary-600"
                />
                <span>{renderInlineFormatting(text)}</span>
              </li>
            );
          })}
        </ul>
      );
    }

    // Regular paragraph
    return (
      <p key={i} className="mb-4 leading-relaxed text-dark-300">
        {renderInlineFormatting(trimmed)}
      </p>
    );
  });
}

function renderInlineFormatting(text: string) {
  // Bold: **text**
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-white">
        {part}
      </strong>
    ) : (
      part
    )
  );
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  // Related articles
  const relatedArticles = (article.relatedSlugs || [])
    .map((slug) => articles.find((a) => a.slug === slug))
    .filter(Boolean);

  // Related course suggestion
  const suggestedCourse = courses[0];

  return (
    <>
      {/* Article Header */}
      <section className="bg-hero-pattern py-12 sm:py-16">
        <div className="container-narrow">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/articles"
              className="inline-flex items-center gap-1 text-sm text-dark-400 hover:text-primary-400 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              記事一覧に戻る
            </Link>

            <div className="mt-4 flex items-center gap-3">
              <span className="badge-teal">{article.category}</span>
              <span className="flex items-center gap-1 text-sm text-dark-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                {article.readTime}分で読める
              </span>
            </div>

            <h1 className="mt-4 text-2xl font-extrabold leading-tight text-white sm:text-3xl lg:text-4xl">
              {article.title}
            </h1>

            <div className="mt-4 flex items-center gap-4 text-sm text-dark-400">
              <span>{article.author}</span>
              <span>|</span>
              <span>{article.publishedAt}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-10 sm:py-14">
        <div className="container-narrow">
          <div className="mx-auto max-w-3xl">
            <div className="prose-article">{renderContent(article.content)}</div>

            {/* Tags */}
            <div className="mt-10 flex flex-wrap gap-2 border-t border-dark-700/50 pt-6">
              {article.tags.map((tag) => (
                <span key={tag} className="badge-slate">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="mt-10 rounded-xl border border-dark-700/50 bg-dark-800/50 p-6 sm:p-8">
                <h3 className="text-lg font-bold text-white">関連記事</h3>
                <div className="mt-4 space-y-3">
                  {relatedArticles.map((related) => (
                    <Link
                      key={related!.slug}
                      href={`/articles/${related!.slug}`}
                      className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-dark-700/50"
                    >
                      <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary-500/20 text-primary-400">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-white">{related!.title}</p>
                        <p className="mt-0.5 text-sm text-dark-400">{related!.readTime}分で読める</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Course CTA */}
            <div className="mt-10 rounded-xl border border-primary-500/30 bg-primary-500/10 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="hidden sm:flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">
                    もっと深く学びたい方へ
                  </h3>
                  <p className="mt-1 text-sm text-dark-300">
                    「{suggestedCourse.title}」では、この記事の内容をさらに深掘りし、
                    実践的なスキルを身につけることができます。
                  </p>
                  <Link
                    href={`/courses/${suggestedCourse.slug}`}
                    className="btn-primary mt-4 !px-5 !py-2.5 !text-sm"
                  >
                    講座の詳細を見る（&yen;{suggestedCourse.price.toLocaleString()}）
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
