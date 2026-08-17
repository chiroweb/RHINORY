import type { MetadataRoute } from "next";
import { getCatalogProducts } from "../lib/catalog-data";

const routes = ["/", "/project", "/guide", "/consult", "/partner", "/about", "/faq", "/contact", "/terms", "/privacy", "/refund", "/category/boundary", "/category/gate", "/category/storage", "/category/outdoor", "/category/garden", "/category/security", "/category/parking", "/category/water", "/category/maintenance", "/category/sale", "/category/select"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.rhinory.shop";
  const staticRoutes = routes.map((path) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: path === "/" ? "daily" as const : "weekly" as const, priority: path === "/" ? 1 : 0.7 }));
  const products = await getCatalogProducts();
  const productRoutes = (products || []).map((product) => ({ url: `${base}/product/${encodeURIComponent(product.slug)}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 }));
  return [...staticRoutes, ...productRoutes];
}
