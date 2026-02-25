import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  getUserByEmail,
  createUser,
  upsertSubscription,
  createCoursePurchase,
  updateUserPlan,
  updateUserStripeCustomer,
  updateSubscriptionStatus,
  updateSubscriptionPeriodEnd,
  getSubscriptionByStripeId,
} from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { Resend } from "resend";
import crypto from "crypto";

// ---------------------------------------------------------------------------
// Email helpers (Resend)
// ---------------------------------------------------------------------------

const FROM_ADDRESS = "DojoC <noreply@dojoc.io>";

function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[Stripe Webhook] RESEND_API_KEY not set — skipping email");
    return null;
  }
  return new Resend(apiKey);
}

async function sendPurchaseEmail(to: string, courseTitle: string) {
  const resend = getResend();
  if (!resend) return;
  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject: `【DojoC】${courseTitle} のご購入ありがとうございます`,
      html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto"><h2 style="color:#1a1a2e">購入完了のお知らせ</h2><p>いつもDojoCをご利用いただきありがとうございます。</p><p>以下の講座へのアクセスが有効になりました。</p><div style="background:#f5f5f5;padding:16px;border-radius:8px;margin:16px 0"><strong>${courseTitle}</strong></div><p>ログイン後、「マイコース」からすぐに学習を始められます。</p><hr style="border:none;border-top:1px solid #eee;margin:24px 0"/><p style="color:#888;font-size:12px">このメールはDojoC（dojoc.io）から自動送信されています。</p></div>`,
    });
    console.log(`[Stripe Webhook] Purchase email sent to ${to}`);
  } catch (err) {
    console.error("[Stripe Webhook] Failed to send purchase email:", err);
  }
}

async function sendSubscriptionEmail(to: string, planName: string) {
  const resend = getResend();
  if (!resend) return;
  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject: `【DojoC】${planName}へのご登録ありがとうございます`,
      html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto"><h2 style="color:#1a1a2e">サブスクリプション登録完了</h2><p>いつもDojoCをご利用いただきありがとうございます。</p><p>以下のプランが有効になりました。</p><div style="background:#f5f5f5;padding:16px;border-radius:8px;margin:16px 0"><strong>${planName}</strong></div><p>プランの特典はすぐにご利用いただけます。</p><hr style="border:none;border-top:1px solid #eee;margin:24px 0"/><p style="color:#888;font-size:12px">このメールはDojoC（dojoc.io）から自動送信されています。</p></div>`,
    });
    console.log(`[Stripe Webhook] Subscription email sent to ${to}`);
  } catch (err) {
    console.error("[Stripe Webhook] Failed to send subscription email:", err);
  }
}

async function sendCancellationEmail(to: string) {
  const resend = getResend();
  if (!resend) return;
  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject: "【DojoC】サブスクリプション解約のお知らせ",
      html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto"><h2 style="color:#1a1a2e">サブスクリプション解約のお知らせ</h2><p>DojoCのサブスクリプションが解約されました。</p><p>現在の請求期間が終了するまでは引き続きご利用いただけます。</p><p>またのご利用をお待ちしております。</p><hr style="border:none;border-top:1px solid #eee;margin:24px 0"/><p style="color:#888;font-size:12px">このメールはDojoC（dojoc.io）から自動送信されています。</p></div>`,
    });
    console.log(`[Stripe Webhook] Cancellation email sent to ${to}`);
  } catch (err) {
    console.error("[Stripe Webhook] Failed to send cancellation email:", err);
  }
}

// ---------------------------------------------------------------------------
// Stripe status -> internal status mapping
// ---------------------------------------------------------------------------

function mapStripeStatus(
  stripeStatus: string
): "active" | "cancelled" | "expired" | "past_due" {
  switch (stripeStatus) {
    case "active":
    case "trialing":
      return "active";
    case "past_due":
      return "past_due";
    case "canceled":
    case "unpaid":
      return "cancelled";
    case "incomplete_expired":
      return "expired";
    default:
      return "cancelled";
  }
}

// Plan display names (must match PLAN_PRICES in checkout route)
const PLAN_NAMES: Record<string, string> = {
  premium: "プレミアムプラン",
  enterprise: "法人プラン",
};

