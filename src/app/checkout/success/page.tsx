import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "お支払い完了 -- DojoC",
  description: "決済が正常に完了しました。",
};

interface Props {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { session_id: sessionId } = await searchParams;

  return (
    <section className="py-20 sm:py-28">
      <div className="container-narrow">
        <div className="mx-auto max-w-lg text-center">
          {/* Success Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-500/20">
            <svg
              className="h-10 w-10 text-primary-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 className="mt-6 text-3xl font-extrabold text-white">
            お支払いが完了しました
          </h1>
          <p className="mt-4 text-lg text-dark-400">
            ご購入ありがとうございます。
            <br />
            講座のすべてのコンテンツにアクセスできるようになりました。
          </p>

          {sessionId && (
            <p className="mt-3 text-xs text-dark-600">
              注文ID: {sessionId.slice(0, 24)}...
            </p>
          )}

          {/* Actions */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/courses"
              className="btn-primary !px-8 !py-3.5 !text-base"
            >
              講座一覧へ
            </Link>
            <Link
              href="/"
              className="btn-secondary !px-8 !py-3.5 !text-base"
            >
              トップページに戻る
            </Link>
          </div>

          {/* Info */}
          <div className="mt-12 rounded-xl border border-dark-700/50 bg-dark-800/50 p-6 text-left">
            <h3 className="font-semibold text-white">次のステップ</h3>
            <ul className="mt-3 space-y-2 text-sm text-dark-300">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-500/20 text-xs font-bold text-primary-400">
                  1
                </span>
                <span>決済確認メールがStripeから送信されます</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-500/20 text-xs font-bold text-primary-400">
                  2
                </span>
                <span>
                  講座ページからお好きな回を選んで学習を開始しましょう
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-500/20 text-xs font-bold text-primary-400">
                  3
                </span>
                <span>
                  コミュニティに参加して、他の学習者と交流しましょう
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
