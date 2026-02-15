"use client";

import { useState } from "react";

interface PurchaseButtonProps {
  courseSlug: string;
  price: number;
  label?: string;
  className?: string;
}

export default function PurchaseButton({
  courseSlug,
  price,
  label,
  className = "btn-primary w-full !py-3.5",
}: PurchaseButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "購入処理に失敗しました");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "購入処理に失敗しました";
      setError(message);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handlePurchase}
        disabled={isLoading}
        className={`${className} ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            処理中...
          </span>
        ) : (
          label || "購入する"
        )}
      </button>
      {error && (
        <p className="mt-2 text-center text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
