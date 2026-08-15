"use client";
/* eslint-disable @next/next/no-html-link-for-pages */

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Product = { id: number; name: string; sku: string; categorySlug: string; productType: string; status: string; priceText: string; supplierName: string; thumbnailUrl: string; quantity: number; reserved: number; reorderPoint: number; tags?: string[] };
type Inquiry = { id: number; kind: string; status: string; name: string; phone: string; categorySlug: string; message: string; createdAt: string };
type NewProduct = { name: string; sku: string; categorySlug: string; productType: string; priceText: string; supplierName: string; thumbnailUrl: string; quantity: number; reorderPoint: number };
type Order = { id: number; orderNumber: string; status: string; customerName: string; customerPhone: string; customerEmail: string; totalAmount: number; paymentStatus: string; claimStatus: string; claimReason: string; refundAmount: number; deliveryStatus: string; trackingNumber: string; createdAt: string };
type Supplier = { id: number; name: string; type: string; contactName: string; phone: string; email: string; status: string; productCount?: number };
type Category = { id: number; slug: string; code: string; name: string; sortOrder: number; active: string };
type ProductImage = { id: number; url: string; alt: string; sortOrder: number };
type ProductOption = { id: number; name: string; value: string; priceDelta: number; active: string };

const placeholder = "/images/product-placeholder.svg";

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [mode, setMode] = useState<"database" | "demo" | "unknown">("unknown");
  const [tab, setTab] = useState<"overview" | "products" | "inventory" | "orders" | "inquiries" | "suppliers" | "categories">("overview");
  const [products, setProducts] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [counts, setCounts] = useState({ products: 0, published: 0, lowStock: 0, newInquiries: 0, orders: 0, revenue: 0 });
  const [notice, setNotice] = useState("");
  const [showProductForm, setShowProductForm] = useState(false);

  const load = async () => {
    const [overviewResponse, productResponse, inquiryResponse, orderResponse, supplierResponse, categoryResponse] = await Promise.all([fetch("/api/admin/overview"), fetch("/api/admin/products"), fetch("/api/admin/inquiries"), fetch("/api/admin/orders"), fetch("/api/admin/suppliers"), fetch("/api/admin/categories")]);
    if ([overviewResponse.status, productResponse.status, inquiryResponse.status, orderResponse.status, supplierResponse.status, categoryResponse.status].includes(401)) { setAuthenticated(false); return; }
    const overview = await overviewResponse.json();
    const productData = await productResponse.json();
    const inquiryData = await inquiryResponse.json();
    const orderData = await orderResponse.json();
    const supplierData = await supplierResponse.json();
    const categoryData = await categoryResponse.json();
    setMode(overview.mode || productData.mode || "unknown");
    setCounts(overview.counts || counts);
    setProducts(productData.products || []);
    setInquiries(inquiryData.inquiries || []);
    setOrders(orderData.orders || []);
    setSuppliers(supplierData.suppliers || []);
    setCategories(categoryData.categories || []);
    setAuthenticated(true);
  };

  // The first load synchronizes the admin session with the server.
  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { load().catch(() => setAuthenticated(false)); }, []);

  const login = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key }) });
    if (!response.ok) { const body = await response.json().catch(() => ({})); setNotice(body.error || "관리자 인증에 실패했습니다."); return; }
    setKey(""); setNotice("관리자 세션이 시작되었습니다."); await load();
  };

  const updateProduct = async (id: number, values: Record<string, unknown>) => {
    const response = await fetch(`/api/admin/products/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    if (!response.ok) { const body = await response.json().catch(() => ({})); setNotice(body.error || "상품 저장에 실패했습니다."); return; }
    setNotice("상품 정보가 저장되었습니다."); await load();
  };

  const updateInventory = async (productId: number, quantity: number, reorderPoint: number) => {
    const response = await fetch(`/api/admin/inventory/${productId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ quantity, reorderPoint }) });
    if (!response.ok) { const body = await response.json().catch(() => ({})); setNotice(body.error || "재고 저장에 실패했습니다."); return; }
    setNotice("재고 정보가 저장되었습니다."); await load();
  };

  const updateOrder = async (id: number, values: Record<string, unknown>) => {
    const response = await fetch(`/api/admin/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    const body = await response.json().catch(() => ({}));
    setNotice(response.ok ? "주문 상태가 저장되었습니다." : body.error || "주문 저장에 실패했습니다.");
    if (response.ok) await load();
  };

  const updateInquiry = async (id: number, status: string) => {
    const response = await fetch(`/api/admin/inquiries/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    const body = await response.json().catch(() => ({}));
    setNotice(response.ok ? "문의 상태가 저장되었습니다." : body.error || "문의 저장에 실패했습니다.");
    if (response.ok) await load();
  };

  const createSupplier = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/suppliers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form.entries())) });
    const body = await response.json().catch(() => ({}));
    setNotice(response.ok ? "공급사가 등록되었습니다." : body.error || "공급사 등록에 실패했습니다.");
    if (response.ok) { event.currentTarget.reset(); await load(); }
  };

  const createProduct = async (values: NewProduct) => {
    const response = await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) { setNotice(body.error || "상품 등록에 실패했습니다."); return; }
    setNotice("신규 상품이 등록되었습니다."); setShowProductForm(false); await load();
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) { setNotice(body.error || "이미지 업로드에 실패했습니다."); return ""; }
    setNotice("이미지가 업로드되었습니다.");
    return body.url as string;
  };

  const seed = async () => {
    const response = await fetch("/api/admin/seed", { method: "POST" });
    const body = await response.json().catch(() => ({}));
    setNotice(body.message || body.error || "초기화가 완료되었습니다.");
    if (response.ok) await load();
  };

  const lowStock = useMemo(() => products.filter((product) => product.quantity - product.reserved <= product.reorderPoint), [products]);

  if (!authenticated) return <main className="admin-login-page"><div className="admin-login-card"><p className="eyebrow">RHINORY BACK OFFICE</p><h1>운영자 로그인</h1><p>상품, 재고, 이미지, 문의를 관리하는 내부 운영 화면입니다.</p><form onSubmit={login}><label>관리자 접근 키<input type="password" value={key} onChange={(event) => setKey(event.target.value)} placeholder="ADMIN_ACCESS_KEY" autoFocus /></label><button className="dark-button" type="submit">관리자 화면 들어가기</button></form>{notice && <p className="admin-notice">{notice}</p>}<Link href="/">소비자 사이트로 돌아가기</Link></div></main>;

  return <main className="admin-page"><header className="admin-header"><div><p className="eyebrow">RHINORY BACK OFFICE</p><h1>운영 센터</h1></div><div className="admin-header-actions"><span className={`mode-badge ${mode}`}>{mode === "database" ? "DATABASE CONNECTED" : "DEMO DATA"}</span><a href="/" className="admin-link">사이트 보기</a><button onClick={async () => { await fetch("/api/admin/logout", { method: "POST" }); setAuthenticated(false); }}>로그아웃</button></div></header><nav className="admin-nav"><button className={tab === "overview" ? "active" : ""} onClick={() => setTab("overview")}>Overview</button><button className={tab === "products" ? "active" : ""} onClick={() => setTab("products")}>Products</button><button className={tab === "inventory" ? "active" : ""} onClick={() => setTab("inventory")}>Inventory</button><button className={tab === "orders" ? "active" : ""} onClick={() => setTab("orders")}>Orders</button><button className={tab === "inquiries" ? "active" : ""} onClick={() => setTab("inquiries")}>Inquiries</button><button className={tab === "suppliers" ? "active" : ""} onClick={() => setTab("suppliers")}>Suppliers</button><button className={tab === "categories" ? "active" : ""} onClick={() => setTab("categories")}>Categories</button></nav><div className="admin-content">
    {mode === "demo" && <div className="admin-warning">현재는 데모 데이터입니다. 실제 저장을 사용하려면 <code>DATABASE_URL</code>을 넣고 DB 스키마를 적용하세요. <button onClick={seed}>초기 데이터 준비</button></div>}
    {notice && <div className="admin-toast">{notice}</div>}
    {tab === "overview" && <><div className="admin-stats"><article><span>전체 상품</span><strong>{counts.products}</strong><small>등록된 카탈로그</small></article><article><span>판매 중</span><strong>{counts.published}</strong><small>공개 상태 상품</small></article><article><span>주문</span><strong>{counts.orders}</strong><small>누적 주문</small></article><article><span>결제 매출</span><strong>{counts.revenue.toLocaleString()}원</strong><small>결제 완료 기준</small></article><article className={counts.lowStock ? "alert" : ""}><span>재고 확인 필요</span><strong>{counts.lowStock}</strong><small>재주문 기준 이하</small></article><article className={counts.newInquiries ? "alert" : ""}><span>새 문의</span><strong>{counts.newInquiries}</strong><small>상담 · 입점 문의</small></article></div><div className="admin-panels"><section className="admin-panel"><div className="admin-panel-heading"><div><p className="eyebrow">STOCK WATCH</p><h2>재고 확인이 필요한 상품</h2></div><button onClick={() => setTab("inventory")}>전체 재고 보기</button></div>{lowStock.length ? <div className="stock-list">{lowStock.slice(0, 5).map((product) => <div key={product.id}><img src={product.thumbnailUrl || placeholder} alt="" /><div><strong>{product.name}</strong><span>{product.sku}</span></div><b>{Math.max(product.quantity - product.reserved, 0)}개</b></div>)}</div> : <p className="empty-admin">현재 재고 이슈가 없습니다.</p>}</section><section className="admin-panel"><div className="admin-panel-heading"><div><p className="eyebrow">INBOX</p><h2>최근 문의</h2></div><button onClick={() => setTab("inquiries")}>전체 문의 보기</button></div><div className="inquiry-list">{inquiries.slice(0, 4).map((item) => <div key={item.id}><span className={`status ${item.status.toLowerCase()}`}>{item.status}</span><div><strong>{item.name} · {item.kind}</strong><p>{item.message}</p></div><time>{item.createdAt}</time></div>)}</div></section></div></>}
    {tab === "products" && <section className="admin-panel full-panel"><div className="admin-panel-heading"><div><p className="eyebrow">CATALOG / PRODUCT CONTENT</p><h2>상품 관리</h2></div><button className="dark-small" onClick={() => setShowProductForm((current) => !current)}>{showProductForm ? "등록 폼 닫기" : "신규 상품 등록"}</button></div>{showProductForm && <NewProductForm onCreate={createProduct} onUpload={uploadImage} /> }<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>상품</th><th>SKU</th><th>상태</th><th>가격 표기</th><th>공급사 / 썸네일</th><th>저장</th></tr></thead><tbody>{products.map((product) => <ProductRow key={product.id} product={product} onSave={updateProduct} onUpload={uploadImage} />)}</tbody></table></div></section>}
    {tab === "inventory" && <section className="admin-panel full-panel"><div className="admin-panel-heading"><div><p className="eyebrow">OPERATIONS / STOCK</p><h2>재고 관리</h2></div><span className="admin-caption">가용 재고 = 보유 수량 − 예약 수량</span></div><div className="admin-table-wrap"><table className="admin-table inventory-table"><thead><tr><th>상품</th><th>보유 수량</th><th>예약 수량</th><th>가용 수량</th><th>재주문 기준</th><th>저장</th></tr></thead><tbody>{products.map((product) => <InventoryRow key={product.id} product={product} onSave={updateInventory} />)}</tbody></table></div></section>}
    {tab === "orders" && <section className="admin-panel full-panel"><div className="admin-panel-heading"><div><p className="eyebrow">COMMERCE / ORDER FLOW</p><h2>주문·배송 관리</h2></div><span className="admin-caption">결제·설치·배송·클레임 상태를 한 화면에서 관리합니다.</span></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>주문</th><th>고객</th><th>금액</th><th>결제</th><th>배송·설치</th><th>운송장</th><th>클레임·환불</th><th>저장</th></tr></thead><tbody>{orders.map((order) => <OrderRow key={order.id} order={order} onSave={updateOrder} />)}</tbody></table></div></section>}
    {tab === "inquiries" && <section className="admin-panel full-panel"><div className="admin-panel-heading"><div><p className="eyebrow">CUSTOMER / PARTNER</p><h2>문의 관리</h2></div><span className="admin-caption">상담 내용을 확인하고 후속 연락을 관리합니다.</span></div><div className="admin-inquiries">{inquiries.map((item) => <InquiryCard key={item.id} item={item} onSave={updateInquiry} />)}</div></section>}
    {tab === "suppliers" && <section className="admin-panel full-panel"><div className="admin-panel-heading"><div><p className="eyebrow">PARTNER / SUPPLIER NETWORK</p><h2>공급사 관리</h2></div><span className="admin-caption">제조사·유통사·설치업체 정보를 관리합니다.</span></div><form className="supplier-form" onSubmit={createSupplier}><input name="name" required placeholder="공급사명" /><select name="type" defaultValue="MANUFACTURER"><option value="MANUFACTURER">제조사</option><option value="DISTRIBUTOR">유통사</option><option value="INSTALLER">설치업체</option><option value="IMPORTER">수입사</option></select><input name="contactName" placeholder="담당자" /><input name="phone" placeholder="연락처" /><input name="email" type="email" placeholder="이메일" /><button className="dark-small">공급사 등록</button></form><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>공급사</th><th>유형</th><th>담당자</th><th>연락처</th><th>이메일</th><th>상태</th></tr></thead><tbody>{suppliers.map((supplier) => <tr key={supplier.id}><td><strong>{supplier.name}</strong></td><td>{supplier.type}</td><td>{supplier.contactName}</td><td>{supplier.phone}</td><td>{supplier.email}</td><td><span className={`status ${supplier.status.toLowerCase()}`}>{supplier.status}</span></td></tr>)}</tbody></table></div></section>}
    {tab === "categories" && <section className="admin-panel full-panel"><div className="admin-panel-heading"><div><p className="eyebrow">CATALOG / TAXONOMY</p><h2>카테고리 관리</h2></div><span className="admin-caption">현재 카테고리와 노출 순서를 확인합니다.</span></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>순서</th><th>코드</th><th>카테고리</th><th>슬러그</th><th>노출</th></tr></thead><tbody>{categories.map((category) => <tr key={category.id}><td>{category.sortOrder + 1}</td><td><code>{category.code}</code></td><td><strong>{category.name}</strong></td><td>{category.slug}</td><td><span className="status">{category.active === "true" ? "ACTIVE" : "HIDDEN"}</span></td></tr>)}</tbody></table></div></section>}
  </div></main>;
}

