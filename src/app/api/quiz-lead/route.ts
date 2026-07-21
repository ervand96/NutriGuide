import { NextResponse } from "next/server";
import { recordQuizLead } from "@/lib/affiliate-clicks";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email || "").trim();
    const diet = String(body.diet || body.source || "").trim();
    const source = String(body.source || diet || "").trim();
    const quiz_goal = String(body.quiz_goal || "").trim();
    const recommended_product = String(body.recommended_product || "").trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    await recordQuizLead(email, diet || source || "newsletter", {
      source,
      quiz_goal,
      recommended_product,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
