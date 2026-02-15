import { Metadata } from "next";
import PricingCard from "@/components/PricingCard";
import NewsletterForm from "@/components/NewsletterForm";
import { MembershipPlan } from "@/types";

export const metadata: Metadata = {
  title: "コミュニティ — DojoC",
  description:
    "セキュリティに関心を持つ仲間と繋がり、一緒に学び成長できるコミュニティです。",
  openGraph: {
    title: "コミュニティ — DojoC",
    description:
      "セキュリティに関心を持つ仲間と繋がり、一緒に学び成長できるコミュニティです。",
  },
};

const membershipPlans: MembershipPlan[] = [
  {
    id: "community-free",
    name: "Free",
    price: 0,
    period: "",
    features: [
      "無料記事の閲覧",
      "月1回のオープン勉強会に参加",
      "コミュニティ掲示板の閲覧",
      "ニュースレターの受信",
    ],
    highlighted: false,
    buttonLabel: "無料で参加する",
  },
  {
    id: "community-pro",
    name: "Pro",
    price: 1000,
    period: "月",
    features: [
      "Freeプランの全機能",
      "Discord限定チャンネルへのアクセス",
      "月例オンライン勉強会（録画あり）",
      "Q&Aフォーラムでの質問",
      "メンバー限定記事の閲覧",
      "CTFチャレンジへの参加",
    ],
    highlighted: true,
    buttonLabel: "Proプランに参加する",
  },
  {
    id: "community-expert",
    name: "Expert",
    price: 3000,
    period: "月",
    features: [
      "Proプランの全機能",
      "月1回の個別メンタリング（30分）",
      "専門家によるコードレビュー",
      "キャリア相談",
      "限定ハンズオンワークショップ",
      "オフライン交流会への優先参加",
      "講座10%割引",
    ],
    highlighted: false,
    buttonLabel: "Expertプランに参加する",
  },
];

const recentDiscussions = [
  {
    title: "FortiGate SSL-VPNの既知脆弱性への対応 -- パッチ適用手順の共有",
    author: "佐藤D.",
    replies: 12,
    lastActivity: "2時間前",
    category: "脆弱性情報",
    categoryColor: "bg-red-500/20 text-red-400",
  },
  {
    title: "中小企業でZTNA導入した方、実際のコスト感を教えてください",
    author: "山田K.",
    replies: 8,
    lastActivity: "5時間前",
    category: "質問",
    categoryColor: "bg-blue-500/20 text-blue-400",
  },
  {
    title: "CISSP受験体験記 -- 3ヶ月の独学で合格した勉強法",
    author: "高橋A.",
    replies: 23,
    lastActivity: "1日前",
    category: "資格",
    categoryColor: "bg-purple-500/20 text-purple-400",
  },
];

