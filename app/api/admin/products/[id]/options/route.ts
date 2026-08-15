import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "../../../../../../db";
import { productOptions } from "../../../../../../db/schema";
import { isAdminAuthorized } from "../../../../../../lib/admin-auth";
import { errorMessage, idValue, nonNegativeInteger, requiredText } from "../../../../../../lib/admin-validation";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthorized())) return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  const db = getDb();
  if (!db) return NextResponse.json({ mode: "demo", options: [] });
  try {
    const productId = idValue((await params).id);
    return NextResponse.json({ mode: "database", options: await db.select().from(productOptions).where(eq(productOptions.productId, productId)).orderBy(asc(productOptions.id)) });
  } catch (error) { return NextResponse.json({ error: errorMessage(error) }, { status: 400 }); }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthorized())) return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  const db = getDb();
  if (!db) return NextResponse.json({ error: "DATABASE_URL을 설정하면 옵션을 저장할 수 있습니다." }, { status: 503 });
  const body = await request.json().catch(() => ({}));
  try {
    const productId = idValue((await params).id);
    const result = await db.insert(productOptions).values({ productId, name: requiredText(body.name, "옵션명", 80), value: requiredText(body.value, "옵션 값", 120), priceDelta: nonNegativeInteger(body.priceDelta), active: body.active === false ? "false" : "true" }).returning();
    return NextResponse.json({ option: result[0] }, { status: 201 });
  } catch (error) { return NextResponse.json({ error: errorMessage(error) }, { status: 400 }); }
}
