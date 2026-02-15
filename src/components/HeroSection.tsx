import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-hero-pattern">
      {/* Ambient glow effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-500/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-700/5 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(147,51,234,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(147,51,234,0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container-narrow relative py-20 sm:py-28 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div>
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1.5">
              <span className="h-2 w-2 rounded-full bg-accent-400 animate-pulse" />
              <span className="text-sm font-medium text-primary-300">
                SaveJapan by EnablerDAO
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
              セキュリティの
              <br />
              <span className="bg-gradient-to-r from-primary-400 via-primary-300 to-accent-400 bg-clip-text text-transparent">
                民主化
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 text-lg leading-relaxed text-dark-300 sm:text-xl">
              すべての人に、実践的なサイバーセキュリティ教育を。
              <br className="hidden sm:block" />
              体系的なカリキュラムと修了資格で、
              <br className="hidden sm:block" />
              あなたと組織を守るスキルを身につけましょう。
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row">
              <Link href="/pricing" className="btn-primary !px-8 !py-3.5 !text-base">
                無料で始める
              </Link>
              <Link href="/courses" className="btn-secondary !px-8 !py-3.5 !text-base">
                講座を見る
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              <div>
                <p className="text-2xl font-bold text-white sm:text-3xl">89%</p>
                <p className="mt-1 text-sm text-dark-400">基礎検定 合格率</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white sm:text-3xl">1,200+</p>
                <p className="mt-1 text-sm text-dark-400">受講者数</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white sm:text-3xl">45+</p>
                <p className="mt-1 text-sm text-dark-400">レッスン数</p>
              </div>
            </div>
          </div>

          {/* Right: Course Preview Mockup */}
          <div className="relative">
            <div className="glow-purple rounded-2xl">
              {/* Main mockup card */}
              <div className="rounded-2xl border border-dark-700/50 bg-dark-900/90 backdrop-blur-xl overflow-hidden shadow-2xl">
                {/* Top bar */}
                <div className="flex items-center gap-2 border-b border-dark-700/50 px-4 py-3 bg-dark-900">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500/70" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                    <div className="h-3 w-3 rounded-full bg-green-500/70" />
                  </div>
                  <div className="ml-4 flex-1 rounded-md bg-dark-800 px-3 py-1 text-xs text-dark-400">
                    www.dojoc.io/courses/practical-cybersecurity-intro
                  </div>
                </div>

                {/* Content area */}
                <div className="p-6">
                  {/* Course header */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary-600/20 text-primary-400">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-primary-400 font-medium">Lesson 3 / 10</p>
                      <h3 className="text-base font-bold text-white mt-0.5">マルウェアの種類と対策</h3>
                    </div>
                  </div>

                  {/* Video placeholder */}
                  <div className="mt-4 rounded-lg bg-dark-800 aspect-video flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 to-dark-800" />
                    <div className="relative flex flex-col items-center gap-2">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-600/30 border border-primary-500/30">
                        <svg className="h-6 w-6 text-primary-300 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <span className="text-xs text-dark-400">40:00</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-dark-400 mb-1.5">
                      <span>学習進捗</span>
                      <span>30%</span>
                    </div>
                    <div className="h-2 rounded-full bg-dark-800">
                      <div className="h-2 rounded-full bg-gradient-to-r from-primary-600 to-primary-400 w-[30%]" />
                    </div>
                  </div>

                  {/* Lesson list preview */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-3 rounded-lg bg-dark-800/50 px-3 py-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-500/20 text-accent-400">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                      <span className="text-xs text-dark-300">1. サイバーセキュリティとは何か</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg bg-dark-800/50 px-3 py-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-500/20 text-accent-400">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                      <span className="text-xs text-dark-300">2. パスワードと認証の基本</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg bg-primary-600/10 border border-primary-500/20 px-3 py-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500/20 text-primary-400">
                        <span className="text-[10px] font-bold">3</span>
                      </div>
                      <span className="text-xs text-primary-300 font-medium">3. マルウェアの種類と対策</span>
                      <span className="ml-auto text-[10px] text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded-full">受講中</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 animate-float">
              <div className="rounded-xl border border-primary-500/20 bg-dark-900/90 backdrop-blur-sm px-4 py-3 shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500/20 text-accent-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-dark-400">修了証発行</p>
                    <p className="text-xs font-bold text-white">342名取得済</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom glow line */}
      <div className="glow-line" />
    </section>
  );
}
