import { SubpageShell } from "../../components/SubpageShell";
import { CategoryBrowser } from "../../components/CategoryBrowser";
import { getCatalogProducts } from "../../../lib/catalog-data";

export default async function SaleCategoryPage() {
  const products = await getCatalogProducts();
  const saleProducts = products?.filter((product) => product.tags.some((tag) => tag.toUpperCase() === "SALE"));
  return <SubpageShell title="할인 상품" kicker="SHOP / SEASON SALE"><div className="category-page page-frame"><div className="category-intro"><p>이번 시즌, RHINORY가 조건을 확인한 상품을 특별한 기준으로 모았습니다.</p><span>SALE · PRODUCTS / INSTALLATION / GUIDE</span></div><CategoryBrowser slug="parking" code="SALE" products={saleProducts ?? null} /></div></SubpageShell>;
}
