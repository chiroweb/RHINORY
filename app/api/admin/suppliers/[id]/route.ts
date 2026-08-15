import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "../../../../../db";
import { suppliers } from "../../../../../db/schema";
import { isAdminAuthorized } from "../../../../../lib/admin-auth";

export const runtime = "nodejs";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthorized())) return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  const db = getDb();
  if (!db) return NextResponse.json({ error: "DATABASE_URL을 설정하면 공급사를 저장할 수 있습니다." }, { status: 503 });
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const allowed = ["name", "type", "contactName", "phone", "email", "status", "note"] as const;
  const values: Record<string, unknown> = {};
  for (const key of allowed) if (body[key] !== undefined) values[key] = String(body[key]);
  const result = await db.update(suppliers).set(values).where(eq(suppliers.id, Number(id))).returning();
  if (!result[0]) return NextResponse.json({ error: "공급사를 찾을 수 없습니다." }, { status: 404 });
  return NextResponse.json({ supplier: result[0] });
}
