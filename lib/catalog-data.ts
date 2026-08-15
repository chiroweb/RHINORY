import { and, eq, or } from "drizzle-orm";
import { getDb } from "../db";
import { productImages, products } from "../db/schema";
import { demoProducts } from "./demo-data";

export type CatalogProduct = {
  id: number;
  slug: string;
  sku: string;
  name: string;
  categorySlug: string;
  productType: string;
  priceMin: number;
  priceText: string;
  supplierName: string;
  thumbnailUrl: string;
  tags: string[];
  description: string;
  images: { id: number; url: string; alt: string; sortOrder: number }[];
};

const canUseDemo = () => process.env.NODE_ENV !== "production" || process.env.ALLOW_DEMO_DATA === "true";

function mapDemo(product: typeof demoProducts[number]): CatalogProduct {
  return { id: product.id, slug: product.sku.toLowerCase(), sku: product.sku, name: product.name, categorySlug: product.categorySlug, productType: product.productType, priceMin: product.priceMin, priceText: product.priceText, supplierName: product.supplierName, thumbnailUrl: product.thumbnailUrl, tags: product.tags, description: "RHINORY가 설치 환경과 유지관리까지 확인한 상품입니다.", images: [] };
}

export async function getCatalogProducts(categorySlug?: string): Promise<CatalogProduct[] | null> {
  const db = getDb();
  if (!db) return canUseDemo() ? demoProducts.filter((product) => !categorySlug || product.categorySlug === categorySlug).map(mapDemo) : null;
  try {
    const condition = categorySlug ? andPublishedCategory(categorySlug) : eq(products.status, "PUBLISHED");
    const rows = await db.select().from(products).where(condition);
    return rows.map((product) => ({ id: product.id, slug: product.slug, sku: product.sku, name: product.name, categorySlug: product.categorySlug, productType: product.productType, priceMin: product.priceMin, priceText: product.priceText, supplierName: product.supplierName, thumbnailUrl: product.thumbnailUrl, tags: product.tags ?? [], description: product.description, images: [] }));
  } catch (error) {
    console.error("catalog query failed", error);
    return canUseDemo() ? demoProducts.filter((product) => !categorySlug || product.categorySlug === categorySlug).map(mapDemo) : null;
  }
}

function andPublishedCategory(categorySlug: string) {
  return and(eq(products.categorySlug, categorySlug), eq(products.status, "PUBLISHED"));
}

export async function getCatalogProduct(slug: string): Promise<CatalogProduct | null> {
  const decoded = decodeURIComponent(slug);
  const db = getDb();
  if (!db) {
    const demo = demoProducts.find((product) => product.name === decoded || product.sku.toLowerCase() === decoded.toLowerCase());
    return demo && canUseDemo() ? mapDemo(demo) : null;
  }
  try {
    const rows = await db.select().from(products).where(or(eq(products.slug, decoded), eq(products.name, decoded), eq(products.sku, decoded))).limit(1);
    if (!rows[0] || rows[0].status !== "PUBLISHED") return null;
    const images = await db.select().from(productImages).where(eq(productImages.productId, rows[0].id));
    return { id: rows[0].id, slug: rows[0].slug, sku: rows[0].sku, name: rows[0].name, categorySlug: rows[0].categorySlug, productType: rows[0].productType, priceMin: rows[0].priceMin, priceText: rows[0].priceText, supplierName: rows[0].supplierName, thumbnailUrl: rows[0].thumbnailUrl, tags: rows[0].tags ?? [], description: rows[0].description, images };
  } catch (error) {
    console.error("product query failed", error);
    return null;
  }
}
