import Link from "next/link";

const plans = [
  {
    name: "スタータープラン",
    employees: "~50名",
    price: "98,000",
    period: "月",
    features: [
      "全講座アクセス（50アカウント）",
      "管理ダッシュボード",
      "受講進捗レポート（月次）",
      "メールサポート",
      "修了証発行",
    ],
  },
  {
    name: "ビジネスプラン",
    employees: "~200名",
    price: "298,000",
    period: "月",
    popular: true,
    features: [
      "全講座アクセス（200アカウント）",
      "管理ダッシュボード + API連携",
      "受講進捗レポート（週次）",
      "専任カスタマーサクセス",
      "カスタム講座の作成（年2本）",
      "フィッシング訓練メール（四半期）",
      "修了証 + 資格バッジ発行",
    ],
  },
  {
    name: "エンタープライズ",
    employees: "200名~",
    price: "お問い合わせ",
    period: "",
    features: [
      "無制限アカウント",
      "SSO / SAML連携",
      "LMS連携（SCORM対応）",
      "カスタム講座（無制限）",
      "専任CSM + SLAサポート",
      "オンサイト研修対応",
      "セキュリティコンサルティング",
      "経営層向けレポート作成",
    ],
  },
];

const stats = [
  { value: "78%", label: "インシデント削減率", desc: "導入企業平均" },
  { value: "92%", label: "社員満足度", desc: "受講アンケートより" },
  { value: "4.2x", label: "ROI", desc: "セキュリティ投資対効果" },
  { value: "156社", label: "導入実績", desc: "中小~大企業" },
];

export default function EnterpriseSection() {
  return (
    <section className="relative py-20 sm:py-24 overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900/50 to-dark-950" />

      <div className="container-narrow relative">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-500/5 px-4 py-1.5 mb-4">
            <svg className="h-4 w-4 text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
            </svg>
            <span className="text-sm font-medium text-primary-300">人事・IT担当者向け</span>
          </div>

          <h2 className="section-heading">法人向けセキュリティ研修</h2>
          <p className="section-subheading max-w-2xl mx-auto">
            社員のセキュリティリテラシーを体系的に向上。
            管理ダッシュボードで受講状況を一元管理できます。
          </p>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-dark-700/30 bg-dark-900/50 p-5 text-center">
              <p className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-sm font-medium text-primary-400">{stat.label}</p>
              <p className="text-xs text-dark-500">{stat.desc}</p>
            </div>
          ))}
        </div>

        {/* Plans */}
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-6 sm:p-8 ${
                plan.popular
                  ? "border-primary-500/40 bg-dark-900/80 shadow-lg shadow-primary-900/10"
                  : "border-dark-700/30 bg-dark-900/40"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-6">
                  <span className="rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white">
                    人気
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                <p className="text-sm text-dark-400 mt-1">{plan.employees}</p>
              </div>

              <div className="mt-4">
                {plan.period ? (
                  <>
                    <span className="text-3xl font-extrabold text-white">&yen;{plan.price}</span>
                    <span className="text-sm text-dark-400">/{plan.period}</span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-white">{plan.price}</span>
                )}
              </div>

              <ul className="mt-6 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-sm text-dark-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.period ? "/pricing" : "mailto:contact@enablerdao.com"}
                className={`mt-6 block w-full rounded-lg px-6 py-3 text-center text-sm font-semibold transition-all duration-200 ${
                  plan.popular
                    ? "bg-primary-600 text-white hover:bg-primary-500 shadow-sm hover:shadow-lg hover:shadow-primary-600/25"
                    : "border border-dark-600 text-dark-300 hover:border-primary-500/50 hover:text-primary-400"
                }`}
              >
                {plan.period ? "お申し込み" : "お問い合わせ"}
              </Link>
            </div>
          ))}
        </div>

        {/* Dashboard preview */}
        <div className="mt-16 rounded-2xl border border-dark-700/30 bg-dark-900/50 overflow-hidden">
          <div className="border-b border-dark-700/30 px-6 py-4 flex items-center gap-3">
            <svg className="h-5 w-5 text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
            </svg>
            <span className="text-sm font-medium text-white">管理ダッシュボード プレビュー</span>
          </div>
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="rounded-lg bg-dark-800/50 p-4">
                <p className="text-xs text-dark-500">受講者数</p>
                <p className="text-xl font-bold text-white mt-1">142名</p>
                <p className="text-xs text-accent-400 mt-0.5">+12 今月</p>
              </div>
              <div className="rounded-lg bg-dark-800/50 p-4">
                <p className="text-xs text-dark-500">平均進捗率</p>
                <p className="text-xl font-bold text-white mt-1">67%</p>
                <p className="text-xs text-accent-400 mt-0.5">+8% 先月比</p>
              </div>
              <div className="rounded-lg bg-dark-800/50 p-4">
                <p className="text-xs text-dark-500">修了者数</p>
                <p className="text-xl font-bold text-white mt-1">89名</p>
                <p className="text-xs text-primary-400 mt-0.5">62.7%</p>
              </div>
              <div className="rounded-lg bg-dark-800/50 p-4">
                <p className="text-xs text-dark-500">検定合格率</p>
                <p className="text-xl font-bold text-white mt-1">91%</p>
                <p className="text-xs text-accent-400 mt-0.5">業界平均+15pt</p>
              </div>
            </div>

            {/* Mini chart representation */}
            <div className="rounded-lg bg-dark-800/30 p-4">
              <p className="text-xs text-dark-500 mb-3">部署別 受講進捗</p>
              <div className="space-y-3">
                {[
                  { dept: "IT部門", progress: 92 },
                  { dept: "営業部", progress: 71 },
                  { dept: "管理部", progress: 85 },
                  { dept: "開発部", progress: 78 },
                ].map((item) => (
                  <div key={item.dept} className="flex items-center gap-3">
                    <span className="w-16 text-xs text-dark-400">{item.dept}</span>
                    <div className="flex-1 h-2 rounded-full bg-dark-700">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-primary-600 to-primary-400"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-xs text-dark-400">{item.progress}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
