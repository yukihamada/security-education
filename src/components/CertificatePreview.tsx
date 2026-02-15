export default function CertificatePreview() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container-narrow">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Certificate Mockup */}
          <div className="relative">
            <div className="glow-purple rounded-2xl">
              <div className="rounded-2xl border border-dark-700/30 bg-dark-900/80 p-8 sm:p-10">
                {/* Certificate frame */}
                <div className="rounded-xl border-2 border-primary-500/20 bg-gradient-to-br from-dark-900 to-dark-800 p-6 sm:p-8 text-center relative overflow-hidden">
                  {/* Decorative corners */}
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-primary-500/30 rounded-tl-xl" />
                  <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-primary-500/30 rounded-tr-xl" />
                  <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-primary-500/30 rounded-bl-xl" />
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-primary-500/30 rounded-br-xl" />

                  {/* Logo */}
                  <div className="flex justify-center mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-700">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    </div>
                  </div>

                  <p className="text-xs text-primary-400 tracking-widest uppercase font-medium">Certificate of Completion</p>
                  <h3 className="mt-2 text-xl sm:text-2xl font-bold text-white">修了証明書</h3>

                  <div className="mt-6 glow-line" />

                  <p className="mt-6 text-sm text-dark-400">This is to certify that</p>
                  <p className="mt-2 text-xl font-bold text-white font-serif italic">山田 太郎</p>

                  <p className="mt-4 text-sm text-dark-400">has successfully completed</p>
                  <p className="mt-2 text-base font-semibold text-primary-300">
                    実践サイバーセキュリティ入門
                  </p>
                  <p className="mt-1 text-xs text-dark-500">全10レッスン / 理解度テスト合格</p>

                  <div className="mt-6 glow-line" />

                  <div className="mt-6 flex items-center justify-between text-xs text-dark-500">
                    <div>
                      <p>発行日: 2025-01-15</p>
                      <p>ID: DC-2025-00342</p>
                    </div>
                    <div className="text-right">
                      <p>DojoC / SaveJapan</p>
                      <p>www.dojoc.io</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6">
              <div className="rounded-xl border border-accent-500/20 bg-dark-900/90 backdrop-blur-sm px-4 py-3 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-500/20">
                    <svg className="h-5 w-5 text-accent-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">資格バッジ</p>
                    <p className="text-xs text-dark-400">LinkedInに掲載可能</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div>
            <h2 className="section-heading">修了証 & 資格バッジ</h2>
            <p className="mt-4 text-dark-400 leading-relaxed">
              各コースの修了時に、デジタル修了証明書と資格バッジを発行します。
              LinkedInやポートフォリオに掲載して、あなたのセキュリティスキルを証明できます。
            </p>

            <div className="mt-8 space-y-4">
              {[
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ),
                  title: "理解度テスト合格で取得",
                  desc: "各レッスンの理解度テストに合格すると修了証が発行されます",
                },
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.626a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364l1.757 1.757" />
                  ),
                  title: "ユニークID付きで検証可能",
                  desc: "各証明書にはユニークIDが付与され、第三者が真正性を検証できます",
                },
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                  ),
                  title: "企業研修の記録として活用",
                  desc: "法人プランでは社員の修了状況を一括管理できます",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-600/10 text-primary-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      {item.icon}
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                    <p className="mt-1 text-sm text-dark-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
