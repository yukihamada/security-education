import Link from "next/link";

const steps = [
  {
    level: "BEGINNER",
    label: "初級",
    title: "AIサービス時代のセキュリティ実践",
    description: "ChatGPT・Claude・RAG時代に必須のセキュリティ知識を、実体験ベースで解説。非エンジニアでも即実践できる全12回コース",
    lessons: 12,
    duration: "約6時間",
    topics: ["AI×セキュリティ", "Prompt Injection", "個人情報保護法", "SaaS選定"],
    color: "accent",
    href: "/courses/ai-security-for-startups-2026",
  },
  {
    level: "INTERMEDIATE",
    label: "中級",
    title: "プロダクトセキュリティ設計",
    description: "認証・認可からCI/CD、インシデント対応まで、0→1のプロダクト開発におけるセキュリティ設計を体系的に習得",
    lessons: 18,
    duration: "約14.3時間",
    topics: ["OAuth / パスキー", "RBAC / ABAC", "CI/CDセキュリティ", "IaC"],
    color: "amber",
    href: "/courses/product-security-design-2026",
  },
  {
    level: "ADVANCED",
    label: "上級",
    title: "AI Red Teaming & セキュリティ実践",
    description: "OWASP LLM Top 10やバグバウンティの実体験を交えて、AIシステムの脆弱性を攻撃者視点で検証する実践コース",
    lessons: 15,
    duration: "約11.3時間",
    topics: ["OWASP LLM Top 10", "Jailbreak", "RAG攻撃", "ペネトレーションテスト"],
    color: "red",
    href: "/courses/ai-red-teaming-2026",
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  accent: {
    bg: "bg-accent-500/10",
    text: "text-accent-400",
    border: "border-accent-500/20",
    dot: "bg-accent-400",
  },
  amber: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
    dot: "bg-amber-400",
  },
  red: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/20",
    dot: "bg-red-400",
  },
};

export default function LearningPath() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container-narrow">
        <div className="text-center">
          <h2 className="section-heading">学習パス</h2>
          <p className="section-subheading">
            初級から上級まで、段階的にスキルアップできる体系的なカリキュラム
          </p>
        </div>

        <div className="mt-16 relative">
          {/* Vertical connecting line (desktop) */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent-500/30 via-amber-500/30 to-red-500/30 hidden lg:block" />

          <div className="space-y-8 lg:space-y-0">
            {steps.map((step, index) => {
              const colors = colorMap[step.color];
              return (
                <div key={step.level} className="relative lg:grid lg:grid-cols-2 lg:gap-16 lg:py-8">
                  {/* Dot on timeline (desktop) */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block z-10">
                    <div className={`h-4 w-4 rounded-full ${colors.dot} ring-4 ring-dark-950`} />
                  </div>

                  {/* Content - alternating sides */}
                  <div className={`${index % 2 === 0 ? "lg:pr-16" : "lg:col-start-2 lg:pl-16"}`}>
                    <Link href={step.href} className="block group">
                      <div className={`rounded-2xl border ${colors.border} bg-dark-900/50 p-6 sm:p-8 transition-all duration-300 hover:border-primary-500/30 hover:shadow-lg hover:shadow-primary-900/10`}>
                        {/* Level badge */}
                        <div className="flex items-center gap-3 mb-4">
                          <span className={`badge ${colors.bg} ${colors.text} font-mono text-[10px] tracking-wider`}>
                            {step.level}
                          </span>
                          <span className={`text-sm font-semibold ${colors.text}`}>{step.label}</span>
                          <div className="flex-1" />
                          <span className="text-xs text-dark-500">{step.lessons}レッスン / {step.duration}</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
                          {step.title}
                        </h3>

                        {/* Description */}
                        <p className="mt-2 text-sm text-dark-400 leading-relaxed">
                          {step.description}
                        </p>

                        {/* Topics */}
                        <div className="mt-4 flex flex-wrap gap-2">
                          {step.topics.map((topic) => (
                            <span key={topic} className="rounded-md bg-dark-800 px-2.5 py-1 text-xs text-dark-300">
                              {topic}
                            </span>
                          ))}
                        </div>

                        {/* Arrow */}
                        <div className="mt-5 flex items-center gap-2 text-sm font-medium text-primary-400">
                          <span>コースの詳細を見る</span>
                          <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </div>

                  {/* Empty col for alternating layout */}
                  {index % 2 === 0 && <div className="hidden lg:block" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
