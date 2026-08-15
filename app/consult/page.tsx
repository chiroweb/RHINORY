"use client";

import { useState } from "react";
import { SubpageShell } from "../components/SubpageShell";

export default function ConsultPage() {
  const [form, setForm] = useState({ categorySlug: "gate", area: "", name: "", phone: "", message: "" });
  const [notice, setNotice] = useState("");
  const set = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch("/api/inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "CONSULT", ...form, categorySlug: form.categorySlug, message: `[설치 지역] ${form.area}\n${form.message}` }) });
    const body = await response.json().catch(() => ({}));
    setNotice(response.ok ? "상담 신청이 접수되었습니다. 담당자가 확인 후 연락드리겠습니다." : body.error || "신청을 저장하지 못했습니다.");
    if (response.ok) setForm({ categorySlug: "gate", area: "", name: "", phone: "", message: "" });
  };
  return <SubpageShell title="설치 상담" kicker="SERVICE / CONSULT"><div className="consult-page page-frame"><div className="consult-page-copy"><p className="eyebrow">RHINORY SERVICE</p><h2>우리 집에 맞는<br />방법을 찾아보세요.</h2><p>제품을 정하기 전에 지역, 길이, 바닥, 전기 등 현장 조건을 먼저 확인합니다. 상담 내용을 남겨주시면 담당자가 연결됩니다.</p><div className="consult-steps"><span><b>01</b> 기본 정보</span><span><b>02</b> 공간 조건</span><span><b>03</b> 상담 신청</span></div></div><form className="consult-form" onSubmit={submit}><label>관심 카테고리<select value={form.categorySlug} onChange={(event) => set("categorySlug", event.target.value)}><option value="gate">대문 · 출입</option><option value="boundary">울타리 · 담장</option><option value="storage">창고 · 수납</option><option value="outdoor">퍼골라 · 데크</option></select></label><label>설치 지역<input required value={form.area} onChange={(event) => set("area", event.target.value)} placeholder="예: 경기도 용인시" /></label><label>성함<input required value={form.name} onChange={(event) => set("name", event.target.value)} placeholder="성함을 입력해주세요" /></label><label>연락처<input required value={form.phone} onChange={(event) => set("phone", event.target.value)} placeholder="010-0000-0000" /></label><label>궁금한 점<textarea required value={form.message} onChange={(event) => set("message", event.target.value)} placeholder="필요한 제품이나 현장 상황을 알려주세요." rows={5} /></label><button className="dark-button" type="submit">상담 신청하기 →</button>{notice && <p className="form-notice">{notice}</p>}</form></div></SubpageShell>;
}
