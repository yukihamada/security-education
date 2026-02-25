import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getSubscriptionByUserId, hasCoursePurchase } from "@/lib/db";

/** Check if the current user can access a specific lesson.
 *  Free tier: first 2 lessons of each course.
 *  Pro/Enterprise subscription or individual purchase: all lessons.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const courseSlug = searchParams.get("course");
  const lessonNumber = parseInt(searchParams.get("lesson") || "0", 10);

  // First 2 lessons are always free
  if (lessonNumber <= 2) {
    return NextResponse.json({ hasAccess: true, reason: "free_preview" });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ hasAccess: false, reason: "not_authenticated" });
  }

  // Check active subscription
  const subscription = getSubscriptionByUserId(user.id);
  if (
    subscription &&
    (subscription.plan === "pro" || subscription.plan === "enterprise")
  ) {
    return NextResponse.json({ hasAccess: true, reason: "subscription" });
  }

  // Check individual course purchase
  if (courseSlug && hasCoursePurchase(user.id, courseSlug)) {
    return NextResponse.json({ hasAccess: true, reason: "purchased" });
  }

  return NextResponse.json({ hasAccess: false, reason: "no_access" });
}
