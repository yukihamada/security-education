import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "メールアドレスを入力してください" }, { status: 400 });
  }

  const db = getDb();

  try {
    db.prepare(
      "INSERT INTO newsletter_subscribers (id, email) VALUES (?, ?)"
    ).run(randomUUID(), email);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    if (e.message?.includes("UNIQUE")) {
      return NextResponse.json({ success: true, message: "既に登録済みです" });
    }
    return NextResponse.json({ error: "登録に失敗しました" }, { status: 500 });
  }
}
