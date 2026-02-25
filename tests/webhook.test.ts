import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getDb,
  createUser,
  getUserByEmail,
  getUserById,
  getSubscriptionByStripeId,
  getSubscriptionByUserId,
  hasCoursePurchase,
} from "@/lib/db";

// ---------------------------------------------------------------------------
// Mock Stripe -- we control constructEvent to return whatever event we want.
// We use a class so `new Stripe(...)` works in the production code.
// ---------------------------------------------------------------------------
const mockConstructEvent = vi.fn();

vi.mock("stripe", () => {
  class MockStripe {
    webhooks = {
      constructEvent: mockConstructEvent,
    };
  }
  return { default: MockStripe };
});

// Mock Resend to prevent actual email sending
vi.mock("resend", () => {
  class MockResend {
    emails = {
      send: vi.fn().mockResolvedValue({ id: "mock-email-id" }),
    };
  }
  return { Resend: MockResend };
});

import { POST } from "@/app/api/webhook/stripe/route";
import { NextRequest } from "next/server";

function makeWebhookRequest(body: string): NextRequest {
  return new NextRequest("http://localhost:3000/api/webhook/stripe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "stripe-signature": "t=1234567890,v1=fake_sig",
    },
    body,
  });
}

describe("POST /api/webhook/stripe", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = {
      ...originalEnv,
      STRIPE_SECRET_KEY: "sk_test_fake",
      STRIPE_WEBHOOK_SECRET: "whsec_test_fake",
      RESEND_API_KEY: "re_test_fake",
    };

    // Clean DB
    const db = getDb();
    db.exec("DELETE FROM course_purchases");
    db.exec("DELETE FROM subscriptions");
    db.exec("DELETE FROM users");
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  // --------------------------------------------------
  // Missing environment variables
  // --------------------------------------------------
  it("returns 500 when Stripe env vars are missing", async () => {
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_WEBHOOK_SECRET;

    const res = await POST(makeWebhookRequest("{}"));
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toContain("not configured");
  });

  // --------------------------------------------------
  // Missing signature header
  // --------------------------------------------------
  it("returns 400 when stripe-signature header is missing", async () => {
    const req = new NextRequest("http://localhost:3000/api/webhook/stripe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain("stripe-signature");
  });

  // --------------------------------------------------
  // Signature verification failure
  // --------------------------------------------------
  it("returns 400 when signature verification fails", async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error("Signature verification failed");
    });

    const res = await POST(makeWebhookRequest("{}"));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain("Signature verification failed");
  });

  // --------------------------------------------------
  // checkout.session.completed -- course purchase
  // --------------------------------------------------
  it("processes course purchase on checkout.session.completed", async () => {
    // Pre-create the user
    createUser("u-buyer", "buyer@example.com", "hash123");

    mockConstructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_live_123",
          customer: "cus_123",
          customer_details: { email: "buyer@example.com" },
          amount_total: 4980,
          currency: "jpy",
          payment_status: "paid",
          metadata: {
            type: "course",
            courseSlug: "ai-security-for-startups-2026",
            courseTitle: "AIサービス時代のセキュリティ実践",
          },
        },
      },
    });

    const res = await POST(makeWebhookRequest("{}"));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.received).toBe(true);

    // Verify: course purchase recorded
    expect(hasCoursePurchase("u-buyer", "ai-security-for-startups-2026")).toBe(true);

    // Verify: stripe customer ID linked
    const user = getUserById("u-buyer");
    expect(user!.stripe_customer_id).toBe("cus_123");
  });

  // --------------------------------------------------
  // checkout.session.completed -- creates user if not exists
  // --------------------------------------------------
  it("auto-creates user when checkout comes from a new email", async () => {
    mockConstructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_new_user",
          customer: "cus_new",
          customer_details: { email: "newuser@example.com" },
          amount_total: 4980,
          currency: "jpy",
          payment_status: "paid",
          metadata: {
            type: "course",
            courseSlug: "ai-security-for-startups-2026",
            courseTitle: "AIサービス時代のセキュリティ実践",
          },
        },
      },
    });

    const res = await POST(makeWebhookRequest("{}"));
    expect(res.status).toBe(200);

    // User should have been auto-created
    const user = getUserByEmail("newuser@example.com");
    expect(user).toBeDefined();
    expect(user!.stripe_customer_id).toBe("cus_new");
    expect(hasCoursePurchase(user!.id, "ai-security-for-startups-2026")).toBe(true);
  });

  // --------------------------------------------------
  // checkout.session.completed -- plan subscription
  // --------------------------------------------------
  it("processes plan subscription on checkout.session.completed", async () => {
    createUser("u-sub", "subscriber@example.com", "hash");

    mockConstructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_sub_1",
          customer: "cus_sub",
          subscription: "sub_stripe_1",
          customer_details: { email: "subscriber@example.com" },
          amount_total: 4980,
          currency: "jpy",
          payment_status: "paid",
          metadata: {
            type: "plan",
            planId: "pro",
          },
        },
      },
    });

    const res = await POST(makeWebhookRequest("{}"));
    expect(res.status).toBe(200);

    // Verify subscription created
    const sub = getSubscriptionByUserId("u-sub");
    expect(sub).toBeDefined();
    expect(sub!.plan).toBe("pro");
    expect(sub!.status).toBe("active");
    expect(sub!.stripe_subscription_id).toBe("sub_stripe_1");

    // Verify user plan updated
    const user = getUserById("u-sub");
    expect(user!.plan).toBe("pro");
  });

  // --------------------------------------------------
  // customer.subscription.updated -- downgrade
  // --------------------------------------------------
  it("downgrades user when subscription status becomes past_due", async () => {
    createUser("u-downgrade", "downgrade@example.com", "hash");
    const db = getDb();
    db.prepare(
      "INSERT INTO subscriptions (user_id, email, plan, stripe_subscription_id, status) VALUES (?, ?, ?, ?, ?)"
    ).run("u-downgrade", "downgrade@example.com", "pro", "sub_dg_1", "active");
    db.prepare("UPDATE users SET plan = ? WHERE id = ?").run("pro", "u-downgrade");

    mockConstructEvent.mockReturnValue({
      type: "customer.subscription.updated",
      data: {
        object: {
          id: "sub_dg_1",
          status: "past_due",
          current_period_end: 1742860800, // 2025-03-25T00:00:00Z
        },
      },
    });

    const res = await POST(makeWebhookRequest("{}"));
    expect(res.status).toBe(200);

    // User should be downgraded to free
    const user = getUserById("u-downgrade");
    expect(user!.plan).toBe("free");

    // Subscription status should be updated
    const sub = getSubscriptionByStripeId("sub_dg_1");
    expect(sub!.status).toBe("past_due");
  });

  // --------------------------------------------------
  // customer.subscription.deleted
  // --------------------------------------------------
  it("cancels subscription and downgrades user on subscription.deleted", async () => {
    createUser("u-cancel", "cancel@example.com", "hash");
    const db = getDb();
    db.prepare(
      "INSERT INTO subscriptions (user_id, email, plan, stripe_subscription_id, status) VALUES (?, ?, ?, ?, ?)"
    ).run("u-cancel", "cancel@example.com", "pro", "sub_cancel_1", "active");
    db.prepare("UPDATE users SET plan = ? WHERE id = ?").run("pro", "u-cancel");

    mockConstructEvent.mockReturnValue({
      type: "customer.subscription.deleted",
      data: {
        object: {
          id: "sub_cancel_1",
        },
      },
    });

    const res = await POST(makeWebhookRequest("{}"));
    expect(res.status).toBe(200);

    const user = getUserById("u-cancel");
    expect(user!.plan).toBe("free");

    const sub = getSubscriptionByStripeId("sub_cancel_1");
    expect(sub!.status).toBe("cancelled");
  });

  // --------------------------------------------------
  // Unhandled event type -- still returns 200
  // --------------------------------------------------
  it("returns 200 for unhandled event types", async () => {
    mockConstructEvent.mockReturnValue({
      type: "invoice.paid",
      data: { object: {} },
    });

    const res = await POST(makeWebhookRequest("{}"));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.received).toBe(true);
  });

  // --------------------------------------------------
  // checkout.session.completed with no customer email
  // --------------------------------------------------
  it("handles missing customer email gracefully", async () => {
    mockConstructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_no_email",
          customer: "cus_x",
          customer_details: {},
          metadata: {
            type: "course",
            courseSlug: "ai-security-for-startups-2026",
          },
        },
      },
    });

    const res = await POST(makeWebhookRequest("{}"));
    expect(res.status).toBe(200);
    // No user created, no crash
    expect(getUserByEmail("")).toBeUndefined();
  });
});
