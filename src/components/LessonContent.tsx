"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

interface LessonContentProps {
  courseSlug: string;
  lessonNumber: number;
  lessonTitle: string;
  content: string;
  coursePrice: number;
}

function renderLessonContent(content: string) {
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
    if (trimmed.startsWith("```")) {
      const lines = trimmed.split("\n");
      const code = lines.slice(1, -1).join("\n");
      return (
        <pre
          key={i}
          className="mb-4 overflow-x-auto rounded-lg border border-dark-700/30 bg-dark-950 p-4 text-sm text-slate-300"
        >
          <code>{code}</code>
        </pre>
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
                    <strong key={k} className="font-semibold text-white">
                      {p}
                    </strong>
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
            <strong key={k} className="font-semibold text-white">
              {part}
            </strong>
          ) : (
            part
          )
        )}
      </p>
    );
  });
}

export default function LessonContent({
  courseSlug,
  lessonNumber,
  lessonTitle,
  content,
  coursePrice,
}: LessonContentProps) {
  const { user } = useAuth();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [reason, setReason] = useState<string>("");

  const checkAccess = useCallback(async () => {
    // First 2 lessons are always free -- skip the API call
    if (lessonNumber <= 2) {
      setHasAccess(true);
      setReason("free_preview");
      return;
    }

    try {
      const res = await fetch(
        `/api/courses/access?course=${courseSlug}&lesson=${lessonNumber}`
      );
      const data = await res.json();
      setHasAccess(data.hasAccess);
      setReason(data.reason);
    } catch {
      setHasAccess(false);
      setReason("error");
    }
  }, [courseSlug, lessonNumber]);

  useEffect(() => {
    checkAccess();
  }, [checkAccess, user]);

  if (hasAccess === null) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (hasAccess) {
    return (
      <div className="prose-article">{renderLessonContent(content)}</div>
    );
  }

  // Paywall
  return (
    <div className="relative">
      {/* Blurred preview */}
      <div className="max-h-48 overflow-hidden relative">
        <div className="prose-article blur-sm select-none pointer-events-none">
          {renderLessonContent(content.slice(0, 500))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-950/70 to-dark-950" />
      </div>

      {/* Paywall prompt */}
      <div className="mt-4 rounded-xl border border-primary-500/30 bg-dark-900/80 p-8 text-center">
        <svg
          className="mx-auto h-12 w-12 text-primary-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
          />
        </svg>

        <h3 className="mt-4 text-xl font-bold text-white">
          第{lessonNumber}回「{lessonTitle}」はプレミアムコンテンツです
        </h3>

        {reason === "not_authenticated" ? (
          <>
            <p className="mt-3 text-dark-400">
              このレッスンの閲覧にはログインが必要です。
              無料登録で最初の2回は無料で視聴できます。
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/signup" className="btn-primary !px-8">
                無料登録する
              </Link>
              <Link href="/login" className="btn-secondary !px-8">
                ログイン
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="mt-3 text-dark-400">
              全レッスンにアクセスするには、Proプラン（月額4,980円）に加入するか、
              この講座を個別購入してください。
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/pricing" className="btn-primary !px-8">
                Proプランに加入する
              </Link>
              <button
                onClick={async () => {
                  try {
                    const res = await fetch("/api/checkout", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ courseSlug }),
                    });
                    const data = await res.json();
                    if (data.url) window.location.href = data.url;
                  } catch {
                    // fallback
                  }
                }}
                className="btn-secondary !px-8"
              >
                この講座を購入する（&yen;{coursePrice.toLocaleString()}）
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
