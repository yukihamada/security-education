import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "DojoC — サイバーセキュリティ学習プラットフォーム | SaveJapan by EnablerDAO",
  description:
    "セキュリティの民主化。すべての人に実践的なサイバーセキュリティ教育を。無料記事から実践講座、修了資格まで、体系的に学べるプラットフォームです。",
  keywords: [
    "サイバーセキュリティ",
    "セキュリティ教育",
    "情報セキュリティ",
    "セキュリティ研修",
    "企業研修",
    "CTF",
    "フィッシング",
    "ランサムウェア",
    "日本",
  ],
  metadataBase: new URL("https://www.dojoc.io"),
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "DojoC — サイバーセキュリティ学習プラットフォーム",
    description:
      "セキュリティの民主化。すべての人に実践的なサイバーセキュリティ教育を。",
    url: "https://www.dojoc.io",
    siteName: "DojoC",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "DojoC — サイバーセキュリティ学習プラットフォーム",
    description:
      "セキュリティの民主化。すべての人に実践的なサイバーセキュリティ教育を。",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Noto+Sans+JP:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
