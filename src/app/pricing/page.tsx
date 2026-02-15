import { Metadata } from "next";
import PricingCard from "@/components/PricingCard";
import { plans } from "@/data/plans";
import Link from "next/link";

export const metadata: Metadata = {
  title: "料金プラン — DojoC",
  description:
    "DojoCのサイバーセキュリティ教育プラン。無料会員からプレミアム、法人プランまで、ニーズに合ったプランをお選びください。",
};

export default function PricingPage() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-hero-pattern py-16 sm:py-20">
        <div className="container-narrow text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1.5">
            <span className="text-sm font-medium text-primary-300">
              料金プラン
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            あなたに合ったプランで
            <br />
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">セキュリティを学ぼう</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-dark-300">
            個人の学習から法人の社員教育まで。
            <br className="hidden sm:block" />
            すべてのプランに無料トライアルが付いています。
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 sm:py-20">
        <div className="container-narrow">
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>

          {/* Per-course option */}
          <div className="mx-auto mt-12 max-w-2xl rounded-xl border border-dark-700/30 bg-dark-900/50 p-6 sm:p-8 text-center">
            <h3 className="text-lg font-bold text-white">
              1講座ずつ購入することも可能です
            </h3>
            <p className="mt-2 text-sm text-dark-400">
              サブスクリプションではなく、個別の講座を買い切りで購入することもできます。
              各講座の詳細ページから購入手続きが可能です。
            </p>
            <Link href="/courses" className="btn-secondary mt-4 inline-block !text-sm">
              講座一覧を見る
            </Link>
          </div>

          {/* FAQ Hint */}
          <div className="mx-auto mt-16 max-w-2xl text-center">
            <h2 className="text-xl font-bold text-white">
              よくある質問
            </h2>
            <div className="mt-8 space-y-6 text-left">
              <div>
                <h3 className="font-semibold text-white">
                  無料プランでどこまで使えますか？
                </h3>
                <p className="mt-1 text-sm text-dark-400">
                  すべての記事を無制限で閲覧でき、各講座の第1回を無料でプレビューできます。月間ニュースレターやセキュリティ力診断クイズも無料で利用可能です。
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  Proプランと個別購入、どちらがお得ですか？
                </h3>
                <p className="mt-1 text-sm text-dark-400">
                  2つ以上の講座を受講される場合はProプラン（月額4,980円で全講座見放題）がお得です。1つの講座だけ受講される場合は個別購入をおすすめします。
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  プランの変更やキャンセルはできますか？
                </h3>
                <p className="mt-1 text-sm text-dark-400">
                  はい、いつでもプランの変更・キャンセルが可能です。キャンセルした場合も、期間終了までは引き続きご利用いただけます。
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  法人プランの人数制限はありますか？
                </h3>
                <p className="mt-1 text-sm text-dark-400">
                  基本の法人プランは10名からご利用可能です。11名以上のチームにはカスタムプランをご用意しております。お気軽にcontact@enablerdao.comまでお問い合わせください。
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  請求書払いには対応していますか？
                </h3>
                <p className="mt-1 text-sm text-dark-400">
                  法人プランでは請求書払いに対応しています。個人プランはクレジットカード決済のみとなります。
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  修了証明書は何に使えますか？
                </h3>
                <p className="mt-1 text-sm text-dark-400">
                  各証明書にはユニークIDが付与されており、LinkedInなどのプロフィールに掲載可能です。法人プランでは社員教育の実施記録としてもご活用いただけます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-dark-800/50 bg-hero-pattern py-16">
        <div className="container-narrow text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            まずは無料で始めてみませんか？
          </h2>
          <p className="mt-3 text-lg text-dark-400">
            クレジットカード不要。今すぐ無料記事をお読みいただけます。
          </p>
          <div className="mt-8">
            <Link href="/articles" className="btn-primary !px-8 !py-3.5 !text-base">
              無料記事を読む
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
