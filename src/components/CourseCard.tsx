import Link from "next/link";
import { Course } from "@/types";

const levelLabels: Record<string, { label: string; className: string }> = {
  beginner: { label: "初級", className: "bg-accent-500/20 text-accent-300" },
  intermediate: { label: "中級", className: "bg-amber-500/20 text-amber-300" },
  advanced: { label: "上級", className: "bg-red-500/20 text-red-300" },
};

export default function CourseCard({ course, rank }: { course: Course; rank?: number }) {
  const level = levelLabels[course.level];

  return (
    <Link href={`/courses/${course.slug}`} className="card group block overflow-hidden">
      {/* Header with gradient */}
      <div className="relative bg-gradient-to-br from-primary-700 to-primary-900 px-6 py-8 text-white">
        {rank && (
          <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm font-bold backdrop-blur-sm">
            {rank}
          </div>
        )}
        <span className={`badge ${level.className}`}>{level.label}</span>
        <h3 className="mt-3 text-xl font-bold leading-snug">{course.title}</h3>
      </div>

      <div className="p-6">
        {/* Description */}
        <p className="text-sm leading-relaxed text-dark-400 line-clamp-2">
          {course.description}
        </p>

        {/* Meta */}
        <div className="mt-4 flex items-center gap-4 text-sm text-dark-400">
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            全{course.totalLessons}回
          </span>
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            {course.instructor}
          </span>
        </div>

        {/* Price & CTA */}
        <div className="mt-5 flex items-center justify-between border-t border-dark-700/50 pt-5">
          <div>
            <span className="text-2xl font-bold text-white">
              &yen;{course.price.toLocaleString()}
            </span>
            <span className="ml-1 text-sm text-dark-500">（税込）</span>
          </div>
          <span className="btn-primary !px-4 !py-2 !text-sm group-hover:!bg-primary-500">
            詳細を見る
          </span>
        </div>
      </div>
    </Link>
  );
}
