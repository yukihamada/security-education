import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getDb,
  createUser,
  createSubscription,
  createCoursePurchase,
} from "@/lib/db";

// ---------------------------------------------------------------------------
// Mock the auth module -- we control who the "current user" is
// ---------------------------------------------------------------------------
const mockGetCurrentUser = vi.fn();

vi.mock("@/lib/auth", () => ({
  getCurrentUser: () => mockGetCurrentUser(),
  hashPassword: vi.fn().mockResolvedValue("hashed"),
  verifyPassword: vi.fn().mockResolvedValue(true),
  signJwt: vi.fn().mockReturnValue("fake-token"),
  verifyJwt: vi.fn().mockReturnValue({ userId: "u1", email: "u1@test.com" }),
  COOKIE_NAME: "dojoc_token",
}));

import { GET } from "@/app/api/courses/access/route";
import { NextRequest } from "next/server";

function makeAccessRequest(course: string, lesson: number): NextRequest {
  return new NextRequest(
    `http://localhost:3000/api/courses/access?course=${course}&lesson=${lesson}`,
    { method: "GET" }
  );
}

describe("GET /api/courses/access (content gating)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const db = getDb();
    db.exec("DELETE FROM course_purchases");
    db.exec("DELETE FROM subscriptions");
    db.exec("DELETE FROM users");
  });

  // --------------------------------------------------
  // Free tier: lessons 1 and 2 are always accessible
  // --------------------------------------------------
  it("grants access to lesson 1 (free preview)", async () => {
    mockGetCurrentUser.mockResolvedValue(null);

    const res = await GET(makeAccessRequest("any-course", 1));
    const data = await res.json();

    expect(data.hasAccess).toBe(true);
    expect(data.reason).toBe("free_preview");
  });

  it("grants access to lesson 2 (free preview)", async () => {
    mockGetCurrentUser.mockResolvedValue(null);

    const res = await GET(makeAccessRequest("any-course", 2));
    const data = await res.json();

    expect(data.hasAccess).toBe(true);
    expect(data.reason).toBe("free_preview");
  });

  // --------------------------------------------------
  // Lesson 3+ without auth
  // --------------------------------------------------
  it("denies access to lesson 3 for unauthenticated users", async () => {
    mockGetCurrentUser.mockResolvedValue(null);

    const res = await GET(makeAccessRequest("ai-security-for-startups-2026", 3));
    const data = await res.json();

    expect(data.hasAccess).toBe(false);
    expect(data.reason).toBe("not_authenticated");
  });

  // --------------------------------------------------
  // Authenticated, no subscription, no purchase
  // --------------------------------------------------
  it("denies access to lesson 3 for free-plan user without purchase", async () => {
    createUser("u-free", "free@example.com", "hash");
    mockGetCurrentUser.mockResolvedValue({
      id: "u-free",
      email: "free@example.com",
      name: null,
      plan: "free",
    });

    const res = await GET(makeAccessRequest("ai-security-for-startups-2026", 3));
    const data = await res.json();

    expect(data.hasAccess).toBe(false);
    expect(data.reason).toBe("no_access");
  });

  // --------------------------------------------------
  // Authenticated with pro subscription
  // --------------------------------------------------
  it("grants access to lesson 5 for pro subscriber", async () => {
    createUser("u-pro", "pro@example.com", "hash");
    createSubscription("u-pro", "pro@example.com", "pro", "sub_pro_1");
    mockGetCurrentUser.mockResolvedValue({
      id: "u-pro",
      email: "pro@example.com",
      name: null,
      plan: "pro",
    });

    const res = await GET(makeAccessRequest("ai-security-for-startups-2026", 5));
    const data = await res.json();

    expect(data.hasAccess).toBe(true);
    expect(data.reason).toBe("subscription");
  });

  // --------------------------------------------------
  // Authenticated with enterprise subscription
  // --------------------------------------------------
  it("grants access to lesson 12 for enterprise subscriber", async () => {
    createUser("u-ent", "ent@example.com", "hash");
    createSubscription("u-ent", "ent@example.com", "enterprise", "sub_ent_1");
    mockGetCurrentUser.mockResolvedValue({
      id: "u-ent",
      email: "ent@example.com",
      name: null,
      plan: "enterprise",
    });

    const res = await GET(makeAccessRequest("ai-security-for-startups-2026", 12));
    const data = await res.json();

    expect(data.hasAccess).toBe(true);
    expect(data.reason).toBe("subscription");
  });

  // --------------------------------------------------
  // Authenticated with individual course purchase
  // --------------------------------------------------
  it("grants access via individual course purchase", async () => {
    createUser("u-buyer", "buyer@example.com", "hash");
    createCoursePurchase("u-buyer", "buyer@example.com", "ai-security-for-startups-2026");
    mockGetCurrentUser.mockResolvedValue({
      id: "u-buyer",
      email: "buyer@example.com",
      name: null,
      plan: "free",
    });

    const res = await GET(makeAccessRequest("ai-security-for-startups-2026", 8));
    const data = await res.json();

    expect(data.hasAccess).toBe(true);
    expect(data.reason).toBe("purchased");
  });

  // --------------------------------------------------
  // Purchase for one course does not grant access to another
  // --------------------------------------------------
  it("denies access to a different course even if another is purchased", async () => {
    createUser("u-partial", "partial@example.com", "hash");
    createCoursePurchase("u-partial", "partial@example.com", "ai-security-for-startups-2026");
    mockGetCurrentUser.mockResolvedValue({
      id: "u-partial",
      email: "partial@example.com",
      name: null,
      plan: "free",
    });

    const res = await GET(makeAccessRequest("product-security-design-2026", 4));
    const data = await res.json();

    expect(data.hasAccess).toBe(false);
    expect(data.reason).toBe("no_access");
  });

  // --------------------------------------------------
  // Cancelled subscription does not grant access
  // --------------------------------------------------
  it("denies access when subscription is cancelled", async () => {
    createUser("u-ex", "ex@example.com", "hash");
    const db = getDb();
    db.prepare(
      "INSERT INTO subscriptions (user_id, email, plan, stripe_subscription_id, status) VALUES (?, ?, ?, ?, ?)"
    ).run("u-ex", "ex@example.com", "pro", "sub_ex_1", "cancelled");
    mockGetCurrentUser.mockResolvedValue({
      id: "u-ex",
      email: "ex@example.com",
      name: null,
      plan: "free",
    });

    const res = await GET(makeAccessRequest("ai-security-for-startups-2026", 6));
    const data = await res.json();

    expect(data.hasAccess).toBe(false);
    expect(data.reason).toBe("no_access");
  });
});
