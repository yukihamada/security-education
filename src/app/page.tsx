import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import ArticleCard from "@/components/ArticleCard";
import LearningPath from "@/components/LearningPath";
import CertificatePreview from "@/components/CertificatePreview";
import SecurityQuiz from "@/components/SecurityQuiz";
import EnterpriseSection from "@/components/EnterpriseSection";
import NewsletterForm from "@/components/NewsletterForm";
import CTASection from "@/components/CTASection";
import { articles } from "@/data/articles";

export default function HomePage() {
  const latestArticles = articles.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <HeroSection />

      {/* Learning Path */}
      <LearningPath />

      {/* Features / Why DojoC */}
      <section className="py-20 sm:py-24 border-t border-dark-800/50">
        <div className="container-narrow">
          <div className="text-center">
            <h2 className="section-heading">DojoCが選ばれる理由</h2>
            <p className="section-subheading">
              現役のセキュリティ専門家が監修した実践カリキュラムと、業界最先端のハンズオン環境で確実にスキルアップ
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-xl border border-dark-700/30 bg-dark-900/50 p-6 transition-all duration-300 hover:border-primary-500/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600/10 text-primary-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">体系的なカリキュラム</h3>
              <p className="mt-2 text-sm leading-relaxed text-dark-400">
                初級から上級まで段階的に設計されたカリキュラム。基礎から応用まで、あなたのレベルに合った学びを提供します。
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl border border-dark-700/30 bg-dark-900/50 p-6 transition-all duration-300 hover:border-primary-500/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-500/10 text-accent-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">実践的なハンズオン</h3>
              <p className="mt-2 text-sm leading-relaxed text-dark-400">
                理論だけでなく、CTF環境やケーススタディで実際に手を動かしながら学習。業務で即活用できるスキルが身につきます。
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl border border-dark-700/30 bg-dark-900/50 p-6 transition-all duration-300 hover:border-primary-500/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">修了証 & 資格バッジ</h3>
              <p className="mt-2 text-sm leading-relaxed text-dark-400">
                各コース修了時にデジタル証明書と資格バッジを発行。LinkedInに掲載して、あなたのスキルを証明できます。
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-xl border border-dark-700/30 bg-dark-900/50 p-6 transition-all duration-300 hover:border-primary-500/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">進捗ダッシュボード</h3>
              <p className="mt-2 text-sm leading-relaxed text-dark-400">
                学習の進捗を可視化。法人プランでは管理者が社員の受講状況を一元管理できるダッシュボードを提供します。
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-xl border border-dark-700/30 bg-dark-900/50 p-6 transition-all duration-300 hover:border-primary-500/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">自分のペースで学べる</h3>
              <p className="mt-2 text-sm leading-relaxed text-dark-400">
                オンデマンド形式だから、いつでもどこでもマイペースで学習可能。通勤時間や隙間時間を有効活用できます。
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-xl border border-dark-700/30 bg-dark-900/50 p-6 transition-all duration-300 hover:border-primary-500/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">日本語完全対応</h3>
              <p className="mt-2 text-sm leading-relaxed text-dark-400">
                すべてのコンテンツが日本語。専門用語は丁寧に解説するので、英語が苦手な方でも安心して学習できます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Certificate Preview */}
      <CertificatePreview />

      {/* Security Quiz */}
      <SecurityQuiz />

      {/* Enterprise Section */}
      <EnterpriseSection />

      {/* Latest Articles */}
      <section className="py-20 sm:py-24 border-t border-dark-800/50">
        <div className="container-narrow">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="section-heading">最新の記事</h2>
              <p className="section-subheading">
                セキュリティの最新情報を分かりやすくお届けします
              </p>
            </div>
            <Link
              href="/articles"
              className="hidden text-sm font-medium text-primary-400 hover:text-primary-300 hover:underline sm:block"
            >
              すべての記事を見る
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>

          <div className="mt-6 text-center sm:hidden">
            <Link
              href="/articles"
              className="text-sm font-medium text-primary-400 hover:underline"
            >
              すべての記事を見る
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection />

      {/* Newsletter */}
      <NewsletterForm />
    </>
  );
}