// ---------------------------------------------------------------------------
// Webhook handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || !webhookSecret) {
    console.error("Stripe environment variables are not configured");
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2026-01-28.clover",
  });

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  // Wrap fulfillment in try/catch so we always return 200 to Stripe.
  // A bug in our fulfillment logic should not cause Stripe to retry
  // indefinitely; we log the error and handle it out-of-band.
  try {
    switch (event.type) {
      // ---------------------------------------------------------------
      // checkout.session.completed
      // ---------------------------------------------------------------
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata || {};
        const customerEmail = session.customer_details?.email;

        console.log("[Stripe Webhook] checkout.session.completed", {
          sessionId: session.id,
          customerEmail,
          amountTotal: session.amount_total,
          currency: session.currency,
          paymentStatus: session.payment_status,
          metadata,
        });

        if (!customerEmail) {
          console.error("[Stripe Webhook] No customer email in session");
          break;
        }

        // Ensure user exists -- create one if they checked out as guest
        let user = getUserByEmail(customerEmail);
        if (!user) {
          const userId = crypto.randomUUID();
          const tempHash = await hashPassword(crypto.randomUUID());
          createUser(userId, customerEmail, tempHash);
          user = getUserByEmail(customerEmail)!;
          console.log(
            `[Stripe Webhook] Auto-created user for ${customerEmail}`
          );
        }

        // Link Stripe customer ID to local user
        if (session.customer && typeof session.customer === "string") {
          updateUserStripeCustomer(user.id, session.customer);
        }

        // --- Course one-time purchase ---
        if (metadata.type === "course" && metadata.courseSlug) {
          createCoursePurchase(
            user.id,
            customerEmail,
            metadata.courseSlug,
            session.id
          );
          console.log(
            `[Stripe Webhook] Course access granted: ${metadata.courseTitle} (${metadata.courseSlug}) -> ${customerEmail}`
          );
          await sendPurchaseEmail(
            customerEmail,
            metadata.courseTitle || metadata.courseSlug
          );
        }

        // --- Plan subscription ---
        if (metadata.type === "plan" && metadata.planId) {
          const stripeSubscriptionId =
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription?.id ?? undefined;

          upsertSubscription(
            user.id,
            customerEmail,
            metadata.planId,
            stripeSubscriptionId
          );
          updateUserPlan(user.id, metadata.planId);

          const planName = PLAN_NAMES[metadata.planId] || metadata.planId;
          console.log(
            `[Stripe Webhook] Subscription activated: ${planName} -> ${customerEmail}`
          );
          await sendSubscriptionEmail(customerEmail, planName);
        }

        break;
      }

      // ---------------------------------------------------------------
      // customer.subscription.updated
      // ---------------------------------------------------------------
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        console.log("[Stripe Webhook] customer.subscription.updated", {
          subscriptionId: subscription.id,
          status: subscription.status,
        });

        const dbSub = getSubscriptionByStripeId(subscription.id);
        if (!dbSub) {
          console.warn(
            `[Stripe Webhook] No local subscription for Stripe ID: ${subscription.id}`
          );
          break;
        }

        const newStatus = mapStripeStatus(subscription.status);
        updateSubscriptionStatus(dbSub.id, newStatus);

        // Track billing period for accurate expiration (access via raw object)
        const rawSub = subscription as unknown as Record<string, unknown>;
        if (rawSub.current_period_end && typeof rawSub.current_period_end === "number") {
          const periodEndISO = new Date(
            rawSub.current_period_end * 1000
          ).toISOString();
          updateSubscriptionPeriodEnd(dbSub.id, periodEndISO);
        }

        // Downgrade user plan when subscription is no longer active
        if (newStatus !== "active") {
          updateUserPlan(dbSub.user_id, "free");
          console.log(
            `[Stripe Webhook] User ${dbSub.user_id} downgraded to free (status: ${newStatus})`
          );
        }

        break;
      }

      // ---------------------------------------------------------------
      // customer.subscription.deleted
      // ---------------------------------------------------------------
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        console.log("[Stripe Webhook] customer.subscription.deleted", {
          subscriptionId: subscription.id,
        });

        const dbSub = getSubscriptionByStripeId(subscription.id);
        if (!dbSub) {
          console.warn(
            `[Stripe Webhook] No local subscription for Stripe ID: ${subscription.id}`
          );
          break;
        }

        updateSubscriptionStatus(dbSub.id, "cancelled");
        updateUserPlan(dbSub.user_id, "free");

        console.log(
          `[Stripe Webhook] Subscription cancelled, user ${dbSub.user_id} downgraded to free`
        );
        await sendCancellationEmail(dbSub.email);

        break;
      }

      // ---------------------------------------------------------------
      // payment_intent.payment_failed
      // ---------------------------------------------------------------
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("[Stripe Webhook] payment_intent.payment_failed", {
          id: paymentIntent.id,
          lastError: paymentIntent.last_payment_error?.message,
        });
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    // Log but do not fail -- always return 200 to Stripe
    console.error("[Stripe Webhook] Fulfillment error:", err);
  }

  return NextResponse.json({ received: true });
}
