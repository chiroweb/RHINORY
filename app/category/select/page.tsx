import { SubpageShell } from "../../components/SubpageShell";
import { CategoryBrowser } from "../../components/CategoryBrowser";
import { getCatalogProducts } from "../../../lib/catalog-data";

export default async function SelectCategoryPage() {
  const products = await getCatalogProducts();
  const selectedProducts = products?.filter((product) => product.tags.some((tag) => /SELECT|VERIFIED|BEST/i.test(tag)));
  return <SubpageShell title="RHINORY SELECT" kicker="RHINORY / CURATED"><div className="category-page page-frame"><div className="category-intro"><p>가격보다 설치와 관리, 공간에 오래 남는 기준으로 고른 상품입니다.</p><span>SELECT · CURATED PRODUCTS / INSTALLATION / GUIDE</span></div><CategoryBrowser slug="boundary" code="SELECT" products={selectedProducts ?? null} /></div></SubpageShell>;
}
