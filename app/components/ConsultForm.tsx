"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function ConsultForm() {
  const params = useSearchParams();
  const product = params.get("product") || "";
  const initialCategory = params.get("category") || "gate";
  const initialArea = params.get("area") || "";
  const initialLength = params.get("length") || "";
  const initialFloor = params.get("floor") || "";
  const [form, setForm] = useState({ categorySlug: initialCategory, product, area: initialArea, length: initialLength, floor: initialFloor, name: "", phone: "", message: "" });
  const [notice, setNotice] = useState("");
  const set = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const details = [form.product && `[상품] ${form.product}`, form.area && `[설치 지역] ${form.area}`, form.length && `[필요 길이] ${form.length}`, form.floor && `[바닥 형태] ${form.floor}`, form.message].filter(Boolean).join("\n");
    const response = await fetch("/api/inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "CONSULT", name: form.name, phone: form.phone, categorySlug: form.categorySlug, message: details }) });
    const body = await response.json().catch(() => ({}));
    setNotice(response.ok ? "상담 신청이 접수되었습니다. 담당자가 확인 후 연락드리겠습니다." : body.error || "신청을 저장하지 못했습니다.");
    if (response.ok) setForm({ categorySlug: "gate", product: "", area: "", length: "", floor: "", name: "", phone: "", message: "" });
  };
  return <form className="consult-form" onSubmit={submit}>{form.product && <div className="selected-product"><span>상담 상품</span><strong>{form.product}</strong></div>}<label>관심 카테고리<select value={form.categorySlug} onChange={(event) => set("categorySlug", event.target.value)}><option value="gate">대문 · 출입</option><option value="boundary">울타리 · 담장</option><option value="storage">창고 · 수납</option><option value="outdoor">퍼골라 · 데크</option></select></label><label>설치 지역<input required value={form.area} onChange={(event) => set("area", event.target.value)} placeholder="예: 경기도 용인시" /></label><label>필요 길이<input value={form.length} onChange={(event) => set("length", event.target.value)} placeholder="예: 18m, 아직 모름" /></label><label>바닥 형태<select value={form.floor} onChange={(event) => set("floor", event.target.value)}><option value="">선택해주세요</option><option>콘크리트</option><option>흙 / 잔디</option><option>확인 필요</option></select></label><label>성함<input required value={form.name} onChange={(event) => set("name", event.target.value)} placeholder="성함을 입력해주세요" /></label><label>연락처<input required value={form.phone} onChange={(event) => set("phone", event.target.value)} placeholder="010-0000-0000" /></label><label>궁금한 점<textarea required value={form.message} onChange={(event) => set("message", event.target.value)} placeholder="필요한 제품이나 현장 상황을 알려주세요." rows={5} /></label><button className="dark-button" type="submit">상담 신청하기 →</button>{notice && <p className={`form-notice ${notice.includes("접수") ? "success" : "error"}`}>{notice}</p>}</form>;
}
