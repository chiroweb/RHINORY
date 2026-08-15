import { asc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "../../../../db";
import { categories } from "../../../../db/schema";
import { categorySeed } from "../../../../lib/demo-data";
import { isAdminAuthorized } from "../../../../lib/admin-auth";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthorized())) return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  const db = getDb();
  if (!db) return NextResponse.json({ mode: "demo", categories: categorySeed.map(([slug, code, name], id) => ({ id, slug, code, name, sortOrder: id, active: "true" })) });
  return NextResponse.json({ mode: "database", categories: await db.select().from(categories).orderBy(asc(categories.sortOrder)) });
}
