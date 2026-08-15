import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "../../../../../../db";
import { productImages } from "../../../../../../db/schema";
import { isAdminAuthorized } from "../../../../../../lib/admin-auth";
import { errorMessage, idValue, textValue } from "../../../../../../lib/admin-validation";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthorized())) return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  const db = getDb();
  if (!db) return NextResponse.json({ mode: "demo", images: [] });
  try {
    const id = idValue((await params).id);
    return NextResponse.json({ mode: "database", images: await db.select().from(productImages).where(eq(productImages.productId, id)).orderBy(desc(productImages.sortOrder)) });
  } catch (error) { return NextResponse.json({ error: errorMessage(error) }, { status: 400 }); }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthorized())) return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  const db = getDb();
  if (!db) return NextResponse.json({ error: "DATABASE_URL을 설정하면 이미지를 저장할 수 있습니다." }, { status: 503 });
  const body = await request.json().catch(() => ({}));
  try {
    const id = idValue((await params).id);
    const url = textValue(body.url, "", 1000);
    if (!url) return NextResponse.json({ error: "이미지 URL은 필수입니다." }, { status: 400 });
    const result = await db.insert(productImages).values({ productId: id, url, alt: textValue(body.alt, "상품 이미지", 200), sortOrder: Number.isSafeInteger(Number(body.sortOrder)) ? Number(body.sortOrder) : 0 }).returning();
    return NextResponse.json({ image: result[0] }, { status: 201 });
  } catch (error) { return NextResponse.json({ error: errorMessage(error) }, { status: 400 }); }
}
