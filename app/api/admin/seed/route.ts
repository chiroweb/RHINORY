import { NextResponse } from "next/server";
import { getDb } from "../../../../db";
import { categories, inventory, products, suppliers } from "../../../../db/schema";
import { categorySeed, demoProducts, demoSuppliers } from "../../../../lib/demo-data";
import { isAdminAuthorized } from "../../../../lib/admin-auth";

export const runtime = "nodejs";

export async function POST() {
  if (!(await isAdminAuthorized())) return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  const db = getDb();
  if (!db) return NextResponse.json({ error: "DATABASE_URL을 설정하면 초기 데이터를 넣을 수 있습니다." }, { status: 503 });
  await db.insert(categories).values(categorySeed.map(([slug, code, name], index) => ({ slug, code, name, sortOrder: index }))).onConflictDoNothing({ target: categories.slug });
  await db.insert(suppliers).values(demoSuppliers.map((supplier) => ({ name: supplier.name, type: supplier.type, contactName: supplier.contactName, phone: supplier.phone, email: supplier.email, status: supplier.status }))).onConflictDoNothing();
  for (const product of demoProducts) {
    const inserted = await db.insert(products).values({ slug: product.sku.toLowerCase(), sku: product.sku, name: product.name, categorySlug: product.categorySlug, productType: product.productType, status: product.status, priceMin: product.priceMin, priceText: product.priceText, supplierName: product.supplierName, thumbnailUrl: product.thumbnailUrl, tags: product.tags, sortOrder: product.id }).onConflictDoNothing({ target: products.sku }).returning({ id: products.id });
    if (inserted[0]) await db.insert(inventory).values({ productId: inserted[0].id, quantity: product.quantity, reserved: product.reserved, reorderPoint: product.reorderPoint }).onConflictDoNothing({ target: inventory.productId });
  }
  return NextResponse.json({ ok: true, message: "기본 카탈로그와 재고 데이터가 준비되었습니다." });
}
