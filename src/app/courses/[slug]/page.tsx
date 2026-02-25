import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { courses } from "@/data/courses";
import PurchaseButton from "@/components/PurchaseButton";
import AudioPlayer from "@/components/AudioPlayer";
import LessonContent from "@/components/LessonContent";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  if (!course) return { title: "講座が見つかりません" };
  return {
    title: `${course.title} — DojoC`,
    description: course.description,
    openGraph: {
      title: `${course.title} — DojoC`,
      description: course.description,
      type: "website",
    },
  };
}

const levelLabels: Record<string, { label: string; className: string }> = {
  beginner: { label: "初級", className: "bg-accent-500/20 text-accent-300" },
  intermediate: { label: "中級", className: "bg-amber-500/20 text-amber-300" },
  advanced: { label: "上級", className: "bg-red-500/20 text-red-300" },
};

function renderStars(rating: number) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-4 w-4 ${star <= rating ? "text-amber-400" : "text-dark-700"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function renderPreviewContent(content: string) {
  return content.split("\n\n").map((block, i) => {
    const trimmed = block.trim();
    if (trimmed.startsWith("## ")) {
      return (
        <h2 key={i} className="mb-3 mt-6 text-xl font-bold text-white">
          {trimmed.replace("## ", "")}
        </h2>
      );
    }
    if (trimmed.startsWith("### ")) {
      return (
        <h3 key={i} className="mb-2 mt-4 text-lg font-semibold text-slate-200">
          {trimmed.replace("### ", "")}
        </h3>
      );
    }
    if (/^\d+\.\s/.test(trimmed)) {
      const items = trimmed.split("\n").filter((l) => /^\d+\.\s/.test(l));
      return (
        <ol key={i} className="mb-4 ml-6 list-decimal space-y-1 text-slate-300">
          {items.map((line, j) => {
            const text = line.replace(/^\d+\.\s/, "");
            const parts = text.split(/\*\*(.*?)\*\*/g);
            return (
              <li key={j} className="leading-relaxed">
                {parts.map((p, k) =>
                  k % 2 === 1 ? (
                    <strong key={k} className="font-semibold text-white">{p}</strong>
                  ) : (
                    p
                  )
                )}
              </li>
            );
          })}
        </ol>
      );
    }
    if (trimmed.startsWith("- ")) {
      const items = trimmed.split("\n").filter((l) => l.startsWith("- "));
      return (
        <ul key={i} className="mb-4 ml-6 list-disc space-y-1 text-slate-300">
          {items.map((line, j) => (
            <li key={j} className="leading-relaxed">
              {line.replace(/^- /, "")}
            </li>
          ))}
        </ul>
      );
    }
    return (
      <p key={i} className="mb-4 leading-relaxed text-slate-300">
        {trimmed.split(/\*\*(.*?)\*\*/g).map((part, k) =>
          k % 2 === 1 ? (
            <strong key={k} className="font-semibold text-white">{part}</strong>
          ) : (
            part
          )
        )}
      </p>
    );
  });
}

/** Strip markdown formatting to produce plain text for TTS */
function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, "")       // headings
    .replace(/\*\*(.*?)\*\*/g, "$1")    // bold
    .replace(/\*(.*?)\*/g, "$1")        // italic
    .replace(/^\d+\.\s/gm, "")          // numbered list markers
    .replace(/^-\s/gm, "")              // bullet markers
    .replace(/\n{3,}/g, "\n\n")         // excess newlines
    .trim();
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);

  if (!course) {
    notFound();
  }

  const level = levelLabels[course.level];
  const avgRating =
    course.reviews && course.reviews.length > 0
      ? (course.reviews.reduce((sum, r) => sum + r.rating, 0) / course.reviews.length).toFixed(1)
      : null;

  return (
    <>
      {/* Course Header */}
      <section className="bg-hero-pattern py-12 sm:py-16">
        <div className="container-narrow">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Info */}
            <div className="lg:col-span-2">
              <Link
                href="/courses"
                className="inline-flex items-center gap-1 text-sm text-dark-400 hover:text-primary-400"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                講座一覧に戻る
              </Link>

              <div className="mt-4 flex items-center gap-3">
                <span className={`badge ${level.className}`}>{level.label}</span>
                <span className="text-sm text-dark-400">{course.category}</span>
              </div>

              <h1 className="mt-4 text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
                {course.title}
              </h1>

              <p className="mt-4 text-lg leading-relaxed text-dark-300">
                {course.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-dark-400">
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                  全{course.totalLessons}回
                </span>
                {course.totalDuration && (
                  <span className="flex items-center gap-1.5">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    {course.totalDuration}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  講師: {course.instructor}
                </span>
                {avgRating && (
                  <span className="flex items-center gap-1.5">
                    <svg className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {avgRating}（{course.reviews!.length}件の評価）
                  </span>
                )}
              </div>
            </div>

            {/* Purchase Card */}
            <div className="lg:col-span-1">
              <div className="rounded-xl border border-dark-700/30 bg-dark-900/80 p-6 shadow-xl">
                <div className="text-center">
                  <span className="text-3xl font-extrabold text-white">
                    &yen;{course.price.toLocaleString()}
                  </span>
                  <span className="ml-1 text-sm text-dark-400">（税込）</span>
                </div>

                <div className="mt-4">
                  <PurchaseButton
                    courseSlug={course.slug}
                    price={course.price}
                    label="購入する"
                  />
                </div>
                <p className="mt-2 text-center text-xs text-dark-500">
                  * Stripe安全決済
                </p>

                <div className="mt-4 text-center">
                  <span className="text-xs text-dark-500">
                    または{" "}
                    <Link href="/pricing" className="text-primary-400 hover:underline">
                      Proプラン（月額4,980円）
                    </Link>
                    {" "}で全講座見放題
                  </span>
                </div>

                <div className="mt-6 space-y-3 border-t border-dark-700/30 pt-6">
                  {course.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <svg
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span className="text-sm text-dark-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Points */}
      {course.learningPoints && course.learningPoints.length > 0 && (
        <section className="border-t border-dark-800/50 py-12 sm:py-16">
          <div className="container-narrow">
            <div className="mx-auto max-w-3xl">
              <h2 className="section-heading">この講座で学べること</h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {course.learningPoints.map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <svg
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-dark-300">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Curriculum */}
      <section className="border-t border-dark-800/50 py-12 sm:py-16">
        <div className="container-narrow">
          <div className="mx-auto max-w-3xl">
            <h2 className="section-heading">カリキュラム</h2>
            <p className="section-subheading">
              全{course.totalLessons}回の講義内容{course.totalDuration ? `（合計${course.totalDuration}）` : ""}
            </p>
            <p className="mt-1 text-sm text-primary-400">
              最初の2回は無料でご覧いただけます
            </p>

            <div className="mt-8 space-y-3">
              {course.curriculum.map((lesson) => {
                const isFreeAccess = lesson.number <= 2;
                return (
                  <div key={lesson.number}>
                    <div
                      className={`flex items-center gap-4 rounded-lg border p-4 ${
                        isFreeAccess
                          ? "border-primary-500/30 bg-primary-500/5"
                          : "border-dark-700/30 bg-dark-900/50"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          isFreeAccess
                            ? "bg-primary-600 text-white"
                            : "bg-dark-800 text-dark-400"
                        }`}
                      >
                        {lesson.number}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white">{lesson.title}</p>
                        <p className="text-sm text-dark-400">{lesson.duration}</p>
                      </div>
                      {isFreeAccess ? (
                        <span className="badge bg-primary-500/20 text-primary-300">
                          無料
                        </span>
                      ) : (
                        <svg
                          className="h-5 w-5 text-dark-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Free Preview - Lesson 1 */}
      <section className="border-t border-dark-800/50 py-12 sm:py-16">
        <div className="container-narrow">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="badge bg-primary-500/20 text-primary-300">無料プレビュー</span>
              <h2 className="text-xl font-bold text-white">
                第1回の内容を無料でお試し
              </h2>
            </div>

            <div className="mt-6 rounded-xl border border-dark-700/30 bg-dark-900/50 p-6 sm:p-8">
              <div className="prose-article">
                {renderPreviewContent(course.freePreviewContent)}
              </div>

              {/* Audio Player for free preview lesson */}
              <div className="mt-6 border-t border-dark-700/30 pt-6">
                <AudioPlayer
                  lessonSlug={`${course.slug}-lesson-1`}
                  lessonTitle={course.curriculum[0]?.title || "第1回"}
                  text={stripMarkdown(course.freePreviewContent)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Paid Lesson Content (Lesson 2+) */}
      {course.curriculum
        .filter((lesson) => lesson.content && lesson.number >= 2)
        .map((lesson) => (
          <section
            key={lesson.number}
            id={`lesson-${lesson.number}`}
            className="border-t border-dark-800/50 py-12 sm:py-16"
          >
            <div className="container-narrow">
              <div className="mx-auto max-w-3xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                    {lesson.number}
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    {lesson.title}
                  </h2>
                  <span className="text-sm text-dark-500">{lesson.duration}</span>
                </div>

                <div className="rounded-xl border border-dark-700/30 bg-dark-900/50 p-6 sm:p-8">
                  <LessonContent
                    courseSlug={course.slug}
                    lessonNumber={lesson.number}
                    lessonTitle={lesson.title}
                    content={lesson.content!}
                    coursePrice={course.price}
                  />
                </div>
              </div>
            </div>
          </section>
        ))}

      {/* CTA after content */}
      <section className="border-t border-dark-800/50 py-12 sm:py-16">
        <div className="container-narrow">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-dark-400">
              全{course.totalLessons}回の講義で体系的に学べます。
            </p>
            <PurchaseButton
              courseSlug={course.slug}
              price={course.price}
              label={`講座を購入する（¥${course.price.toLocaleString()}）`}
              className="btn-primary !px-8 !py-3.5"
            />
          </div>
        </div>
      </section>

      {/* Reviews */}
      {course.reviews && course.reviews.length > 0 && (
        <section className="border-t border-dark-800/50 py-12 sm:py-16">
          <div className="container-narrow">
            <div className="mx-auto max-w-3xl">
              <h2 className="section-heading">受講者の声</h2>
              {avgRating && (
                <p className="section-subheading">
                  平均評価 {avgRating} / 5.0（{course.reviews.length}件のレビュー）
                </p>
              )}

              <div className="mt-8 space-y-6">
                {course.reviews.map((review, i) => (
                  <div key={i} className="rounded-xl border border-dark-700/30 bg-dark-900/50 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600/20 text-sm font-bold text-primary-300">
                          {review.name[0]}
                        </div>
                        <div>
                          <p className="font-medium text-white">{review.name}</p>
                          <p className="text-xs text-dark-500">{review.date}</p>
                        </div>
                      </div>
                      {renderStars(review.rating)}
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-dark-300">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
