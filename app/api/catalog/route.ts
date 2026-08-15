import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "../../../db";
import { inventory, products } from "../../../db/schema";
import { demoProducts } from "../../../lib/demo-data";

export const runtime = "nodejs";

function demoAllowed() {
  return process.env.NODE_ENV !== "production" || process.env.ALLOW_DEMO_DATA === "true";
}

export async function GET() {
  const db = getDb();
  if (!db) return demoAllowed() ? NextResponse.json({ mode: "demo", products: demoProducts }) : NextResponse.json({ error: "카탈로그 데이터베이스가 연결되지 않았습니다." }, { status: 503 });
  try {
    const rows = await db.select({ product: products, stock: inventory }).from(products).leftJoin(inventory, eq(products.id, inventory.productId)).where(eq(products.status, "PUBLISHED")).orderBy(asc(products.sortOrder));
    return NextResponse.json({ mode: "database", products: rows.map(({ product }) => ({ id: product.id, slug: product.slug, sku: product.sku, name: product.name, categorySlug: product.categorySlug, productType: product.productType, priceMin: product.priceMin, priceText: product.priceText, thumbnailUrl: product.thumbnailUrl, categoryCode: product.categorySlug.toUpperCase(), tags: product.tags ?? [], rating: "-", reviews: 0 })) });
  } catch (error) {
    console.error("catalog GET failed", error);
    return demoAllowed() ? NextResponse.json({ mode: "demo", warning: "DATABASE_UNAVAILABLE", products: demoProducts }) : NextResponse.json({ error: "카탈로그를 불러오지 못했습니다." }, { status: 503 });
  }
}
