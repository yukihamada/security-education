"use client";

import { useState, useEffect } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (status === "success" || status === "error") {
      const timer = setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const validateEmail = (email: string): boolean => {
    if (!email.trim()) {
      setValidationError("メールアドレスを入力してください");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError("正しいメールアドレスの形式で入力してください");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "登録に失敗しました");
        return;
      }

      setStatus("success");
      setMessage(data.message || "ニュースレターに登録しました。ありがとうございます！");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("通信エラーが発生しました。もう一度お試しください。");
    }
  };

  return (
    <section className="relative border-t border-dark-800/50 bg-dark-950">
      {/* Toast notification */}
      {(status === "success" || status === "error") && (
        <div className="fixed left-1/2 top-20 z-50 -translate-x-1/2 animate-slide-down">
          <div
            className={`flex items-center gap-3 rounded-lg px-5 py-3 shadow-lg ${
              status === "success"
                ? "bg-accent-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {status === "success" ? (
              <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            )}
            <span className="text-sm font-medium">{message}</span>
            <button
              onClick={() => {
                setStatus("idle");
                setMessage("");
              }}
              className="ml-2 text-white/80 hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="container-narrow py-16 text-center">
        <div className="mx-auto max-w-xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600/20 text-primary-400">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
          </div>

          <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
            セキュリティ情報をお届けします
          </h2>
          <p className="mt-2 text-dark-400">
            最新のセキュリティニュース、新着記事、講座情報を
            <br className="hidden sm:block" />
            週1回のニュースレターでお届けします。
          </p>

          <form onSubmit={handleSubmit} className="mt-8" noValidate>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validationError) setValidationError("");
                  }}
                  placeholder="メールアドレスを入力"
                  className={`w-full rounded-lg border px-4 py-3 bg-dark-900 text-white shadow-sm placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    validationError
                      ? "border-red-500/50"
                      : "border-dark-700/50"
                  }`}
                  disabled={status === "loading"}
                />
                {validationError && (
                  <p className="mt-1.5 text-left text-sm font-medium text-red-400">
                    {validationError}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="btn-primary disabled:opacity-50"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    登録中...
                  </span>
                ) : (
                  "無料で登録"
                )}
              </button>
            </div>
          </form>

          <p className="mt-4 text-xs text-dark-500">
            いつでも配信停止できます。スパムは一切送りません。
          </p>
        </div>
      </div>
    </section>
  );
}
