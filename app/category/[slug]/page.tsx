import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { SubpageShell } from "../../components/SubpageShell";
import { CategoryBrowser } from "../../components/CategoryBrowser";
import { getCatalogProducts } from "../../../lib/catalog-data";

const data: Record<string, { name: string; code: string; desc: string; seo: string }> = {
  boundary: { name: "울타리 · 담장", code: "BOUNDARY", desc: "집의 경계를 만들고, 바깥과의 거리를 설계합니다.", seo: "전원주택 울타리, 알루미늄 펜스, 담장과 가림막 상품 및 설치 정보" },
  gate: { name: "대문 · 출입", code: "GATE", desc: "매일의 출입을 더 안전하고 편안하게.", seo: "단독주택 자동대문, 슬라이딩 대문, 현관과 출입설비 상품 및 설치 정보" },
  storage: { name: "창고 · 수납", code: "STORAGE", desc: "마당의 물건을 정돈하고, 공간을 되찾습니다.", seo: "전원주택 야외창고, 가든하우스, 마당 수납과 설치 정보" },
  outdoor: { name: "퍼골라 · 데크", code: "OUTDOOR", desc: "더 오래 머물고 싶은 마당을 만듭니다.", seo: "전원주택 퍼골라, 데크, 야외가구와 마당 인테리어 상품 및 설치 정보" },
  garden: { name: "정원 · 잔디", code: "GARDEN", desc: "돌보는 시간을 줄이고, 보는 즐거움을 늘립니다.", seo: "전원주택 정원, 잔디관리, 관수와 조경 관리용품 정보" },
  security: { name: "보안 · CCTV", code: "SECURITY", desc: "집의 바깥까지 안심할 수 있도록.", seo: "전원주택 CCTV, 외부 보안, 도어락과 센서 상품 및 설치 정보" },
  parking: { name: "주차 · 카포트", code: "PARKING", desc: "차량을 위한 공간도 집의 일부입니다.", seo: "전원주택 카포트, 차고, 주차공간과 차량 보호 설비 정보" },
  water: { name: "수영장 · 물관리", code: "WATER", desc: "물과 함께 보내는 계절을 준비합니다.", seo: "전원주택 수영장, 자쿠지, 관수와 물관리 설비 정보" },
  maintenance: { name: "청소 · 제설 · 관리", code: "MAINTENANCE", desc: "집 밖의 관리까지 더 가볍게.", seo: "전원주택 청소, 제설, 낙엽과 외부공간 관리용품 정보" },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = data[slug];
  if (!category) return {};
  return {
    title: `${category.name} | 단독주택 외부공간 상품`,
    description: `${category.seo}. ${category.desc} RHINORY에서 상품, 설치 조건, 가격 정보를 확인해보세요.`,
    keywords: [category.name, category.seo, "전원주택", "단독주택", "설치 상담"],
    alternates: { canonical: `/category/${slug}` },
    openGraph: { title: `${category.name} | RHINORY`, description: category.desc, url: `/category/${slug}` },
  };
}

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ q?: string }> }) {
  const { slug } = await params;
  const { q = "" } = await searchParams;
  const category = data[slug];
  if (!category) notFound();
  const products = await getCatalogProducts(slug);
  return <SubpageShell title={category.name} kicker={`SHOP / ${category.code}`}>
    <div className="category-page page-frame">
      <div className="category-intro"><p>{category.desc}</p><span>{category.code} · PRODUCTS / INSTALLATION / GUIDE</span></div>
      <nav className="category-switcher" aria-label="상품 카테고리">
        {Object.entries(data).map(([categorySlug, item]) => (
          <Link
            key={categorySlug}
            href={`/category/${categorySlug}`}
            className={categorySlug === slug ? "active" : ""}
            aria-current={categorySlug === slug ? "page" : undefined}
          >
            <span>{item.code}</span>
            {item.name}
          </Link>
        ))}
      </nav>
      <CategoryBrowser slug={slug} code={category.code} products={products} initialQuery={q} />
    </div>
  </SubpageShell>;
}
