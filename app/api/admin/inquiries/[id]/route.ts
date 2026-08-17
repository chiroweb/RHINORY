import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "../../../../../db";
import { inquiries } from "../../../../../db/schema";
import { isAdminAuthorized } from "../../../../../lib/admin-auth";
import { recordAdminActivity } from "../../../../../lib/admin-activity";

export const runtime = "nodejs";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthorized())) return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  const db = getDb();
  if (!db) return NextResponse.json({ error: "DATABASE_URL을 설정하면 문의 상태를 저장할 수 있습니다." }, { status: 503 });
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  if (!body.status) return NextResponse.json({ error: "상태는 필수입니다." }, { status: 400 });
  const result = await db.update(inquiries).set({ status: String(body.status) }).where(eq(inquiries.id, Number(id))).returning();
  if (!result[0]) return NextResponse.json({ error: "문의를 찾을 수 없습니다." }, { status: 404 });
  await recordAdminActivity(db, "UPDATE", "INQUIRY", id, { status: String(body.status) });
  return NextResponse.json({ inquiry: result[0] });
}
