import { describe, it, expect, beforeEach } from "vitest";
import {
  getDb,
  createUser,
  getUserByEmail,
  getUserById,
  updateUserPlan,
  updateUserStripeCustomer,
  createSubscription,
  upsertSubscription,
  getSubscriptionByUserId,
  getSubscriptionByEmail,
  getSubscriptionByStripeId,
  updateSubscriptionStatus,
  updateSubscriptionPeriodEnd,
  createCoursePurchase,
  hasCoursePurchase,
  getCoursePurchasesByUser,
} from "@/lib/db";

// Clear all tables before each test so tests are isolated
beforeEach(() => {
  const db = getDb();
  db.exec("DELETE FROM course_purchases");
  db.exec("DELETE FROM subscriptions");
  db.exec("DELETE FROM users");
});

describe("User CRUD", () => {
  it("creates and retrieves a user by email", () => {
    createUser("u1", "test@example.com", "hash123", "Test User");
    const user = getUserByEmail("test@example.com");
    expect(user).toBeDefined();
    expect(user!.id).toBe("u1");
    expect(user!.email).toBe("test@example.com");
    expect(user!.name).toBe("Test User");
    expect(user!.plan).toBe("free");
    expect(user!.password_hash).toBe("hash123");
  });

  it("retrieves a user by ID", () => {
    createUser("u2", "user2@example.com", "hash456");
    const user = getUserById("u2");
    expect(user).toBeDefined();
    expect(user!.email).toBe("user2@example.com");
    expect(user!.name).toBeNull();
  });

  it("returns undefined for nonexistent user", () => {
    expect(getUserByEmail("nobody@example.com")).toBeUndefined();
    expect(getUserById("nonexistent")).toBeUndefined();
  });

  it("updates user plan", () => {
    createUser("u3", "u3@example.com", "hash");
    updateUserPlan("u3", "pro");
    const user = getUserById("u3");
    expect(user!.plan).toBe("pro");
  });

  it("updates stripe customer ID", () => {
    createUser("u4", "u4@example.com", "hash");
    updateUserStripeCustomer("u4", "cus_12345");
    const user = getUserById("u4");
    expect(user!.stripe_customer_id).toBe("cus_12345");
  });

  it("rejects duplicate email", () => {
    createUser("u5", "dup@example.com", "hash");
    expect(() => createUser("u6", "dup@example.com", "hash")).toThrow();
  });
});

describe("Subscription CRUD", () => {
  beforeEach(() => {
    createUser("su1", "sub-user@example.com", "hash");
  });

  it("creates a subscription and retrieves by user ID", () => {
    createSubscription("su1", "sub-user@example.com", "pro", "sub_stripe_1");
    const sub = getSubscriptionByUserId("su1");
    expect(sub).toBeDefined();
    expect(sub!.plan).toBe("pro");
    expect(sub!.status).toBe("active");
    expect(sub!.stripe_subscription_id).toBe("sub_stripe_1");
  });

  it("retrieves subscription by email", () => {
    createSubscription("su1", "sub-user@example.com", "enterprise");
    const sub = getSubscriptionByEmail("sub-user@example.com");
    expect(sub).toBeDefined();
    expect(sub!.plan).toBe("enterprise");
  });

  it("retrieves subscription by stripe ID", () => {
    createSubscription("su1", "sub-user@example.com", "pro", "sub_abc");
    const sub = getSubscriptionByStripeId("sub_abc");
    expect(sub).toBeDefined();
    expect(sub!.user_id).toBe("su1");
  });

  it("upsertSubscription cancels old and creates new", () => {
    createSubscription("su1", "sub-user@example.com", "pro", "sub_old");
    upsertSubscription("su1", "sub-user@example.com", "enterprise", "sub_new");

    // Old subscription should be cancelled
    const oldSub = getSubscriptionByStripeId("sub_old");
    expect(oldSub!.status).toBe("cancelled");

    // New subscription should be active
    const activeSub = getSubscriptionByUserId("su1");
    expect(activeSub).toBeDefined();
    expect(activeSub!.plan).toBe("enterprise");
    expect(activeSub!.stripe_subscription_id).toBe("sub_new");
  });

  it("updates subscription status", () => {
    createSubscription("su1", "sub-user@example.com", "pro", "sub_x");
    const sub = getSubscriptionByStripeId("sub_x");
    updateSubscriptionStatus(sub!.id, "past_due");

    const updated = getSubscriptionByStripeId("sub_x");
    expect(updated!.status).toBe("past_due");
  });

  it("updates subscription period end", () => {
    createSubscription("su1", "sub-user@example.com", "pro", "sub_y");
    const sub = getSubscriptionByStripeId("sub_y");
    const periodEnd = "2026-03-25T00:00:00.000Z";
    updateSubscriptionPeriodEnd(sub!.id, periodEnd);

    const updated = getSubscriptionByStripeId("sub_y");
    expect(updated!.current_period_end).toBe(periodEnd);
  });

  it("returns undefined for nonexistent subscription", () => {
    expect(getSubscriptionByUserId("nobody")).toBeUndefined();
    expect(getSubscriptionByEmail("nobody@example.com")).toBeUndefined();
    expect(getSubscriptionByStripeId("sub_nonexistent")).toBeUndefined();
  });
});

describe("Course Purchase CRUD", () => {
  beforeEach(() => {
    createUser("pu1", "purchaser@example.com", "hash");
  });

  it("creates a course purchase and checks access", () => {
    createCoursePurchase("pu1", "purchaser@example.com", "ai-security-for-startups-2026", "cs_sess_1");
    expect(hasCoursePurchase("pu1", "ai-security-for-startups-2026")).toBe(true);
    expect(hasCoursePurchase("pu1", "nonexistent-course")).toBe(false);
  });

  it("retrieves all purchases by user", () => {
    createCoursePurchase("pu1", "purchaser@example.com", "course-a");
    createCoursePurchase("pu1", "purchaser@example.com", "course-b");

    const purchases = getCoursePurchasesByUser("pu1");
    expect(purchases).toHaveLength(2);
    expect(purchases.map((p) => p.course_slug).sort()).toEqual(["course-a", "course-b"]);
  });

  it("ignores duplicate purchase (INSERT OR IGNORE)", () => {
    createCoursePurchase("pu1", "purchaser@example.com", "course-x", "cs_1");
    createCoursePurchase("pu1", "purchaser@example.com", "course-x", "cs_2");

    const purchases = getCoursePurchasesByUser("pu1");
    expect(purchases).toHaveLength(1);
    expect(purchases[0].stripe_session_id).toBe("cs_1");
  });
});
