"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CatalogProduct } from "../../lib/catalog-data";

type Props = { slug: string; code: string; products: CatalogProduct[] | null };

function imageFor(category: string, index: number) {
  if (category === "gate") return "/images/product-gate.png";
  if (category === "boundary") return "/images/product-fence.png";
  if (category === "outdoor") return index % 2 ? "/images/product-pergola.png" : "/images/product-deck.png";
  if (category === "storage") return "/images/product-storage.png";
  if (category === "parking") return "/images/product-carport.png";
  return "/images/product-placeholder.svg";
}

export function CategoryBrowser({ slug, code, products }: Props) {
  const [types, setTypes] = useState<string[]>([]);
  const [priceBand, setPriceBand] = useState("ALL");
  const [sort, setSort] = useState("RECOMMENDED");
  const [query, setQuery] = useState("");
  const toggleType = (type: string) => setTypes((current) => current.includes(type) ? current.filter((item) => item !== type) : [...current, type]);
  const filtered = useMemo(() => {
    if (!products) return [];
    const result = products.filter((product) => {
      const matchesQuery = !query.trim() || `${product.name} ${product.sku} ${product.description}`.toLowerCase().includes(query.trim().toLowerCase());
      const matchesType = !types.length || types.includes(product.productType);
      const matchesPrice = priceBand === "ALL" || (priceBand === "UNDER_1M" && product.priceMin < 1000000) || (priceBand === "1_TO_5M" && product.priceMin >= 1000000 && product.priceMin <= 5000000) || (priceBand === "OVER_5M" && product.priceMin > 5000000);
      return matchesQuery && matchesType && matchesPrice;
    });
    return result.sort((a, b) => sort === "PRICE_ASC" ? a.priceMin - b.priceMin : sort === "PRICE_DESC" ? b.priceMin - a.priceMin : sort === "NAME" ? a.name.localeCompare(b.name, "ko") : a.id - b.id);
  }, [products, priceBand, query, sort, types]);
  return <div className="category-layout"><aside className="filter-panel"><strong>상품 찾기</strong><label className="filter-search"><span className="sr-only">상품 검색</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="상품명 · SKU 검색" /></label><div><span>상품 유형</span>{[["BUY", "바로 구매"], ["BUY_INSTALL", "구매 + 설치"], ["PROJECT", "견적 상담"]].map(([value, label]) => <label key={value}><input type="checkbox" checked={types.includes(value)} onChange={() => toggleType(value)} /> {label}</label>)}</div><div><span>가격대</span>{[["ALL", "전체"], ["UNDER_1M", "100만원 이하"], ["1_TO_5M", "100–500만원"], ["OVER_5M", "500만원 초과"]].map(([value, label]) => <label key={value}><input type="radio" name="priceBand" checked={priceBand === value} onChange={() => setPriceBand(value)} /> {label}</label>)}</div></aside><section className="category-results"><div className="result-toolbar"><span><b>{filtered.length}</b>개의 상품 {products === null && "· 준비 중"}</span><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="정렬"><option value="RECOMMENDED">추천순</option><option value="PRICE_ASC">낮은 가격순</option><option value="PRICE_DESC">높은 가격순</option><option value="NAME">이름순</option></select></div>{products === null ? <div className="empty-page"><h2>상품 정보를 준비 중입니다.</h2><p>관리자에서 DB와 상품 카탈로그를 연결하면 공개됩니다.</p></div> : filtered.length === 0 ? <div className="empty-page"><h2>조건에 맞는 상품이 없습니다.</h2><p>필터를 지우거나 다른 검색어를 입력해보세요.</p></div> : <div className="category-products">{filtered.map((product, index) => <Link href={`/product/${encodeURIComponent(product.slug || product.name)}`} className="category-product" key={product.id}><div className="category-product-image"><img src={product.thumbnailUrl || imageFor(slug, index)} alt={product.name} /><span>{product.tags[0] || (index === 0 ? "RHINORY VERIFIED" : "INSTALL")}</span></div><p className="product-meta">{code} · {product.sku}</p><h2>{product.name}</h2><p className="category-price">{product.priceText}</p><p className="rating"><span className="rating-star-mark" aria-hidden="true" /> {product.productType === "PROJECT" ? "현장 견적" : product.productType === "BUY" ? "바로 구매" : "설치 상담"}</p></Link>)}</div>}</section></div>;
}
