import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "../../../../db";
import { inventory, products } from "../../../../db/schema";
import { demoProducts } from "../../../../lib/demo-data";
import { isAdminAuthorized } from "../../../../lib/admin-auth";
import { errorMessage, nonNegativeInteger, requiredText, textValue } from "../../../../lib/admin-validation";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthorized())) return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  const db = getDb();
  if (!db) return NextResponse.json({ mode: "demo", products: demoProducts });
  const rows = await db.select({ product: products, stock: inventory }).from(products).leftJoin(inventory, eq(products.id, inventory.productId)).orderBy(asc(products.sortOrder));
  return NextResponse.json({ mode: "database", products: rows.map(({ product, stock }) => ({ ...product, quantity: stock?.quantity ?? 0, reserved: stock?.reserved ?? 0, reorderPoint: stock?.reorderPoint ?? 5, categoryCode: product.categorySlug.toUpperCase(), tags: product.tags ?? [] })) });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthorized())) return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  const db = getDb();
  if (!db) return NextResponse.json({ error: "DATABASE_URL을 설정하면 상품을 저장할 수 있습니다." }, { status: 503 });
  const body = await request.json().catch(() => ({}));
  try {
    const name = requiredText(body.name, "상품명");
    const sku = requiredText(body.sku, "SKU", 80).toUpperCase();
    const categorySlug = requiredText(body.categorySlug, "카테고리", 80);
    const slug = textValue(body.slug, sku.toLowerCase(), 120).toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-").replace(/^-|-$/g, "") || sku.toLowerCase();
    const inserted = await db.insert(products).values({ name, slug, sku, categorySlug, productType: textValue(body.productType, "BUY_INSTALL", 40), status: textValue(body.status, "DRAFT", 30), description: textValue(body.description, "", 5000), priceMin: nonNegativeInteger(body.priceMin), priceText: textValue(body.priceText, "가격 상담", 120), supplierName: textValue(body.supplierName, "공급사 미지정"), thumbnailUrl: textValue(body.thumbnailUrl, "/images/product-placeholder.svg", 1000), tags: Array.isArray(body.tags) ? body.tags.filter((tag: unknown): tag is string => typeof tag === "string").slice(0, 30) : [], sortOrder: nonNegativeInteger(body.sortOrder) }).returning();
    await db.insert(inventory).values({ productId: inserted[0].id, quantity: nonNegativeInteger(body.quantity), reserved: 0, reorderPoint: nonNegativeInteger(body.reorderPoint, 5) });
    return NextResponse.json({ product: inserted[0] }, { status: 201 });
  } catch (error) {
    const message = errorMessage(error);
    return NextResponse.json({ error: message.includes("duplicate") ? "SKU 또는 슬러그가 이미 사용 중입니다." : message }, { status: 400 });
  }
}
