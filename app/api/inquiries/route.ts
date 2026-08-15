import { NextResponse } from "next/server";
import { getDb } from "../../../db";
import { inquiries } from "../../../db/schema";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const name = String(body.name || "").trim();
  const message = String(body.message || "").trim();
  if (!name || !message) return NextResponse.json({ error: "이름과 문의 내용은 필수입니다." }, { status: 400 });
  if (name.length > 80 || message.length > 3000) return NextResponse.json({ error: "입력 가능한 글자 수를 확인해주세요." }, { status: 400 });
  const db = getDb();
  if (!db) return NextResponse.json({ error: "상담 접수 시스템이 아직 연결되지 않았습니다. 잠시 후 다시 시도해주세요." }, { status: 503 });
  try {
    const result = await db.insert(inquiries).values({ kind: String(body.kind || "CONSULT").slice(0, 40), name, phone: String(body.phone || "").slice(0, 40), email: String(body.email || "").slice(0, 160), categorySlug: String(body.categorySlug || "").slice(0, 80), message }).returning({ id: inquiries.id });
    return NextResponse.json({ ok: true, id: result[0]?.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "상담 접수 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요." }, { status: 500 });
  }
}
