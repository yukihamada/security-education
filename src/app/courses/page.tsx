import { Metadata } from "next";
import CourseCard from "@/components/CourseCard";
import { courses } from "@/data/courses";

export const metadata: Metadata = {
  title: "講座一覧 — DojoC",
  description: "実践的なサイバーセキュリティスキルを身につけられる講座をご用意しています。",
};

export default function CoursesPage() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-hero-pattern py-16">
        <div className="container-narrow text-center">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            セキュリティ講座
          </h1>
          <p className="mt-3 text-lg text-dark-300">
            初心者から上級者まで、レベルに合わせて学べる実践的な講座
          </p>

          {/* Feature badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-sm text-dark-300">
              <svg className="h-5 w-5 text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              無料プレビューあり
            </div>
            <div className="flex items-center gap-2 text-sm text-dark-300">
              <svg className="h-5 w-5 text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              修了証明書発行
            </div>
            <div className="flex items-center gap-2 text-sm text-dark-300">
              <svg className="h-5 w-5 text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              質問サポート付き
            </div>
          </div>
        </div>
      </section>

      {/* Course List */}
      <section className="py-12 sm:py-16">
        <div className="container-narrow">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, i) => (
              <CourseCard key={course.slug} course={course} rank={i + 1} />
            ))}
          </div>

          {/* Info */}
          <div className="mt-16 rounded-xl border border-dark-700/30 bg-dark-900/50 p-8 text-center">
            <h3 className="text-lg font-bold text-white">
              法人・団体でのご利用をご検討の方へ
            </h3>
            <p className="mt-2 text-sm text-dark-400">
              10名以上でのグループ受講や、カスタマイズ研修をご希望の場合は
              お気軽にお問い合わせください。ボリュームディスカウントをご用意しています。
            </p>
            <a href="mailto:contact@enablerdao.com" className="btn-secondary mt-4 inline-block !text-sm">
              法人向けお問い合わせ
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
