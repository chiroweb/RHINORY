"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CartCount } from "./components/CartCount";
import { MobileMenu } from "./components/MobileMenu";
import { WishlistButton } from "./components/WishlistButton";

const categories = [
  ["BOUNDARY", "울타리 · 담장", "/category/boundary"],
  ["GATE", "대문 · 출입", "/category/gate"],
  ["STORAGE", "창고 · 수납", "/category/storage"],
  ["OUTDOOR", "퍼골라 · 데크", "/category/outdoor"],
  ["GARDEN", "정원 · 잔디", "/category/garden"],
  ["SECURITY", "보안 · CCTV", "/category/security"],
  ["PARKING", "주차 · 카포트", "/category/parking"],
  ["WATER", "수영장 · 물관리", "/category/water"],
  ["MAINTENANCE", "청소 · 제설 · 관리", "/category/maintenance"],
];

const popularProducts = [
  { name: "알루미늄 슬라이딩 대문", meta: "GATE · RF-GT-014", price: "1,290,000원~", rating: "4.9", reviews: "128", image: "/images/product-gate.png", position: "center center", badge: "BEST" },
  { name: "알루미늄 루버 펜스", meta: "BOUNDARY · RF-BD-021", price: "450,000원~", rating: "4.8", reviews: "96", image: "/images/product-fence.png", position: "center center" },
  { name: "합성목 데크 시스템", meta: "OUTDOOR · RF-OD-008", price: "280,000원~", rating: "4.7", reviews: "74", image: "/images/product-deck.png", position: "center center" },
  { name: "모듈형 야외창고", meta: "STORAGE · RF-ST-032", price: "2,180,000원~", rating: "5.0", reviews: "43", image: "/images/product-storage.png", position: "center center" },
];

const saleProducts = [
  { name: "조립식 가든하우스", price: "890,000원", before: "1,100,000원", discount: "19%", image: "/images/product-storage.png", position: "center center", tag: "SALE" },
  { name: "야외 데크 라운지 세트", price: "520,000원", before: "650,000원", discount: "20%", image: "/images/product-deck.png", position: "center center" },
  { name: "알루미늄 카포트 3×6m", price: "990,000원", before: "1,250,000원", discount: "21%", image: "/images/product-carport.png", position: "center center" },
];

const guides = [
  { eyebrow: "GATE / GUIDE 01", title: "전원주택 대문 선택 가이드", desc: "우리 집에 어울리는 대문을 고르는 네 가지 기준", image: "/images/product-gate.png", position: "center center" },
  { eyebrow: "OUTDOOR / CHECK 02", title: "데크 시공 전 체크리스트", desc: "오래 사용하는 외부공간은 바닥에서 시작됩니다", image: "/images/product-deck.png", position: "center center" },
  { eyebrow: "BOUNDARY / NOTE 03", title: "울타리 설치 가이드", desc: "높이와 소재, 프라이버시의 균형을 찾는 법", image: "/images/site-plan.png", position: "center center" },
];

type ProductCardItem = { name: string; image: string; position: string; price: string; meta?: string; badge?: string; tag?: string; before?: string; discount?: string; rating?: string; reviews?: string | number };
type CatalogApiProduct = { name: string; categoryCode?: string; categorySlug?: string; sku: string; priceText?: string; rating?: string | number; reviews?: string | number; thumbnailUrl?: string; tags?: string[] };

type IconName = "BOUNDARY" | "GATE" | "STORAGE" | "OUTDOOR" | "GARDEN" | "SECURITY" | "PARKING" | "WATER" | "MAINTENANCE";

function CategoryIcon({ type }: { type: string }) {
  const icon = type as IconName;
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.45, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (icon === "BOUNDARY") return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><path d="M4 5v14M8 5v14M12 5v14M16 5v14M20 5v14M3 7h18M3 17h18" /></svg>;
  if (icon === "GATE") return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><path d="M4 20V7l8-4 8 4v13M7 20V9h10v11M12 9v11M3 20h18" /></svg>;
  if (icon === "STORAGE") return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><path d="M4 9 12 4l8 5v11H4zM8 20v-7h8v7M12 13v7" /></svg>;
  if (icon === "OUTDOOR") return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><path d="M3 18h18M5 18v-7M19 18v-7M4 11h16M6 7h12M8 4h8M8 18v-4M16 18v-4" /></svg>;
  if (icon === "GARDEN") return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><path d="M12 20V9M12 12 7 8M12 15l5-5M7 8c3-.3 5 1 5 4-3 .3-5-1-5-4ZM17 10c-3-.3-5 1-5 4 3 .3 5-1 5-4ZM8 20h8" /></svg>;
  if (icon === "SECURITY") return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="2" /><path d="m17 7 3-2M18 12h3" /></svg>;
  if (icon === "PARKING") return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><path d="M4 18 6 8h12l2 10M3 18h18M8 12h8M8 15h8M8 8V5h8v3" /></svg>;
  if (icon === "WATER") return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><path d="M3 9c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2 2 2 2 2M3 15c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2 2 2 2 2" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><path d="m14 6 4-4 2 2-4 4M13 7l4 4M4 20l5-5M5 12l7 7M3 21l3-1 11-11-3-3L3 17z" /></svg>;
}

