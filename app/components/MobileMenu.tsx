"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  ["SHOP", "/category/boundary"],
  ["PROJECT", "/project"],
  ["GUIDE", "/guide"],
  ["SERVICE", "/consult"],
  ["마이 RHINORY", "/mypage"],
  ["장바구니", "/cart"],
  ["고객센터", "/contact"],
  ["입점문의", "/partner"],
];

function MenuIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;
}

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  return <div className="mobile-menu-wrap"><button type="button" className="mobile-menu" aria-label={open ? "메뉴 닫기" : "메뉴 열기"} aria-expanded={open} onClick={() => setOpen((value) => !value)}><MenuIcon /></button>{open && <div className="mobile-menu-panel">{links.map(([label, href]) => <Link href={href} key={href} onClick={() => setOpen(false)}>{label}<span>→</span></Link>)}</div>}</div>;
}
