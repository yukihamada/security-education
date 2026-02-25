"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { refresh } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "ログインに失敗しました");
        setLoading(false);
        return;
      }

      await refresh();
      router.push("/courses");
    } catch {
      setError("ログインに失敗しました");
      setLoading(false);
    }
  };

  return (
    <section className="py-20 sm:py-28">
      <div className="container-narrow">
        <div className="mx-auto max-w-md">
          <h1 className="text-center text-3xl font-extrabold text-white">
            ログイン
          </h1>
          <p className="mt-2 text-center text-dark-400">
            DojoC アカウントにログイン
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark-300">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-dark-700 bg-dark-900 px-4 py-3 text-white placeholder-dark-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark-300">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-dark-700 bg-dark-900 px-4 py-3 text-white placeholder-dark-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="8文字以上"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`btn-primary w-full !py-3.5 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {loading ? "ログイン中..." : "ログイン"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-dark-400">
            アカウントをお持ちでない方は{" "}
            <Link href="/signup" className="font-medium text-primary-400 hover:text-primary-300">
              無料登録
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
