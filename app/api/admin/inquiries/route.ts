import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "../../../../db";
import { inquiries } from "../../../../db/schema";
import { demoInquiries } from "../../../../lib/demo-data";
import { isAdminAuthorized } from "../../../../lib/admin-auth";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthorized())) return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  const db = getDb();
  if (!db) return NextResponse.json({ mode: "demo", inquiries: demoInquiries });
  return NextResponse.json({ mode: "database", inquiries: await db.select().from(inquiries).orderBy(desc(inquiries.createdAt)) });
}
