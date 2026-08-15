import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "../../../../../../../db";
import { productOptions } from "../../../../../../../db/schema";
import { isAdminAuthorized } from "../../../../../../../lib/admin-auth";
import { errorMessage, idValue, nonNegativeInteger, textValue } from "../../../../../../../lib/admin-validation";

export const runtime = "nodejs";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string; optionId: string }> }) {
  if (!(await isAdminAuthorized())) return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  const db = getDb();
  if (!db) return NextResponse.json({ error: "DATABASE_URL을 설정하면 옵션을 저장할 수 있습니다." }, { status: 503 });
  const body = await request.json().catch(() => ({}));
  try {
    const { id, optionId } = await params;
    const productId = idValue(id);
    const idNumber = idValue(optionId);
    const values: Record<string, unknown> = {};
    if (body.name !== undefined) values.name = textValue(body.name, "", 80);
    if (body.value !== undefined) values.value = textValue(body.value, "", 120);
    if (body.priceDelta !== undefined) values.priceDelta = nonNegativeInteger(body.priceDelta);
    if (body.active !== undefined) values.active = body.active ? "true" : "false";
    if (!Object.keys(values).length) return NextResponse.json({ error: "변경할 값이 없습니다." }, { status: 400 });
    const result = await db.update(productOptions).set(values).where(eq(productOptions.id, idNumber)).returning();
    if (!result[0] || result[0].productId !== productId) return NextResponse.json({ error: "옵션을 찾을 수 없습니다." }, { status: 404 });
    return NextResponse.json({ option: result[0] });
  } catch (error) { return NextResponse.json({ error: errorMessage(error) }, { status: 400 }); }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string; optionId: string }> }) {
  if (!(await isAdminAuthorized())) return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  const db = getDb();
  if (!db) return NextResponse.json({ error: "DATABASE_URL을 설정하면 옵션을 삭제할 수 있습니다." }, { status: 503 });
  try {
    const { id, optionId } = await params;
    const result = await db.delete(productOptions).where(eq(productOptions.id, idValue(optionId))).returning({ productId: productOptions.productId });
    if (!result[0] || result[0].productId !== idValue(id)) return NextResponse.json({ error: "옵션을 찾을 수 없습니다." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) { return NextResponse.json({ error: errorMessage(error) }, { status: 400 }); }
}
