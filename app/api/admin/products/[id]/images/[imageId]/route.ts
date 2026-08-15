import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "../../../../../../../db";
import { productImages } from "../../../../../../../db/schema";
import { isAdminAuthorized } from "../../../../../../../lib/admin-auth";
import { errorMessage, idValue } from "../../../../../../../lib/admin-validation";

export const runtime = "nodejs";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string; imageId: string }> }) {
  if (!(await isAdminAuthorized())) return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  const db = getDb();
  if (!db) return NextResponse.json({ error: "DATABASE_URL을 설정하면 이미지를 삭제할 수 있습니다." }, { status: 503 });
  try {
    const { id, imageId } = await params;
    const productId = idValue(id);
    const result = await db.delete(productImages).where(eq(productImages.id, idValue(imageId))).returning({ productId: productImages.productId });
    if (!result[0] || result[0].productId !== productId) return NextResponse.json({ error: "이미지를 찾을 수 없습니다." }, { status: 404 });
    return NextResponse.json({ ok: true, productId });
  } catch (error) { return NextResponse.json({ error: errorMessage(error) }, { status: 400 }); }
}
