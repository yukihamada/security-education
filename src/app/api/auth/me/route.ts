import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getSubscriptionByUserId, getCoursePurchasesByUser } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const subscription = getSubscriptionByUserId(user.id);
    const purchases = getCoursePurchasesByUser(user.id);

    return NextResponse.json({
      user: {
        ...user,
        subscription: subscription
          ? { plan: subscription.plan, status: subscription.status }
          : null,
        purchasedCourses: purchases.map((p) => p.course_slug),
      },
    });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
