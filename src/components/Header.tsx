"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading, logout } = useAuth();

  const navigation = [
    { name: "講座", href: "/courses" },
    { name: "記事", href: "/articles" },
    { name: "料金", href: "/pricing" },
    { name: "コミュニティ", href: "/community" },
  ];

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-dark-800/80 bg-dark-950/90 backdrop-blur-xl">
      <nav className="container-narrow flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 shadow-lg shadow-primary-900/30">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-tight text-white">
              Dojo<span className="text-primary-400">C</span>
            </span>
            <span className="text-[10px] text-dark-500 leading-tight">by SaveJapan</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-dark-400 transition-colors hover:text-primary-400"
            >
              {item.name}
            </Link>
          ))}
          {loading ? (
            <div className="h-9 w-20 animate-pulse rounded-lg bg-dark-800" />
          ) : user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-dark-400">
                {user.name || user.email.split("@")[0]}
              </span>
              {user.subscription?.plan && user.subscription.plan !== "free" && (
                <span className="rounded-full bg-primary-500/20 px-2 py-0.5 text-xs font-medium text-primary-300">
                  {user.subscription.plan.toUpperCase()}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-dark-400 transition-colors hover:text-red-400"
              >
                ログアウト
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-medium text-dark-400 transition-colors hover:text-primary-400"
              >
                ログイン
              </Link>
              <Link href="/signup" className="btn-primary !px-5 !py-2 !text-sm">
                無料登録
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden rounded-lg p-2 text-dark-400 hover:bg-dark-800 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="メニューを開く"
        >
          {mobileMenuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-dark-800 bg-dark-950 md:hidden">
          <div className="container-narrow space-y-1 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-lg px-4 py-2.5 text-base font-medium text-dark-300 hover:bg-dark-800 hover:text-primary-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-2">
              {user ? (
                <div className="space-y-2">
                  <p className="px-4 text-sm text-dark-500">
                    {user.email}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="block w-full rounded-lg px-4 py-2.5 text-left text-base font-medium text-dark-300 hover:bg-dark-800 hover:text-red-400"
                  >
                    ログアウト
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    className="block rounded-lg px-4 py-2.5 text-base font-medium text-dark-300 hover:bg-dark-800 hover:text-primary-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    ログイン
                  </Link>
                  <Link
                    href="/signup"
                    className="btn-primary block w-full text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    無料登録
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
