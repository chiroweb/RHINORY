import { count, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "../../../../db";
import { inquiries, inventory, orders, products } from "../../../../db/schema";
import { demoInquiries, demoOrders, demoProducts } from "../../../../lib/demo-data";
import { isAdminAuthorized } from "../../../../lib/admin-auth";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthorized())) return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  const db = getDb();
  if (!db) return NextResponse.json({ mode: "demo", configured: false, counts: { products: demoProducts.length, published: demoProducts.filter((p) => p.status === "PUBLISHED").length, lowStock: demoProducts.filter((p) => p.quantity - p.reserved <= p.reorderPoint).length, newInquiries: demoInquiries.filter((i) => i.status === "NEW").length, orders: demoOrders.length, revenue: demoOrders.filter((order) => order.paymentStatus === "PAID").reduce((sum, order) => sum + order.totalAmount, 0) } });
  try {
    const [productCount, publishedCount, inquiryCount, orderRows] = await Promise.all([db.select({ value: count() }).from(products), db.select({ value: count() }).from(products).where(eq(products.status, "PUBLISHED")), db.select({ value: count() }).from(inquiries).where(eq(inquiries.status, "NEW")), db.select({ totalAmount: orders.totalAmount, paymentStatus: orders.paymentStatus }).from(orders)]);
    const stockRows = await db.select().from(inventory);
    return NextResponse.json({ mode: "database", configured: true, counts: { products: productCount[0]?.value ?? 0, published: publishedCount[0]?.value ?? 0, lowStock: stockRows.filter((row) => row.quantity - row.reserved <= row.reorderPoint).length, newInquiries: inquiryCount[0]?.value ?? 0, orders: orderRows.length, revenue: orderRows.filter((order) => order.paymentStatus === "PAID").reduce((sum, order) => sum + order.totalAmount, 0) } });
  } catch (error) {
    console.error("admin overview failed", error);
    return NextResponse.json({ error: "데이터베이스를 확인해주세요." }, { status: 503 });
  }
}
