import { asc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "../../../../db";
import { suppliers } from "../../../../db/schema";
import { demoSuppliers } from "../../../../lib/demo-data";
import { isAdminAuthorized } from "../../../../lib/admin-auth";
import { recordAdminActivity } from "../../../../lib/admin-activity";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthorized())) return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  const db = getDb();
  if (!db) return NextResponse.json({ mode: "demo", suppliers: demoSuppliers });
  return NextResponse.json({ mode: "database", suppliers: await db.select().from(suppliers).orderBy(asc(suppliers.name)) });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthorized())) return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  const db = getDb();
  if (!db) return NextResponse.json({ error: "DATABASE_URL을 설정하면 공급사를 저장할 수 있습니다." }, { status: 503 });
  const body = await request.json().catch(() => ({}));
  if (!body.name) return NextResponse.json({ error: "공급사명은 필수입니다." }, { status: 400 });
  const result = await db.insert(suppliers).values({ name: String(body.name), type: String(body.type || "MANUFACTURER"), contactName: String(body.contactName || ""), phone: String(body.phone || ""), email: String(body.email || ""), note: String(body.note || "") }).returning();
  await recordAdminActivity(db, "CREATE", "SUPPLIER", result[0].id);
  return NextResponse.json({ supplier: result[0] }, { status: 201 });
}
