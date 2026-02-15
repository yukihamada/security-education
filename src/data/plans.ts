import { MembershipPlan } from "@/types";

export const plans: MembershipPlan[] = [
  {
    id: "free",
    name: "無料会員",
    price: 0,
    period: "",
    features: [
      "全記事の閲覧（無制限）",
      "各講座の第1回を無料プレビュー",
      "月間ニュースレターの受信",
      "コミュニティ掲示板の閲覧",
      "セキュリティ力診断クイズ",
    ],
    highlighted: false,
    buttonLabel: "無料で始める",
  },
  {
    id: "pro",
    name: "Proプラン",
    price: 4980,
    period: "月",
    features: [
      "無料会員の全機能",
      "全講座の動画が見放題",
      "修了証明書・資格バッジの発行",
      "Discordコミュニティへの参加",
      "月例オンライン勉強会（録画あり）",
      "CTFチャレンジへの参加",
      "優先メールサポート",
    ],
    highlighted: true,
    buttonLabel: "Proプランを始める",
  },
  {
    id: "enterprise",
    name: "チーム / 法人プラン",
    price: 14800,
    period: "月〜",
    features: [
      "Proプランの全機能（10名分〜）",
      "チーム管理ダッシュボード",
      "社員の受講進捗トラッキング",
      "部署別・役職別レポート",
      "カスタム研修コースの作成",
      "請求書払い対応",
      "専任カスタマーサクセス担当",
      "SSO / SAML連携（要相談）",
    ],
    highlighted: false,
    buttonLabel: "お問い合わせ",
  },
];