function SearchIcon() { return <svg className="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="m15.5 15.5 4.2 4.2" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>; }
function CartIcon() { return <svg className="cart-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 5h2l1.8 10.2h10.8L20.5 8H6.2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="9" cy="19" r="1.2" fill="currentColor" /><circle cx="17" cy="19" r="1.2" fill="currentColor" /></svg>; }
function MenuIcon() { return <svg className="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>; }
function StarIcon() { return <svg className="rating-star" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" fill="currentColor" /></svg>; }

function Arrow({ light = false }: { light?: boolean }) {
  return <span className={`arrow ${light ? "arrow-light" : ""}`} aria-hidden="true">→</span>;
}

function SectionHeader({ eyebrow, title, href = "/category/boundary" }: { eyebrow?: string; title: string; href?: string }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>
      <Link href={href} className="text-link">전체 보기 <Arrow /></Link>
    </div>
  );
}

function ProductCard({ product, sale = false }: { product: ProductCardItem; sale?: boolean }) {
  const item = product;
  return (
    <Link href={`/product/${encodeURIComponent(item.name)}`} className="product-card">
      <div className="product-image-wrap">
        {item.badge && <span className="product-badge">{item.badge}</span>}
        {item.tag && <span className="product-badge sale-badge">{item.tag}</span>}
        <img src={item.image} alt={item.name} style={{ objectPosition: item.position }} />
        <WishlistButton productKey={item.name} />
      </div>
      <div className="product-copy">
        {item.meta && <p className="product-meta">{item.meta}</p>}
        <h3>{item.name}</h3>
        {sale ? (
          <div className="sale-price"><span className="before-price">{item.before}</span><strong>{item.price}</strong><em>{item.discount}</em></div>
        ) : (
          <div className="product-price">{item.price}</div>
        )}
        {!sale && <div className="rating"><StarIcon /> {item.rating} <small>({item.reviews})</small></div>}
      </div>
    </Link>
  );
}

export default function Home() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState(0);
  const [slide, setSlide] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [catalogProducts, setCatalogProducts] = useState(process.env.NODE_ENV === "production" ? [] : popularProducts);

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();
    const category = /대문|게이트|출입|자동/.test(query) ? "gate" : /울타리|펜스|담장|가림/.test(query) ? "boundary" : /창고|수납|가든하우스/.test(query) ? "storage" : /데크|퍼골라|야외/.test(query) ? "outdoor" : /정원|잔디/.test(query) ? "garden" : /보안|CCTV|카메라/.test(query) ? "security" : /주차|카포트|차고/.test(query) ? "parking" : /수영장|물관리/.test(query) ? "water" : /청소|제설|관리/.test(query) ? "maintenance" : "boundary";
    router.push(`/category/${category}${query ? `?q=${encodeURIComponent(query)}` : ""}`);
    setSearchOpen(false);
  };

  useEffect(() => {
    const timer = window.setInterval(() => setSlide((current) => (current + 1) % 3), 7000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch("/api/catalog").then((response) => response.json()).then((data) => {
      if (!Array.isArray(data.products) || data.products.length === 0) return;
      setCatalogProducts(data.products.slice(0, 4).map((product: CatalogApiProduct) => ({ name: product.name, meta: `${product.categoryCode || product.categorySlug?.toUpperCase() || "RHINORY"} · ${product.sku}`, price: product.priceText || "가격 상담", rating: String(product.rating || "4.8"), reviews: product.reviews || 0, image: product.thumbnailUrl || "/images/product-placeholder.svg", position: "center center", badge: product.tags?.includes("BEST") ? "BEST" : undefined })));
    }).catch(() => undefined);
  }, []);

  return (
    <main>
      <div className="announcement"><span>RHINORY HOUSE · LAND · OUTDOOR</span><span>설치가 필요한 상품은 상담부터 도와드립니다 <Arrow light /></span></div>
      <header className="site-header">
        <Link href="/" className="brand" aria-label="RHINORY 홈"><img src="/images/rhinory-logo.png" alt="RHINORY" /></Link>
        <button className="header-search" onClick={() => setSearchOpen(true)} aria-label="상품 검색"><span>상품명, 카테고리, 브랜드를 검색해보세요.</span><SearchIcon /></button>
        <nav className="main-nav" aria-label="주요 메뉴">
          <Link href="/category/boundary">SHOP</Link>
          <Link href="/project">PROJECT</Link>
          <Link href="/guide">GUIDE</Link>
          <Link href="/consult">SERVICE</Link>
        </nav>
        <div className="header-actions">
          <button className="icon-action search-trigger" onClick={() => setSearchOpen(true)} aria-label="검색 열기"><SearchIcon /></button>
          <Link href="/mypage" className="header-text-action">마이 RHINORY</Link>
          <Link href="/cart" className="header-text-action cart-action"><CartIcon /><span className="header-cart-label">장바구니</span> <CartCount /></Link>
          <Link href="/partner" className="partner-button">입점문의 <Arrow light /></Link>
          <MobileMenu />
        </div>
      </header>

      <section className="hero-shell page-frame">
        <aside className="category-rail">
          <div className="rail-title"><span className="rail-menu"><MenuIcon /></span><span>전체 카테고리</span><span className="rail-code">09</span></div>
          <div className="rail-list">
            {categories.map(([code, label, href], index) => (
              <Link href={href} key={code} className={`rail-item ${activeCategory === index ? "active" : ""}`} onMouseEnter={() => setActiveCategory(index)}>
                <span className="rail-icon"><CategoryIcon type={code} /></span><span>{label}</span><span className="rail-arrow">›</span>
              </Link>
            ))}
          </div>
          <div className="rail-bottom"><span>MY RHINORY</span><Link href="/guide">구매 가이드 <Arrow /></Link></div>
        </aside>

        <section className="main-hero">
          <div className="hero-visual" style={{ backgroundImage: `url("/images/${slide === 1 ? "outdoor-collage.png" : slide === 2 ? "site-plan.png" : "hero-territory.png"}")` }}>
            <div className="hero-shade" />
            <div className="hero-copy">
              <p className="eyebrow light-eyebrow">RHINORY / SEASON 01</p>
              <h1>{slide === 1 ? <>마당의 시간을<br />새롭게 만드는 공간</> : slide === 2 ? <>집 밖의 모든 것을<br />하나의 기준으로</> : <>트렌드가 머무는 공간,<br />라이프스타일이<br />시작되는 곳</>}</h1>
              <p className="hero-description">단독주택과 야외공간에 필요한 모든 것.<br />제품부터 설치까지 RHINORY가 제안합니다.</p>
              <Link href="/category/boundary" className="dark-button">지금 둘러보기 <Arrow light /></Link>
            </div>
            <div className="hero-metadata"><span>HOUSE · LAND · OUTDOOR</span><span>01 / 03</span></div>
            <div className="slider-dots" aria-label="히어로 슬라이드 선택">
              {[0, 1, 2].map((dot) => <button key={dot} aria-label={`${dot + 1}번 슬라이드`} className={slide === dot ? "active" : ""} onClick={() => setSlide(dot)} />)}
            </div>
          </div>
        </section>

        <aside className="utility-stack">
          <Link href="/category/gate" className="utility-card today-card">
            <div className="utility-topline"><span>01 / TODAY&apos;S PICK</span><Arrow light /></div>
            <div className="utility-content"><p className="eyebrow light-eyebrow">오늘의 특가</p><h2>알루미늄 슬라이딩 대문</h2><div className="countdown"><span>23%</span><strong>08 : 45 : 12</strong></div><p className="utility-price">990,000원<span>~</span></p></div>
          </Link>
          <section className="utility-card categories-card" aria-labelledby="popular-category-title">
            <Link href="/category/boundary" className="utility-topline"><span>02 / NOW IN RHINORY</span><Arrow /></Link>
            <div className="utility-content"><p className="eyebrow">인기 카테고리</p><h2 id="popular-category-title">지금 가장 많이 찾는 것</h2></div>
            <div className="mini-category-row">{[categories[0], categories[1], categories[2], categories[4]].map(([code, label, href]) => <Link href={href} key={code} aria-label={`${label} 상품 보기`}><span className="mini-icon"><CategoryIcon type={code} /></span><small>{label.split(" · ")[0]}</small></Link>)}</div>
          </section>
          <Link href="/consult" className="utility-card consult-card">
            <div className="utility-topline"><span>03 / RHINORY SERVICE</span><Arrow /></div><div className="utility-content"><p className="eyebrow">무료 설치 상담</p><h2>우리 집에 맞는 방법을<br />함께 찾아보세요.</h2><span className="outline-button">상담 신청하기 <Arrow /></span></div><span className="consult-mark">SITE<br />PLAN</span>
          </Link>
        </aside>
      </section>

      <section className="shop-section page-frame">
        <SectionHeader eyebrow="SHOP / MOST WANTED" title="많이 찾는 상품" />
        <div className="product-grid four-col">{catalogProducts.map((product) => <ProductCard product={product} key={product.name} />)}</div>
      </section>

      <section className="split-shop page-frame">
        <div className="sale-panel"><SectionHeader eyebrow="SHOP / SEASON SALE" title="할인 상품" href="/category/sale" /><div className="product-grid three-col">{saleProducts.map((product) => <ProductCard product={product} sale key={product.name} />)}</div></div>
        <div className="select-panel"><SectionHeader eyebrow="RHINORY / SELECT" title="이번 달의 선택" href="/category/select" /><Link href={`/product/${encodeURIComponent("알루미늄 루버 펜스")}`} className="select-feature"><img src="/images/product-fence.png" alt="알루미늄 루버 펜스가 설치된 주택" /><div className="select-overlay"><span>RHINORY SELECT / 01</span><h3>공간의 경계를<br />가볍고 단단하게.</h3><p>알루미늄 루버 펜스 · 설치 사례 128</p><Arrow light /></div></Link></div>
      </section>

      <section className="territory-section page-frame">
        <div className="territory-copy"><p className="eyebrow">PROJECT / BY THE LAND</p><h2>무엇을 살지보다,<br /><em>무엇을 해결할지</em>부터.</h2><p>땅이 있는 집에서 시작되는 고민을 공간별로 정리했습니다. 필요한 방법을 찾고, 맞는 상품과 설치까지 한 번에 확인해보세요.</p><Link href="/project" className="dark-button light-button">프로젝트 둘러보기 <Arrow light /></Link></div>
        <div className="territory-map"><img src="/images/site-plan.png" alt="주택과 마당, 정원, 주차 공간이 표시된 사이트 플랜" /><div className="map-label map-house">HOUSE</div><div className="map-label map-garden">GARDEN</div><div className="map-label map-gate">GATE</div><div className="map-label map-storage">STORAGE</div><span className="map-cross cross-one">＋</span><span className="map-cross cross-two">＋</span></div>
      </section>

      <section className="install-section page-frame"><div className="install-header"><div><p className="eyebrow">SERVICE / INSTALLATION</p><h2>설치가 필요한 상품</h2></div><p>제품을 고르는 일부터 현장에 맞는 설치까지,<br />RHINORY가 다음 단계를 안내합니다.</p></div><div className="install-grid"><Link href="/category/gate" className="install-card"><img src="/images/product-gate.png" alt="자동 대문 설치 사례" /><div><span>GATE / INSTALL</span><h3>자동대문</h3><p>차량 출입과 집의 첫인상을 함께 설계합니다.</p><Arrow /></div></Link><Link href="/category/outdoor" className="install-card"><img src="/images/product-pergola.png" alt="퍼골라 설치 사례" /><div><span>OUTDOOR / INSTALL</span><h3>퍼골라 · 데크</h3><p>마당에 오래 머물 수 있는 그늘과 바닥.</p><Arrow /></div></Link><Link href="/consult" className="install-card consult-install"><div><span>RHINORY SERVICE</span><h3>내 집에 맞는<br />설치를 상담하세요.</h3><p>지역과 현장 조건을 먼저 확인합니다.</p><span className="outline-button">상담 시작하기 <Arrow /></span></div></Link></div></section>

      <section className="project-section page-frame"><SectionHeader eyebrow="PROJECT / REAL HOMES" title="실제 설치 사례" href="/project" /><div className="project-grid"><Link href="/project/yongin-fence" className="case-feature"><img src="/images/product-fence.png" alt="용인 단독주택 울타리 설치 사례" /><div className="case-caption"><span>CASE 014 · GYEONGGI / YONGIN</span><h3>알루미늄 울타리와 자동대문으로<br />완성한 집의 경계</h3><p>대지 120평 · 총비용 5,800,000원 · 시공 2일</p></div></Link><div className="case-list"><Link href="/project/garden-house"><span>CASE 013</span><strong>마당 한편에 놓은 작은 가든하우스</strong><small>경기 남양주 · 2,180,000원~ <Arrow /></small></Link><Link href="/project/pergola"><span>CASE 012</span><strong>저녁이 길어지는 알루미늄 퍼골라</strong><small>충북 청주 · 4,600,000원~ <Arrow /></small></Link><Link href="/project/carport"><span>CASE 011</span><strong>비와 눈으로부터 차량을 지키는 법</strong><small>강원 춘천 · 3,900,000원~ <Arrow /></small></Link></div></div></section>

      <section className="guide-section page-frame"><SectionHeader eyebrow="KNOWLEDGE / RHINORY EDITORIAL" title="집 밖을 더 잘 쓰는 법" href="/guide" /><div className="guide-grid">{guides.map((guide) => <Link href="/guide" className="guide-card" key={guide.title}><div className="guide-image"><img src={guide.image} alt="" style={{ objectPosition: guide.position }} /><span>{guide.eyebrow}</span></div><div className="guide-copy"><h3>{guide.title}</h3><p>{guide.desc}</p><Arrow /></div></Link>)}</div></section>

      <section className="partner-cta page-frame"><div><p className="eyebrow">RHINORY PARTNER</p><h2>좋은 제품을 만들고 계신가요?</h2><p>판매와 고객 유입은 RHINORY가 돕겠습니다.<br />제조사 · 수입사 · 유통사 · 설치업체를 기다립니다.</p></div><Link href="/partner" className="dark-button">입점 안내 보기 <Arrow light /></Link></section>

      <footer className="site-footer"><div className="footer-top page-frame"><div className="footer-brand"><img src="/images/rhinory-logo.png" alt="RHINORY" /><p>HOUSE · LAND · OUTDOOR</p></div><div className="footer-links"><div><strong>SHOP</strong><Link href="/category/boundary">울타리 · 담장</Link><Link href="/category/gate">대문 · 출입</Link><Link href="/category/storage">창고 · 수납</Link><Link href="/category/outdoor">퍼골라 · 데크</Link></div><div><strong>HELP</strong><Link href="/guide">구매 가이드</Link><Link href="/consult">설치 상담</Link><Link href="/faq">배송 · A/S</Link><Link href="/contact">고객센터</Link></div><div><strong>ABOUT</strong><Link href="/about">RHINORY 소개</Link><Link href="/partner">입점문의</Link><Link href="/project">설치 사례</Link><Link href="/guide">매거진</Link></div></div></div><div className="footer-bottom page-frame"><span>© 2026 RHINORY. All rights reserved.</span><span className="footer-legal"><Link href="/about">사업자정보</Link><Link href="/terms">이용약관</Link><Link href="/privacy">개인정보처리방침</Link></span><span>HOUSE · LAND · OUTDOOR</span></div></footer>

      {searchOpen && <div className="search-overlay" role="dialog" aria-modal="true" aria-label="상품 검색"><button className="search-close" onClick={() => setSearchOpen(false)} aria-label="검색 닫기">×</button><div className="search-box"><p className="eyebrow">RHINORY SEARCH</p><h2>무엇을 찾고 계세요?</h2><form className="large-search" onSubmit={submitSearch}><input autoFocus value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="울타리, 자동대문, 야외창고..." aria-label="검색어" /><button type="submit" aria-label="검색 실행"><SearchIcon /></button></form><div className="search-suggestions"><span>요즘 많이 찾는 검색어</span><button type="button" onClick={() => { setSearchQuery("알루미늄 울타리"); }}>알루미늄 울타리</button><button type="button" onClick={() => { setSearchQuery("자동대문 설치"); }}>자동대문 설치</button><button type="button" onClick={() => { setSearchQuery("야외창고"); }}>야외창고</button><button type="button" onClick={() => { setSearchQuery("퍼골라"); }}>퍼골라</button></div></div></div>}
    </main>
  );
}
