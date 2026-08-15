import { notFound } from "next/navigation";
import { SubpageShell } from "../../components/SubpageShell";
import { CategoryBrowser } from "../../components/CategoryBrowser";
import { getCatalogProducts } from "../../../lib/catalog-data";

const data: Record<string, { name: string; code: string; desc: string }> = {
  boundary: { name: "울타리 · 담장", code: "BOUNDARY", desc: "집의 경계를 만들고, 바깥과의 거리를 설계합니다." },
  gate: { name: "대문 · 출입", code: "GATE", desc: "매일의 출입을 더 안전하고 편안하게." },
  storage: { name: "창고 · 수납", code: "STORAGE", desc: "마당의 물건을 정돈하고, 공간을 되찾습니다." },
  outdoor: { name: "퍼골라 · 데크", code: "OUTDOOR", desc: "더 오래 머물고 싶은 마당을 만듭니다." },
  garden: { name: "정원 · 잔디", code: "GARDEN", desc: "돌보는 시간을 줄이고, 보는 즐거움을 늘립니다." },
  security: { name: "보안 · CCTV", code: "SECURITY", desc: "집의 바깥까지 안심할 수 있도록." },
  parking: { name: "주차 · 카포트", code: "PARKING", desc: "차량을 위한 공간도 집의 일부입니다." },
  water: { name: "수영장 · 물관리", code: "WATER", desc: "물과 함께 보내는 계절을 준비합니다." },
  maintenance: { name: "청소 · 제설 · 관리", code: "MAINTENANCE", desc: "집 밖의 관리까지 더 가볍게." },
};

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = data[slug];
  if (!category) notFound();
  const products = await getCatalogProducts(slug);
  return <SubpageShell title={category.name} kicker={`SHOP / ${category.code}`}>
    <div className="category-page page-frame">
      <div className="category-intro"><p>{category.desc}</p><span>{category.code} · PRODUCTS / INSTALLATION / GUIDE</span></div>
      <CategoryBrowser slug={slug} code={category.code} products={products} />
    </div>
  </SubpageShell>;
}
