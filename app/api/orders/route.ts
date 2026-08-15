import { eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "../../../db";
import { inventory, orderItems, orders, products } from "../../../db/schema";
import { errorMessage, nonNegativeInteger, requiredText, textValue } from "../../../lib/admin-validation";

export const runtime = "nodejs";

type OrderItemInput = { productId?: number; slug?: string; quantity?: number };

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const items = Array.isArray(body.items) ? body.items as OrderItemInput[] : [];
  if (!items.length || items.length > 50) return NextResponse.json({ error: "주문 상품을 확인해주세요." }, { status: 400 });
  try {
    const customerName = requiredText(body.customerName, "성함", 80);
    const customerPhone = requiredText(body.customerPhone, "연락처", 40);
    if (body.privacyConsent !== true) throw new Error("개인정보 수집·이용 동의가 필요합니다.");
    const db = getDb();
    if (!db) return NextResponse.json({ error: "견적 접수 시스템이 아직 연결되지 않았습니다. 잠시 후 다시 시도해주세요." }, { status: 503 });

    const ids = items.map((item) => Number(item.productId)).filter((id) => Number.isSafeInteger(id) && id > 0);
    const slugs = items.map((item) => textValue(item.slug, "", 120)).filter(Boolean);
    if (!ids.length && !slugs.length) throw new Error("주문 상품 식별자를 확인해주세요.");
    const rows = await db.select({ product: products, stock: inventory }).from(products).leftJoin(inventory, eq(products.id, inventory.productId)).where(ids.length ? inArray(products.id, ids) : inArray(products.slug, slugs));
    const byId = new Map(rows.map((row) => [row.product.id, row]));
    const bySlug = new Map(rows.map((row) => [row.product.slug, row]));
    const normalized = items.map((item) => {
      const row = (item.productId ? byId.get(Number(item.productId)) : undefined) || (item.slug ? bySlug.get(item.slug) : undefined);
      if (!row || row.product.status !== "PUBLISHED") throw new Error("판매 중이 아닌 상품이 포함되어 있습니다.");
      const quantity = nonNegativeInteger(item.quantity, 1);
      if (quantity < 1 || quantity > 99) throw new Error("상품 수량은 1~99개로 입력해주세요.");
      const available = (row.stock?.quantity ?? 0) - (row.stock?.reserved ?? 0);
      if (row.product.productType === "BUY" && available < quantity) throw new Error(`${row.product.name}의 재고를 확인해주세요.`);
      return { product: row.product, quantity, unitPrice: row.product.priceMin };
    });
    const totalAmount = normalized.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const orderNumber = `RH-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const created = await db.insert(orders).values({ orderNumber, status: "QUOTE_REQUEST", customerName, customerPhone, customerEmail: textValue(body.customerEmail, "", 160), shippingAddress: textValue(body.shippingAddress, "", 300), installationAddress: textValue(body.installationAddress, "", 300), totalAmount, paymentStatus: "UNPAID", paymentProvider: "QUOTE", deliveryStatus: "NOT_STARTED" }).returning({ id: orders.id, orderNumber: orders.orderNumber });
    await db.insert(orderItems).values(normalized.map((item) => ({ orderId: created[0].id, productId: item.product.id, productName: item.product.name, sku: item.product.sku, quantity: item.quantity, unitPrice: item.unitPrice })));
    return NextResponse.json({ ok: true, order: created[0], message: "견적 요청이 접수되었습니다." }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 400 });
  }
}
