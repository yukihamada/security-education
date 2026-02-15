import { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー — DojoC",
  description: "DojoCの個人情報保護方針です。",
};

export default function PrivacyPage() {
  return (
    <>
      <section className="bg-hero-pattern py-12">
        <div className="container-narrow text-center">
          <h1 className="text-3xl font-extrabold text-white">
            プライバシーポリシー
          </h1>
          <p className="mt-2 text-sm text-dark-400">最終更新日: 2026年2月1日</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container-narrow">
          <div className="prose-article mx-auto max-w-3xl">
            <p>
              DojoC（以下「当サービス」）は、SaveJapan by EnablerDAO（以下「当社」）が運営するサイバーセキュリティ教育プラットフォームです。当社は、ユーザーの個人情報の保護を最重要事項と位置づけ、個人情報保護法その他の関連法令を遵守し、以下の通りプライバシーポリシーを定めます。
            </p>

            <h2>1. 事業者情報</h2>
            <ul>
              <li>サービス名称: DojoC（dojoc.io）</li>
              <li>運営: SaveJapan by EnablerDAO</li>
              <li>お問い合わせ: contact@enablerdao.com</li>
            </ul>

            <h2>2. 収集する情報</h2>
            <p>当サービスは、以下の情報を収集する場合があります。</p>
            <ul>
              <li>メールアドレス（ニュースレター登録、アカウント作成時）</li>
              <li>お名前（アカウント作成時）</li>
              <li>会社名・部署名（法人プラン申込時）</li>
              <li>決済情報（有料サービス利用時、Stripeを通じて処理）</li>
              <li>学習進捗情報（講座の受講状況、テスト結果等）</li>
              <li>アクセスログ（IPアドレス、ブラウザ情報、閲覧ページ等）</li>
              <li>Cookie情報</li>
            </ul>

            <h2>3. 情報の利用目的</h2>
            <p>収集した情報は、以下の目的で利用します。</p>
            <ul>
              <li>サービスの提供・運営（講座配信、修了証発行等）</li>
              <li>ニュースレターの配信</li>
              <li>お問い合わせへの対応</li>
              <li>サービスの改善・新機能の開発</li>
              <li>利用状況の分析（アクセス解析等）</li>
              <li>法人プランにおける受講管理レポートの提供</li>
              <li>不正利用の防止</li>
            </ul>

            <h2>4. 情報の第三者提供</h2>
            <p>
              当社は、以下の場合を除き、ユーザーの個人情報を第三者に提供しません。
            </p>
            <ul>
              <li>ユーザーの同意がある場合</li>
              <li>法令に基づく場合</li>
              <li>決済処理のためにStripe Inc.に必要な情報を提供する場合</li>
              <li>法人プランにおいて、管理者に受講状況を共有する場合（契約範囲内のみ）</li>
            </ul>

            <h2>5. 外部サービスの利用</h2>
            <p>当サービスでは、以下の外部サービスを利用しています。</p>
            <ul>
              <li>Stripe Inc. — 決済処理</li>
              <li>Vercel Inc. — ウェブサイトホスティング</li>
              <li>Discord Inc. — コミュニティ運営</li>
            </ul>
            <p>
              各サービスのプライバシーポリシーについては、各社のウェブサイトをご確認ください。
            </p>

            <h2>6. Cookieの使用</h2>
            <p>
              当サービスでは、ユーザー体験の向上やアクセス解析のためにCookieを使用しています。ブラウザの設定によりCookieを無効にすることも可能ですが、一部のサービスが正常に動作しない場合があります。
            </p>

            <h2>7. セキュリティ</h2>
            <p>
              当社は、個人情報の漏洩、紛失、改ざんを防止するため、適切な技術的・組織的セキュリティ対策を講じています。通信はTLSにより暗号化され、決済情報はStripeを通じて安全に処理されます。当サービスのサーバーにはカード番号等の決済情報を保存しません。
            </p>

            <h2>8. データの保持期間</h2>
            <p>
              収集した個人情報は、利用目的の達成に必要な期間のみ保持し、不要となった場合は速やかに削除します。アカウントを削除された場合、関連する個人情報は30日以内に削除されます（法令に基づく保持義務がある場合を除く）。
            </p>

            <h2>9. ユーザーの権利</h2>
            <p>ユーザーは、以下の権利を有します。</p>
            <ul>
              <li>自己の個人情報の開示を請求する権利</li>
              <li>個人情報の訂正・削除を請求する権利</li>
              <li>個人情報の利用停止を請求する権利</li>
              <li>ニュースレターの配信停止を要求する権利</li>
              <li>アカウントの削除を要求する権利</li>
            </ul>
            <p>
              上記の権利行使を希望される場合は、contact@enablerdao.com までご連絡ください。
            </p>

            <h2>10. ポリシーの変更</h2>
            <p>
              当社は、本プライバシーポリシーを変更する場合があります。重要な変更がある場合は、サービス上での告知またはメールにて事前に通知いたします。変更後のポリシーは、サイト上に掲載した時点から効力を生じるものとします。
            </p>

            <h2>11. お問い合わせ</h2>
            <p>
              個人情報の取り扱いに関するお問い合わせは、以下までご連絡ください。
            </p>
            <ul>
              <li>メール: contact@enablerdao.com</li>
              <li>運営: SaveJapan by EnablerDAO</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
