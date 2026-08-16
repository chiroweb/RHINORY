import { integer, jsonb, pgTable, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  code: text("code").notNull(),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  active: text("active").notNull().default("true"),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull(),
  sku: text("sku").notNull(),
  name: text("name").notNull(),
  categorySlug: text("category_slug").notNull(),
  productType: text("product_type").notNull().default("BUY_INSTALL"),
  status: text("status").notNull().default("DRAFT"),
  description: text("description").notNull().default(""),
  priceMin: integer("price_min").notNull().default(0),
  priceText: text("price_text").notNull().default("가격 상담"),
  supplierName: text("supplier_name").notNull().default("공급사 미지정"),
  thumbnailUrl: text("thumbnail_url").notNull().default("/images/product-placeholder.svg"),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({ skuIdx: uniqueIndex("products_sku_idx").on(table.sku), slugIdx: uniqueIndex("products_slug_idx").on(table.slug) }));

export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  url: text("url").notNull(),
  alt: text("alt").notNull().default("상품 이미지"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const productOptions = pgTable("product_options", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  name: text("name").notNull(),
  value: text("value").notNull(),
  priceDelta: integer("price_delta").notNull().default(0),
  active: text("active").notNull().default("true"),
});

export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().unique(),
  quantity: integer("quantity").notNull().default(0),
  reserved: integer("reserved").notNull().default(0),
  reorderPoint: integer("reorder_point").notNull().default(5),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  kind: text("kind").notNull().default("CONSULT"),
  status: text("status").notNull().default("NEW"),
  name: text("name").notNull(),
  phone: text("phone").notNull().default(""),
  email: text("email").notNull().default(""),
  categorySlug: text("category_slug").notNull().default(""),
  message: text("message").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull().default("MANUFACTURER"),
  contactName: text("contact_name").notNull().default(""),
  phone: text("phone").notNull().default(""),
  email: text("email").notNull().default(""),
  status: text("status").notNull().default("ACTIVE"),
  note: text("note").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  recipientName: text("recipient_name").notNull().default(""),
  recipientPhone: text("recipient_phone").notNull().default(""),
  postalCode: text("postal_code").notNull().default(""),
  address: text("address").notNull().default(""),
  detailAddress: text("detail_address").notNull().default(""),
  deliveryNote: text("delivery_note").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  status: text("status").notNull().default("PENDING"),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email").notNull().default(""),
  shippingAddress: text("shipping_address").notNull().default(""),
  installationAddress: text("installation_address").notNull().default(""),
  totalAmount: integer("total_amount").notNull().default(0),
  paymentStatus: text("payment_status").notNull().default("UNPAID"),
  paymentProvider: text("payment_provider").notNull().default("UNSET"),
  claimStatus: text("claim_status").notNull().default("NONE"),
  claimReason: text("claim_reason").notNull().default(""),
  refundAmount: integer("refund_amount").notNull().default(0),
  deliveryStatus: text("delivery_status").notNull().default("NOT_STARTED"),
  trackingNumber: text("tracking_number").notNull().default(""),
  supplierId: integer("supplier_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id"),
  productName: text("product_name").notNull(),
  sku: text("sku").notNull().default(""),
  quantity: integer("quantity").notNull().default(1),
  unitPrice: integer("unit_price").notNull().default(0),
});

export const inventoryMovements = pgTable("inventory_movements", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  delta: integer("delta").notNull(),
  reason: text("reason").notNull().default("MANUAL"),
  reference: text("reference").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const adminActivityLogs = pgTable("admin_activity_logs", {
  id: serial("id").primaryKey(),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull().default(""),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
