import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "../../../../db";
import { orders } from "../../../../db/schema";
import { demoOrders } from "../../../../lib/demo-data";
import { isAdminAuthorized } from "../../../../lib/admin-auth";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthorized())) return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  const db = getDb();
  if (!db) return NextResponse.json({ mode: "demo", orders: demoOrders });
  try { return NextResponse.json({ mode: "database", orders: await db.select().from(orders).orderBy(desc(orders.createdAt)) }); }
  catch (error) { console.error("admin orders failed", error); return NextResponse.json({ error: "주문 데이터를 불러오지 못했습니다." }, { status: 503 }); }
}
