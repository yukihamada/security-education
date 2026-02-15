import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ページが見つかりません — DojoC",
  description: "お探しのページは見つかりませんでした。",
};

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center py-20">
      <div className="container-narrow text-center">
        <div className="mx-auto max-w-lg">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-600/10">
            <svg
              className="h-10 w-10 text-primary-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827m0 3v.01M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Z"
              />
            </svg>
          </div>

          <h1 className="mt-6 text-4xl font-extrabold text-white">404</h1>
          <h2 className="mt-2 text-xl font-bold text-dark-300">
            ページが見つかりません
          </h2>
          <p className="mt-4 text-dark-400">
            お探しのページは移動または削除された可能性があります。
            <br />
            URLが正しいか確認してください。
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/" className="btn-primary !px-6 !py-2.5 !text-sm">
              トップページへ戻る
            </Link>
            <Link
              href="/articles"
              className="btn-secondary !px-6 !py-2.5 !text-sm"
            >
              記事を読む
            </Link>
          </div>

          <div className="mt-10 rounded-xl border border-dark-700/30 bg-dark-900/50 p-6">
            <h3 className="text-sm font-semibold text-white">
              お探しの情報が見つからない場合
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-dark-400">
              <li>
                <Link href="/articles" className="text-primary-400 hover:underline">
                  記事一覧
                </Link>{" "}
                からセキュリティ情報を探す
              </li>
              <li>
                <Link href="/courses" className="text-primary-400 hover:underline">
                  講座一覧
                </Link>{" "}
                から学習コースを選ぶ
              </li>
              <li>
                <Link href="/community" className="text-primary-400 hover:underline">
                  コミュニティ
                </Link>{" "}
                で質問する
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