function ProductRow({ product, onSave, onUpload }: { product: Product; onSave: (id: number, values: Record<string, unknown>) => Promise<void>; onUpload: (file: File) => Promise<string> }) {
  const [status, setStatus] = useState(product.status);
  const [priceText, setPriceText] = useState(product.priceText);
  const [thumbnailUrl, setThumbnailUrl] = useState(product.thumbnailUrl);
  const [uploading, setUploading] = useState(false);
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; setUploading(true); const url = await onUpload(file); if (url) setThumbnailUrl(url); setUploading(false); event.target.value = ""; };
  return <tr><td><div className="table-product"><img src={thumbnailUrl || placeholder} alt="" /><div><strong>{product.name}</strong><small>{product.categorySlug}</small></div></div></td><td><code>{product.sku}</code></td><td><select value={status} onChange={(event) => setStatus(event.target.value)}><option>PUBLISHED</option><option>DRAFT</option><option>ARCHIVED</option></select></td><td><input value={priceText} onChange={(event) => setPriceText(event.target.value)} /></td><td><span className="supplier-cell">{product.supplierName}</span><input className="image-url-input" value={thumbnailUrl} onChange={(event) => setThumbnailUrl(event.target.value)} placeholder="썸네일 URL" /><label className="upload-button">{uploading ? "업로드 중" : "이미지 업로드"}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={handleUpload} disabled={uploading} /></label><GalleryManager productId={product.id} onUpload={onUpload} /></td><td><button className="save-button" onClick={() => onSave(product.id, { status, priceText, thumbnailUrl })}>저장</button></td></tr>;
}