export default function CommunityPage() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-hero-pattern py-16 sm:py-20">
        <div className="container-narrow text-center">
          <div className="mx-auto max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1.5">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-medium text-primary-300">
                1,247名が参加中
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              セキュリティを学ぶ仲間と
              <br />
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">繋がろう</span>
            </h1>

            <p className="mt-4 text-lg leading-relaxed text-dark-300">
              DojoCコミュニティは、セキュリティに関心を持つエンジニア、
              企業担当者、学生が集まり、情報交換やスキルアップを行う場です。
              一人で学ぶよりも、仲間と一緒に。
            </p>
          </div>
        </div>
      </section>

      {/* Community Features */}
      <section className="py-16">
        <div className="container-narrow">
          <h2 className="section-heading text-center">コミュニティでできること</h2>
          <p className="section-subheading text-center">
            学び合い、助け合い、成長し合える場所
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature Cards */}
            <div className="card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">Discord交流</h3>
              <p className="mt-2 text-sm leading-relaxed text-dark-400">
                リアルタイムで質問・相談ができるDiscordサーバー。
                カテゴリ別のチャンネルで効率的に情報交換できます。
              </p>
            </div>

            <div className="card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">月例勉強会</h3>
              <p className="mt-2 text-sm leading-relaxed text-dark-400">
                毎月開催のオンライン勉強会。最新の脅威情報や技術トピックを
                専門家が解説します。録画もあるので見逃しても安心。
              </p>
            </div>

            <div className="card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">CTFチャレンジ</h3>
              <p className="mt-2 text-sm leading-relaxed text-dark-400">
                毎月更新されるCTF問題で実践スキルを磨けます。
                メンバー同士でヒントを出し合いながら楽しく学習。
              </p>
            </div>

            <div className="card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/20 text-green-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">メンタリング</h3>
              <p className="mt-2 text-sm leading-relaxed text-dark-400">
                Expertプランでは経験豊富なセキュリティ専門家による
                月1回の個別メンタリングを受けられます。
              </p>
            </div>

            <div className="card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/20 text-red-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">限定コンテンツ</h3>
              <p className="mt-2 text-sm leading-relaxed text-dark-400">
                メンバー限定の記事やチュートリアル、実務で使える
                テンプレート集など、ここでしか手に入らないコンテンツ。
              </p>
            </div>

            <div className="card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500/20 text-primary-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">オフライン交流</h3>
              <p className="mt-2 text-sm leading-relaxed text-dark-400">
                東京・大阪を中心に定期的にオフラインイベントを開催。
                同じ志を持つ仲間とのネットワーキングの機会です。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Discussions */}
      <section className="border-t border-dark-800/50 py-16">
        <div className="container-narrow">
          <h2 className="section-heading text-center">最近のディスカッション</h2>
          <p className="section-subheading text-center">
            コミュニティで活発に議論されているトピック
          </p>

          <div className="mx-auto mt-10 max-w-3xl space-y-4">
            {recentDiscussions.map((discussion, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-xl border border-dark-700/50 bg-dark-800/50 p-5 transition-all hover:border-dark-600/50 hover:bg-dark-800"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-500/20 text-sm font-bold text-primary-400">
                  {discussion.author[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-medium text-white leading-snug">
                      {discussion.title}
                    </h3>
                    <span className={`badge flex-shrink-0 ${discussion.categoryColor}`}>
                      {discussion.category}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-sm text-dark-400">
                    <span>{discussion.author}</span>
                    <span className="flex items-center gap-1">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                      </svg>
                      {discussion.replies}件の返信
                    </span>
                    <span>{discussion.lastActivity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <span className="text-sm text-dark-500">
              Discordコミュニティに参加して、全てのディスカッションに参加しましょう
            </span>
          </div>
        </div>
      </section>

      {/* Discord Section */}
      <section className="bg-[#5865F2] py-16">
        <div className="container-narrow text-center">
          <div className="mx-auto max-w-xl">
            {/* Discord Logo SVG */}
            <svg className="mx-auto h-12 w-12 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>

            <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
              Discordコミュニティに参加
            </h2>
            <p className="mt-3 text-lg text-white/80">
              リアルタイムで質問・情報交換ができるDiscordサーバーに参加しましょう。
              初心者歓迎、気軽に質問できる雰囲気です。
            </p>

            <div className="mt-6 inline-flex items-center gap-3 rounded-xl bg-white/10 px-6 py-4 backdrop-blur-sm">
              <span className="h-3 w-3 rounded-full bg-green-400" />
              <span className="text-lg font-semibold text-white">
                247名がオンライン
              </span>
            </div>

            <div className="mt-6">
              <a
                href="https://discord.gg/dojoc"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-[#5865F2] shadow-lg transition-all hover:bg-slate-100 hover:shadow-xl"
              >
                Discordに参加する
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 sm:py-20">
        <div className="container-narrow">
          <div className="text-center">
            <h2 className="section-heading">メンバーシッププラン</h2>
            <p className="section-subheading">
              あなたに合ったプランを選んで、今すぐ始めましょう
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {membershipPlans.map((plan) => (
              <PricingCard key={plan.name} plan={plan} />
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-dark-500">
            すべてのプランで14日間の無料トライアルが利用可能です。いつでもキャンセルできます。
          </p>
        </div>
      </section>

      {/* Member Stats */}
      <section className="border-t border-dark-800/50 py-16">
        <div className="container-narrow">
          <div className="text-center">
            <h2 className="section-heading">コミュニティの数字</h2>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div className="rounded-xl border border-dark-700/50 bg-dark-800/50 p-6 text-center">
              <p className="text-3xl font-extrabold text-primary-400">1,247</p>
              <p className="mt-1 text-sm text-dark-400">総メンバー数</p>
            </div>
            <div className="rounded-xl border border-dark-700/50 bg-dark-800/50 p-6 text-center">
              <p className="text-3xl font-extrabold text-primary-400">89</p>
              <p className="mt-1 text-sm text-dark-400">Proメンバー</p>
            </div>
            <div className="rounded-xl border border-dark-700/50 bg-dark-800/50 p-6 text-center">
              <p className="text-3xl font-extrabold text-primary-400">24</p>
              <p className="mt-1 text-sm text-dark-400">Expertメンバー</p>
            </div>
            <div className="rounded-xl border border-dark-700/50 bg-dark-800/50 p-6 text-center">
              <p className="text-3xl font-extrabold text-primary-400">36</p>
              <p className="mt-1 text-sm text-dark-400">開催イベント数</p>
            </div>
          </div>

          {/* Active rate */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-green-500/20 px-4 py-2 text-sm font-medium text-green-400">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              週間アクティブ率 68% -- 活発なコミュニティです
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterForm />
    </>
  );
}
