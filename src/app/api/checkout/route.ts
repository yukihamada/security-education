import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { courses } from "@/data/courses";

const PLAN_PRICES: Record<string, { name: string; amount: number }> = {
  premium: { name: "プレミアムプラン", amount: 1980 },
  enterprise: { name: "法人プラン", amount: 14800 },
};

export async function POST(request: NextRequest) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Stripe is not configured. Please set STRIPE_SECRET_KEY." },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2026-01-28.clover",
    });

    const body = await request.json();
    const { plan, courseSlug } = body;

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      request.headers.get("origin") ||
      "http://localhost:3000";

    // --- Course one-time purchase ---
    if (courseSlug) {
      const course = courses.find((c) => c.slug === courseSlug);
      if (!course) {
        return NextResponse.json(
          { error: "指定されたコースが見つかりません" },
          { status: 400 }
        );
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "jpy",
              product_data: {
                name: course.title,
                description: `DojoC 講座 — ${course.title}（全${course.totalLessons}回）`,
              },
              unit_amount: course.price,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/courses/${course.slug}`,
        locale: "ja",
        metadata: {
          type: "course",
          courseSlug: course.slug,
          courseTitle: course.title,
        },
      });

      return NextResponse.json({
        url: session.url,
        sessionId: session.id,
      });
    }

    // --- Plan subscription purchase ---
    if (plan) {
      if (!PLAN_PRICES[plan]) {
        return NextResponse.json(
          { error: "無効なプランが指定されました" },
          { status: 400 }
        );
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "jpy",
              product_data: {
                name: PLAN_PRICES[plan].name,
                description: `DojoC ${PLAN_PRICES[plan].name} — 月額サブスクリプション`,
              },
              unit_amount: PLAN_PRICES[plan].amount,
              recurring: {
                interval: "month",
              },
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/pricing`,
        locale: "ja",
        metadata: {
          type: "plan",
          planId: plan,
        },
      });

      return NextResponse.json({
        url: session.url,
        sessionId: session.id,
      });
    }

    return NextResponse.json(
      { error: "courseSlug または plan を指定してください" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "チェックアウトセッションの作成に失敗しました" },
      { status: 500 }
    );
  }
}