function GalleryManager({ productId, onUpload }: { productId: number; onUpload: (file: File) => Promise<string> }) {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("상품 이미지");
  const [busy, setBusy] = useState(false);
  const load = async () => { const response = await fetch(`/api/admin/products/${productId}/images`); const body = await response.json().catch(() => ({})); if (response.ok) setImages(body.images || []); };
  // Gallery is loaded only when the operator opens the panel.
  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { if (open) load(); }, [open]);
  const add = async (imageUrl: string) => { if (!imageUrl) return; setBusy(true); const response = await fetch(`/api/admin/products/${productId}/images`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: imageUrl, alt }) }); setBusy(false); if (response.ok) { setUrl(""); await load(); } };
  const upload = async (event: React.ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; const imageUrl = await onUpload(file); if (imageUrl) await add(imageUrl); event.target.value = ""; };
  const remove = async (imageId: number) => { const response = await fetch(`/api/admin/products/${productId}/images/${imageId}`, { method: "DELETE" }); if (response.ok) await load(); };
  return <div className="gallery-manager"><button type="button" className="text-button" onClick={() => setOpen((value) => !value)}>{open ? "갤러리 닫기" : "상세 이미지 관리"}</button>{open && <div className="gallery-panel"><div className="gallery-add"><input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="상세 이미지 URL" /><input value={alt} onChange={(event) => setAlt(event.target.value)} placeholder="대체 텍스트" /><button type="button" className="save-button" disabled={busy} onClick={() => add(url)}>URL 추가</button><label className="upload-button">파일 추가<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={upload} disabled={busy} /></label></div>{images.length ? <div className="gallery-grid">{images.map((image) => <div key={image.id}><img src={image.url} alt={image.alt} /><button type="button" onClick={() => remove(image.id)}>삭제</button></div>)}</div> : <small>상세 이미지가 없습니다.</small>}<OptionManager productId={productId} /></div>}</div>;
}

