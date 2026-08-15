"use client";

import Link from "next/link";
import { useState } from "react";
import { SubpageShell } from "../components/SubpageShell";

export default function PartnerPage() {
  const [form, setForm] = useState({ name: "", phone: "", partnerType: "제조사" });
  const [notice, setNotice] = useState("");
  const set = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch("/api/inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "PARTNER", name: form.name, phone: form.phone, message: `[파트너 유형] ${form.partnerType}\n입점 상담 신청`, categorySlug: "partner" }) });
    const body = await response.json().catch(() => ({}));
    setNotice(response.ok ? "입점 상담이 접수되었습니다. 담당자가 확인 후 연락드리겠습니다." : body.error || "신청을 저장하지 못했습니다.");
    if (response.ok) setForm({ name: "", phone: "", partnerType: "제조사" });
  };
  return <SubpageShell title="RHINORY PARTNER" kicker="PARTNER / FOR SUPPLIERS"><div className="partner-page page-frame"><div className="partner-hero"><p className="eyebrow">YOU MAKE. WE CONNECT.</p><h2>제품은 당신이 만드세요.<br /><em>고객은 RHINORY가 찾겠습니다.</em></h2><p>좋은 제품을 만들고 있지만 온라인 판매와 콘텐츠에 어려움이 있는 제조사·수입사·유통사·설치업체를 기다립니다.</p><Link href="#apply" className="dark-button">입점 적합성 확인 →</Link></div><div className="partner-benefits"><div><span>01</span><h3>상품 콘텐츠 제작</h3><p>RHINORY 기준에 맞는 상품페이지와 설치 정보를 함께 만듭니다.</p></div><div><span>02</span><h3>고객 유입 · 상담</h3><p>검색 콘텐츠와 전문 상담을 통해 구매 의도가 있는 고객을 연결합니다.</p></div><div><span>03</span><h3>판매 · 설치 · A/S</h3><p>판매 이후 배송, 전문 설치, 사후관리까지 역할을 명확하게 나눕니다.</p></div></div><form className="partner-apply" id="apply" onSubmit={submit}><p className="eyebrow">PARTNER APPLICATION</p><h2>간단한 입점 상담부터 시작하세요.</h2><div className="partner-form"><label>회사명<input required value={form.name} onChange={(event) => set("name", event.target.value)} placeholder="회사명을 입력해주세요" /></label><label>담당자 연락처<input required value={form.phone} onChange={(event) => set("phone", event.target.value)} placeholder="010-0000-0000" /></label><label>파트너 유형<select value={form.partnerType} onChange={(event) => set("partnerType", event.target.value)}><option>제조사</option><option>수입사</option><option>유통사</option><option>설치업체</option></select></label><button className="dark-button" type="submit">상담 신청하기 →</button></div>{notice && <p className="form-notice">{notice}</p>}</form></div></SubpageShell>;
}
