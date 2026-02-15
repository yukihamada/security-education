import Link from "next/link";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-hero-pattern py-20">
      {/* Ambient glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-3xl" />
      </div>

      <div className="container-narrow relative text-center">
        <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
          セキュリティスキルを、
          <br className="sm:hidden" />
          <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
            今日から
          </span>
          始めよう
        </h2>
        <p className="mt-4 text-lg text-dark-400 max-w-2xl mx-auto">
          1,200名以上が学んでいるDojoC。無料プランから始めて、
          <br className="hidden sm:block" />
          あなたのペースで実践的なセキュリティスキルを身につけましょう。
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/pricing" className="btn-primary !px-10 !py-4 !text-base">
            無料で始める
          </Link>
          <Link href="/courses" className="btn-secondary !px-10 !py-4 !text-base">
            講座を見る
          </Link>
        </div>
      </div>
    </section>
  );
}