function OptionManager({ productId }: { productId: number }) {
  const [options, setOptions] = useState<ProductOption[]>([]);
  const [name, setName] = useState("규격");
  const [value, setValue] = useState("");
  const [priceDelta, setPriceDelta] = useState("0");
  const load = async () => { const response = await fetch(`/api/admin/products/${productId}/options`); const body = await response.json().catch(() => ({})); if (response.ok) setOptions(body.options || []); };
  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);
  const add = async () => { if (!value.trim()) return; const response = await fetch(`/api/admin/products/${productId}/options`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, value, priceDelta: Number(priceDelta) || 0 }) }); if (response.ok) { setValue(""); setPriceDelta("0"); await load(); } };
  const remove = async (optionId: number) => { const response = await fetch(`/api/admin/products/${productId}/options/${optionId}`, { method: "DELETE" }); if (response.ok) await load(); };
  return <div className="option-manager"><p className="eyebrow">PRODUCT OPTIONS</p><div className="option-add"><input value={name} onChange={(event) => setName(event.target.value)} placeholder="옵션명" /><input value={value} onChange={(event) => setValue(event.target.value)} placeholder="옵션 값 예: 1800H" /><input type="number" value={priceDelta} onChange={(event) => setPriceDelta(event.target.value)} placeholder="추가금" /><button type="button" className="save-button" onClick={add}>옵션 추가</button></div>{options.length ? <div className="option-list">{options.map((option) => <span key={option.id}>{option.name}: {option.value}{option.priceDelta ? ` (+${option.priceDelta.toLocaleString()}원)` : ""}<button type="button" onClick={() => remove(option.id)}>×</button></span>)}</div> : <small>등록된 옵션이 없습니다.</small>}</div>;
}

