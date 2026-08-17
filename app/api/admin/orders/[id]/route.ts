import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "../../../../../db";
import { orders } from "../../../../../db/schema";
import { isAdminAuthorized } from "../../../../../lib/admin-auth";
import { errorMessage, idValue, nonNegativeInteger } from "../../../../../lib/admin-validation";
import { recordAdminActivity } from "../../../../../lib/admin-activity";

export const runtime = "nodejs";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthorized())) return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  const db = getDb();
  if (!db) return NextResponse.json({ error: "DATABASE_URL을 설정하면 주문을 저장할 수 있습니다." }, { status: 503 });
  const body = await request.json().catch(() => ({}));
  try {
    const id = idValue((await params).id);
    const allowed = ["status", "paymentStatus", "deliveryStatus", "trackingNumber", "supplierId", "claimStatus", "claimReason", "refundAmount"] as const;
    const values: Record<string, unknown> = {};
    for (const key of allowed) if (body[key] !== undefined) values[key] = key === "supplierId" ? Number(body[key]) || null : key === "refundAmount" ? nonNegativeInteger(body[key]) : String(body[key]).slice(0, 500);
    if (!Object.keys(values).length) return NextResponse.json({ error: "변경할 값이 없습니다." }, { status: 400 });
    const result = await db.update(orders).set(values).where(eq(orders.id, id)).returning();
    if (!result[0]) return NextResponse.json({ error: "주문을 찾을 수 없습니다." }, { status: 404 });
    await recordAdminActivity(db, "UPDATE", "ORDER", id, { fields: Object.keys(values) });
    return NextResponse.json({ order: result[0] });
  } catch (error) { return NextResponse.json({ error: errorMessage(error) }, { status: 400 }); }
}
