import { NextResponse } from "next/server";
import { getDb } from "../../../db";
import { inquiries } from "../../../db/schema";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  if (!body.name || !body.message) return NextResponse.json({ error: "이름과 문의 내용은 필수입니다." }, { status: 400 });
  const db = getDb();
  if (!db) return NextResponse.json({ ok: true, mode: "demo", message: "DATABASE_URL 설정 후 실제 저장됩니다." }, { status: 202 });
  const result = await db.insert(inquiries).values({ kind: String(body.kind || "CONSULT"), name: String(body.name), phone: String(body.phone || ""), email: String(body.email || ""), categorySlug: String(body.categorySlug || ""), message: String(body.message) }).returning({ id: inquiries.id });
  return NextResponse.json({ ok: true, id: result[0]?.id }, { status: 201 });
}
