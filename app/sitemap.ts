import type { MetadataRoute } from "next";

const routes = ["/", "/project", "/guide", "/consult", "/partner", "/about", "/faq", "/contact", "/terms", "/privacy", "/refund", "/category/boundary", "/category/gate", "/category/storage", "/category/outdoor", "/category/garden", "/category/security", "/category/parking", "/category/water", "/category/maintenance", "/category/sale", "/category/select"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.rhinory.shop";
  return routes.map((path) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: path === "/" ? "daily" : "weekly", priority: path === "/" ? 1 : 0.7 }));
}