function NewProductForm({ onCreate, onUpload }: { onCreate: (values: NewProduct) => Promise<void>; onUpload: (file: File) => Promise<string> }) {
  const [form, setForm] = useState<NewProduct>({ name: "", sku: "", categorySlug: "gate", productType: "BUY_INSTALL", priceText: "가격 상담", supplierName: "공급사 미지정", thumbnailUrl: placeholder, quantity: 0, reorderPoint: 5 });
  const [uploading, setUploading] = useState(false);
  const set = (field: keyof NewProduct, value: string | number) => setForm((current) => ({ ...current, [field]: value }));
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; setUploading(true); const url = await onUpload(file); if (url) set("thumbnailUrl", url); setUploading(false); event.target.value = ""; };
  return <form className="new-product-form" onSubmit={(event) => { event.preventDefault(); onCreate(form); }}><label>상품명<input required value={form.name} onChange={(event) => set("name", event.target.value)} placeholder="알루미늄 슬라이딩 대문" /></label><label>SKU<input required value={form.sku} onChange={(event) => set("sku", event.target.value)} placeholder="RF-GT-015" /></label><label>카테고리<select value={form.categorySlug} onChange={(event) => set("categorySlug", event.target.value)}>{[["boundary", "울타리 · 담장"], ["gate", "대문 · 출입"], ["storage", "창고 · 수납"], ["outdoor", "퍼골라 · 데크"], ["garden", "정원 · 잔디"], ["security", "보안 · CCTV"], ["parking", "주차 · 카포트"], ["water", "수영장 · 물관리"], ["maintenance", "청소 · 제설 · 관리"]].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label>판매 방식<select value={form.productType} onChange={(event) => set("productType", event.target.value)}><option value="BUY">일반 구매</option><option value="BUY_INSTALL">구매 + 설치</option><option value="PROJECT">현장 견적</option></select></label><label>가격 표기<input value={form.priceText} onChange={(event) => set("priceText", event.target.value)} placeholder="1,290,000원~" /></label><label>공급사<input value={form.supplierName} onChange={(event) => set("supplierName", event.target.value)} /></label><label>초기 재고<input type="number" min="0" value={form.quantity} onChange={(event) => set("quantity", Number(event.target.value))} /></label><label>재주문 기준<input type="number" min="0" value={form.reorderPoint} onChange={(event) => set("reorderPoint", Number(event.target.value))} /></label><label className="wide-field">썸네일 URL<input value={form.thumbnailUrl} onChange={(event) => set("thumbnailUrl", event.target.value)} placeholder="Vercel Blob URL 또는 로컬 이미지 경로" /><span className="upload-button">{uploading ? "업로드 중" : "이미지 업로드"}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={handleUpload} disabled={uploading} /></span></label><div className="form-actions"><button type="submit" className="dark-small">상품 등록</button><small>등록 후 상품 상태를 PUBLISHED로 바꾸면 소비자 사이트에 공개됩니다.</small></div></form>;
}

