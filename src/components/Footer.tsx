import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-dark-800/50 bg-dark-950">
      <div className="container-narrow py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-primary-700">
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
              </div>
              <span className="text-lg font-bold text-white">
                Dojo<span className="text-primary-400">C</span>
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-dark-400">
              セキュリティの民主化。
              <br />
              すべての人に実践的なサイバーセキュリティ教育を届けます。
            </p>
            <p className="mt-2 text-xs text-dark-500">
              運営: SaveJapan by EnablerDAO
            </p>

            {/* SNS Links */}
            <div className="mt-4 flex gap-3">
              <a
                href="https://x.com/yukihamada"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-dark-800 text-dark-400 transition-colors hover:bg-dark-700 hover:text-primary-400"
                aria-label="X (Twitter)"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://github.com/yukihamada"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-dark-800 text-dark-400 transition-colors hover:bg-dark-700 hover:text-primary-400"
                aria-label="GitHub"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links: Learn */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-dark-300">
              学ぶ
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/articles"
                  className="text-sm text-dark-400 transition-colors hover:text-primary-400"
                >
                  記事一覧
                </Link>
              </li>
              <li>
                <Link
                  href="/courses"
                  className="text-sm text-dark-400 transition-colors hover:text-primary-400"
                >
                  講座一覧
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className="text-sm text-dark-400 transition-colors hover:text-primary-400"
                >
                  コミュニティ
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-dark-400 transition-colors hover:text-primary-400"
                >
                  料金プラン
                </Link>
              </li>
            </ul>
          </div>

          {/* Links: SaveJapan / EnablerDAO */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-dark-300">
              SaveJapan
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://enablerdao.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-dark-400 transition-colors hover:text-primary-400"
                >
                  EnablerDAO
                </a>
              </li>
              <li>
                <a
                  href="https://yukihamada.jp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-dark-400 transition-colors hover:text-primary-400"
                >
                  yukihamada.jp
                </a>
              </li>
              <li>
                <a
                  href="https://enabler.cc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-dark-400 transition-colors hover:text-primary-400"
                >
                  enabler.cc
                </a>
              </li>
            </ul>
          </div>

          {/* Links: About */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-dark-300">
              運営情報
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-dark-400 transition-colors hover:text-primary-400"
                >
                  利用規約
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-dark-400 transition-colors hover:text-primary-400"
                >
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <a
                  href="mailto:contact@enablerdao.com"
                  className="text-sm text-dark-400 transition-colors hover:text-primary-400"
                >
                  お問い合わせ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-dark-800/50 pt-6">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
            <p className="text-sm text-dark-500">
              &copy; {new Date().getFullYear()} SaveJapan by EnablerDAO. All rights reserved.
            </p>
            <p className="text-xs text-dark-600">
              <a
                href="https://www.dojoc.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-500 hover:text-primary-400 transition-colors"
              >
                www.dojoc.io
              </a>
              {" "}|{" "}
              <a
                href="mailto:contact@enablerdao.com"
                className="text-dark-500 hover:text-primary-400 transition-colors"
              >
                contact@enablerdao.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
