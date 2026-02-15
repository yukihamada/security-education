# SaveJapan - セキュリティ教育プラットフォーム MVP 実装計画

## 概要
日本向けサイバーセキュリティ教育プラットフォームのMVP。
無料記事で集客し、有料講座・コミュニティメンバーシップで収益化。

## 技術スタック
- **フレームワーク**: Next.js 14 (App Router) + TypeScript
- **スタイリング**: Tailwind CSS 3
- **フォント**: Noto Sans JP (Google Fonts)
- **コンテンツ管理**: ハードコードされたデータ (`/src/data/`)
- **デプロイ**: Vercel

## ディレクトリ構成
```
c-security-education/
├── IMPLEMENTATION_PLAN.md
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
├── public/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # ルートレイアウト (Noto Sans JP, グローバルナビ)
│   │   ├── page.tsx            # トップページ
│   │   ├── globals.css         # Tailwind + カスタムスタイル
│   │   ├── articles/
│   │   │   ├── page.tsx        # 記事一覧
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # 記事詳細
│   │   ├── courses/
│   │   │   ├── page.tsx        # 講座一覧
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # 講座詳細
│   │   ├── community/
│   │   │   └── page.tsx        # コミュニティページ
│   │   └── api/
│   │       ├── articles/
│   │       │   ├── route.ts          # GET /api/articles
│   │       │   └── [slug]/
│   │       │       └── route.ts      # GET /api/articles/[slug]
│   │       ├── courses/
│   │       │   ├── route.ts          # GET /api/courses
│   │       │   └── [slug]/
│   │       │       └── route.ts      # GET /api/courses/[slug]
│   │       └── newsletter/
│   │           └── route.ts          # POST /api/newsletter
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx
│   │   ├── ArticleCard.tsx
│   │   ├── CourseCard.tsx
│   │   ├── NewsletterForm.tsx
│   │   ├── PricingCard.tsx
│   │   └── CTASection.tsx
│   ├── data/
│   │   ├── articles.ts         # 記事データ (5本)
│   │   └── courses.ts          # 講座データ (3本)
│   └── types/
│       └── index.ts            # 型定義
```

## 実装ステップ

### Phase 1: 基盤セットアップ
1. package.json / tsconfig.json / next.config.js
2. Tailwind CSS 設定
3. 型定義 (`types/index.ts`)
4. データファイル (`data/articles.ts`, `data/courses.ts`)

### Phase 2: レイアウト・共通コンポーネント
5. globals.css
6. Header / Footer
7. layout.tsx (ルートレイアウト)

### Phase 3: ページコンポーネント
8. HeroSection / ArticleCard / CourseCard / NewsletterForm / CTASection / PricingCard
9. トップページ (`/`)
10. 記事一覧 (`/articles`) + 記事詳細 (`/articles/[slug]`)
11. 講座一覧 (`/courses`) + 講座詳細 (`/courses/[slug]`)
12. コミュニティページ (`/community`)

### Phase 4: API Routes
13. GET /api/articles, GET /api/articles/[slug]
14. GET /api/courses, GET /api/courses/[slug]
15. POST /api/newsletter

## カラーパレット
- Primary: `#0d9488` (teal-600)
- Primary Light: `#14b8a6` (teal-500)
- Primary Dark: `#0f766e` (teal-700)
- Accent: `#f59e0b` (amber-500)
- Background: `#f8fafc` (slate-50)
- Text: `#1e293b` (slate-800)
- Text Light: `#64748b` (slate-500)

## 収益モデル
| チャネル | 価格 | 詳細 |
|---------|------|------|
| 無料記事 | ¥0 | 集客用 5本 |
| 実践サイバーセキュリティ入門 | ¥5,000 | 全10回 |
| 企業セキュリティ担当者養成 | ¥15,000 | 全20回 |
| ハンズオンCTFトレーニング | ¥10,000 | 全15回 |
| Community Free | ¥0/月 | 基本アクセス |
| Community Pro | ¥1,000/月 | Q&A + 月例勉強会 |
| Community Expert | ¥3,000/月 | 個別メンタリング含む |