function OrderRow({ order, onSave }: { order: Order; onSave: (id: number, values: Record<string, unknown>) => Promise<void> }) {
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [deliveryStatus, setDeliveryStatus] = useState(order.deliveryStatus);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber);
  const [claimStatus, setClaimStatus] = useState(order.claimStatus || "NONE");
  const [refundAmount, setRefundAmount] = useState(order.refundAmount || 0);
  return <tr><td><strong>{order.orderNumber}</strong><small className="table-subline">{order.createdAt}</small></td><td><strong>{order.customerName}</strong><small className="table-subline">{order.customerPhone}</small></td><td>{order.totalAmount.toLocaleString()}원</td><td><select value={paymentStatus} onChange={(event) => setPaymentStatus(event.target.value)}><option>UNPAID</option><option>PENDING</option><option>PAID</option><option>REFUNDED</option><option>FAILED</option></select></td><td><select value={deliveryStatus} onChange={(event) => setDeliveryStatus(event.target.value)}><option>NOT_STARTED</option><option>PREPARING</option><option>SHIPPED</option><option>INSTALL_SCHEDULED</option><option>DELIVERED</option><option>CANCELED</option></select></td><td><input value={trackingNumber} onChange={(event) => setTrackingNumber(event.target.value)} placeholder="운송장" /></td><td><select value={claimStatus} onChange={(event) => setClaimStatus(event.target.value)}><option>NONE</option><option>REQUESTED</option><option>REFUND_REQUESTED</option><option>EXCHANGE_REQUESTED</option><option>COMPLETED</option><option>REJECTED</option></select><input className="number-input claim-refund" type="number" min="0" value={refundAmount} onChange={(event) => setRefundAmount(Number(event.target.value))} placeholder="환불액" /></td><td><button className="save-button" onClick={() => onSave(order.id, { paymentStatus, deliveryStatus, trackingNumber, claimStatus, refundAmount })}>저장</button></td></tr>;
}

function InquiryCard({ item, onSave }: { item: Inquiry; onSave: (id: number, status: string) => Promise<void> }) {
  const [status, setStatus] = useState(item.status);
  return <article><div><span className={`status ${status.toLowerCase()}`}>{status}</span><span className="inquiry-kind">{item.kind}</span></div><h3>{item.name}</h3><p>{item.message}</p><small>{item.phone} · {item.createdAt}</small><div className="inquiry-actions"><select value={status} onChange={(event) => setStatus(event.target.value)}><option>NEW</option><option>IN_PROGRESS</option><option>DONE</option><option>SPAM</option></select><button onClick={() => onSave(item.id, status)}>저장</button></div></article>;
}

function InventoryRow({ product, onSave }: { product: Product; onSave: (id: number, quantity: number, reorderPoint: number) => Promise<void> }) {
  const [quantity, setQuantity] = useState(product.quantity);
  const [reorderPoint, setReorderPoint] = useState(product.reorderPoint);
  const available = quantity - product.reserved;
  return <tr className={available <= reorderPoint ? "low-stock-row" : ""}><td><div className="table-product"><img src={product.thumbnailUrl || placeholder} alt="" /><div><strong>{product.name}</strong><small>{product.sku}</small></div></div></td><td><input className="number-input" type="number" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} /></td><td>{product.reserved}</td><td><strong>{available}</strong></td><td><input className="number-input" type="number" value={reorderPoint} onChange={(event) => setReorderPoint(Number(event.target.value))} /></td><td><button className="save-button" onClick={() => onSave(product.id, quantity, reorderPoint)}>저장</button></td></tr>;
}
