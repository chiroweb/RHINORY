import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "../../../../../db";
import { products } from "../../../../../db/schema";
import { isAdminAuthorized } from "../../../../../lib/admin-auth";
import { errorMessage, idValue, nonNegativeInteger, textValue } from "../../../../../lib/admin-validation";

export const runtime = "nodejs";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthorized())) return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  const db = getDb();
  if (!db) return NextResponse.json({ error: "DATABASE_URL을 설정하면 상품을 저장할 수 있습니다." }, { status: 503 });
  const body = await request.json().catch(() => ({}));
  try {
    const id = idValue((await params).id);
    const allowed = ["name", "status", "priceText", "priceMin", "thumbnailUrl", "supplierName", "description", "productType", "sortOrder"] as const;
    const values: Record<string, unknown> = { updatedAt: new Date() };
    for (const key of allowed) if (body[key] !== undefined) values[key] = key === "priceMin" || key === "sortOrder" ? nonNegativeInteger(body[key]) : textValue(body[key], "", key === "description" ? 5000 : 1000);
    const result = await db.update(products).set(values).where(eq(products.id, id)).returning();
    if (!result[0]) return NextResponse.json({ error: "상품을 찾을 수 없습니다." }, { status: 404 });
    return NextResponse.json({ product: result[0] });
  } catch (error) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthorized())) return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  const db = getDb();
  if (!db) return NextResponse.json({ error: "DATABASE_URL을 설정하면 상품을 보관 처리할 수 있습니다." }, { status: 503 });
  try {
    const id = idValue((await params).id);
    const result = await db.update(products).set({ status: "ARCHIVED", updatedAt: new Date() }).where(eq(products.id, id)).returning({ id: products.id });
    return NextResponse.json({ ok: Boolean(result[0]) });
  } catch (error) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 400 });
  }
}
