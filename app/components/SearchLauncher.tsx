"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function SearchIcon() {
  return <svg className="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="m15.5 15.5 4.2 4.2" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>;
}

function categoryFor(query: string) {
  if (/대문|게이트|출입|자동/.test(query)) return "gate";
  if (/울타리|펜스|담장|가림/.test(query)) return "boundary";
  if (/창고|수납|가든하우스/.test(query)) return "storage";
  if (/데크|퍼골라|야외/.test(query)) return "outdoor";
  if (/정원|잔디/.test(query)) return "garden";
  if (/보안|CCTV|카메라/i.test(query)) return "security";
  if (/주차|카포트|차고/.test(query)) return "parking";
  if (/수영장|물관리/.test(query)) return "water";
  if (/청소|제설|관리/.test(query)) return "maintenance";
  return "boundary";
}

export function SearchLauncher() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    router.push(`/category/${categoryFor(value)}${value ? `?q=${encodeURIComponent(value)}` : ""}`);
    setOpen(false);
  };
  return <><button type="button" className="header-search" onClick={() => setOpen(true)} aria-label="상품 검색"><span>상품명, 카테고리, 브랜드를 검색해보세요.</span><SearchIcon /></button>{open && <div className="search-overlay" role="dialog" aria-modal="true" aria-label="상품 검색"><button type="button" className="search-close" onClick={() => setOpen(false)} aria-label="검색 닫기">×</button><div className="search-box"><p className="eyebrow">RHINORY SEARCH</p><h2>무엇을 찾고 계세요?</h2><form className="large-search" onSubmit={submit}><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="울타리, 자동대문, 야외창고..." aria-label="검색어" /><button type="submit" aria-label="검색 실행"><SearchIcon /></button></form><div className="search-suggestions"><span>요즘 많이 찾는 검색어</span>{["알루미늄 울타리", "자동대문 설치", "야외창고", "퍼골라"].map((suggestion) => <button type="button" key={suggestion} onClick={() => setQuery(suggestion)}>{suggestion}</button>)}</div></div></div>}</>;
}
