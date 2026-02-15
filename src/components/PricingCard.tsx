"use client";

import { MembershipPlan } from "@/types";

export default function PricingCard({ plan }: { plan: MembershipPlan }) {
  const handleClick = async () => {
    if (plan.price === 0) {
      window.location.href = "/articles";
      return;
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: plan.id }),
      });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      window.location.href = "/checkout/success";
    }
  };

  return (
    <div
      className={`relative rounded-2xl border p-8 ${
        plan.highlighted
          ? "border-primary-500/50 bg-dark-900/80 shadow-xl shadow-primary-900/20 glow-purple"
          : "border-dark-700/50 bg-dark-900/50"
      }`}
    >
      {plan.highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-1 text-sm font-semibold text-white shadow-lg shadow-primary-900/30">
            おすすめ
          </span>
        </div>
      )}

      <div className="text-center">
        <h3 className="text-xl font-bold text-white">{plan.name}</h3>
        <div className="mt-4">
          {plan.price === 0 ? (
            <span className="text-4xl font-extrabold text-white">無料</span>
          ) : (
            <>
              <span className="text-4xl font-extrabold text-white">
                &yen;{plan.price.toLocaleString()}
              </span>
              <span className="text-base text-dark-400">/{plan.period}</span>
            </>
          )}
        </div>
      </div>

      <ul className="mt-8 space-y-3">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <svg
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm text-dark-300">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleClick}
        className={`mt-8 w-full rounded-lg px-6 py-3 text-base font-semibold transition-all duration-200 ${
          plan.highlighted
            ? "bg-primary-600 text-white shadow-sm hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-600/25"
            : "border border-dark-600 text-dark-300 hover:border-primary-500/50 hover:text-primary-400"
        }`}
      >
        {plan.buttonLabel}
      </button>
    </div>
  );
}
