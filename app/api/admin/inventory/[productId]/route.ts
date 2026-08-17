import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "../../../../../db";
import { inventory, inventoryMovements } from "../../../../../db/schema";
import { isAdminAuthorized } from "../../../../../lib/admin-auth";
import { recordAdminActivity } from "../../../../../lib/admin-activity";

export const runtime = "nodejs";

export async function PATCH(request: Request, { params }: { params: Promise<{ productId: string }> }) {
  if (!(await isAdminAuthorized())) return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  const db = getDb();
  if (!db) return NextResponse.json({ error: "DATABASE_URL을 설정하면 재고를 저장할 수 있습니다." }, { status: 503 });
  const { productId } = await params;
  const body = await request.json().catch(() => ({}));
  const quantity = Number(body.quantity);
  const reorderPoint = Number(body.reorderPoint);
  if (!Number.isInteger(quantity) || quantity < 0 || !Number.isInteger(reorderPoint) || reorderPoint < 0) return NextResponse.json({ error: "재고 수량은 0 이상의 정수여야 합니다." }, { status: 400 });
  const current = await db.select().from(inventory).where(eq(inventory.productId, Number(productId)));
  const result = await db.update(inventory).set({ quantity, reorderPoint, updatedAt: new Date() }).where(eq(inventory.productId, Number(productId))).returning();
  if (!result[0]) return NextResponse.json({ error: "재고 정보를 찾을 수 없습니다." }, { status: 404 });
  const delta = quantity - (current[0]?.quantity ?? quantity);
  if (delta !== 0) await db.insert(inventoryMovements).values({ productId: Number(productId), delta, reason: "MANUAL", reference: "admin" });
  await recordAdminActivity(db, "UPDATE", "INVENTORY", productId, { quantity, reorderPoint, delta });
  return NextResponse.json({ inventory: result[0] });
}
