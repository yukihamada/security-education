import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ---------------------------------------------------------------------------
// Mock Stripe so we never hit a real API.
// We use a class so `new Stripe(...)` works in the production code.
// ---------------------------------------------------------------------------
const mockSessionCreate = vi.fn();

vi.mock("stripe", () => {
  class MockStripe {
    checkout = {
      sessions: {
        create: mockSessionCreate,
      },
    };
  }
  return { default: MockStripe };
});

// Import the handler AFTER the mock is set up
import { POST } from "@/app/api/checkout/route";
import { NextRequest } from "next/server";

/** Helper to build a NextRequest with a JSON body */
function makeRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest("http://localhost:3000/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/checkout", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv, STRIPE_SECRET_KEY: "sk_test_fake" };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  // --------------------------------------------------
  // Missing STRIPE_SECRET_KEY
  // --------------------------------------------------
  it("returns 500 when STRIPE_SECRET_KEY is not set", async () => {
    delete process.env.STRIPE_SECRET_KEY;

    const res = await POST(makeRequest({ plan: "pro" }));
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toContain("STRIPE_SECRET_KEY");
  });

  // --------------------------------------------------
  // Neither plan nor courseSlug provided
  // --------------------------------------------------
  it("returns 400 when no plan or courseSlug is given", async () => {
    const res = await POST(makeRequest({}));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  // --------------------------------------------------
  // Invalid plan
  // --------------------------------------------------
  it("returns 400 for an invalid plan", async () => {
    const res = await POST(makeRequest({ plan: "nonexistent" }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain("無効なプラン");
  });

  // --------------------------------------------------
  // Invalid courseSlug
  // --------------------------------------------------
  it("returns 400 for a nonexistent course slug", async () => {
    const res = await POST(makeRequest({ courseSlug: "no-such-course" }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain("見つかりません");
  });

  // --------------------------------------------------
  // Valid course purchase
  // --------------------------------------------------
  it("creates a Stripe session for a valid course purchase", async () => {
    mockSessionCreate.mockResolvedValueOnce({
      id: "cs_test_123",
      url: "https://checkout.stripe.com/pay/cs_test_123",
    });

    const res = await POST(
      makeRequest({ courseSlug: "ai-security-for-startups-2026" })
    );
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.url).toBe("https://checkout.stripe.com/pay/cs_test_123");
    expect(data.sessionId).toBe("cs_test_123");

    // Verify Stripe was called with correct params
    expect(mockSessionCreate).toHaveBeenCalledOnce();
    const callArgs = mockSessionCreate.mock.calls[0][0];
    expect(callArgs.mode).toBe("payment");
    expect(callArgs.line_items[0].price_data.unit_amount).toBe(4980);
    expect(callArgs.line_items[0].price_data.currency).toBe("jpy");
    expect(callArgs.metadata.type).toBe("course");
    expect(callArgs.metadata.courseSlug).toBe("ai-security-for-startups-2026");
  });

  // --------------------------------------------------
  // Valid plan subscription
  // --------------------------------------------------
  it("creates a Stripe session for a valid plan subscription", async () => {
    mockSessionCreate.mockResolvedValueOnce({
      id: "cs_test_sub_456",
      url: "https://checkout.stripe.com/pay/cs_test_sub_456",
    });

    const res = await POST(makeRequest({ plan: "pro" }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.url).toBe("https://checkout.stripe.com/pay/cs_test_sub_456");
    expect(data.sessionId).toBe("cs_test_sub_456");

    const callArgs = mockSessionCreate.mock.calls[0][0];
    expect(callArgs.mode).toBe("subscription");
    expect(callArgs.line_items[0].price_data.unit_amount).toBe(4980);
    expect(callArgs.line_items[0].price_data.recurring.interval).toBe("month");
    expect(callArgs.metadata.type).toBe("plan");
    expect(callArgs.metadata.planId).toBe("pro");
  });

  // --------------------------------------------------
  // Enterprise plan
  // --------------------------------------------------
  it("creates a Stripe session for enterprise plan", async () => {
    mockSessionCreate.mockResolvedValueOnce({
      id: "cs_test_ent",
      url: "https://checkout.stripe.com/pay/cs_test_ent",
    });

    const res = await POST(makeRequest({ plan: "enterprise" }));
    const data = await res.json();

    expect(res.status).toBe(200);
    const callArgs = mockSessionCreate.mock.calls[0][0];
    expect(callArgs.line_items[0].price_data.unit_amount).toBe(14800);
  });

  // --------------------------------------------------
  // Stripe API failure
  // --------------------------------------------------
  it("returns 500 when Stripe API throws", async () => {
    mockSessionCreate.mockRejectedValueOnce(new Error("Stripe is down"));

    const res = await POST(
      makeRequest({ courseSlug: "ai-security-for-startups-2026" })
    );
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toContain("失敗しました");
  });
});
