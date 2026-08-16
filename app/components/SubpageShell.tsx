import Link from "next/link";
import type { ReactNode } from "react";
import { CartCount } from "./CartCount";
import { MobileMenu } from "./MobileMenu";
import { SearchLauncher } from "./SearchLauncher";

function CartIcon() {
  return <svg className="cart-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 5h2l1.8 10.2h10.8L20.5 8H6.2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="9" cy="19" r="1.2" fill="currentColor" /><circle cx="17" cy="19" r="1.2" fill="currentColor" /></svg>;
}

export function SubpageShell({ children, title, kicker }: { children: ReactNode; title?: string; kicker?: string }) {
  return (
    <main>
      <div className="announcement"><span>RHINORY HOUSE · LAND · OUTDOOR</span><span>설치가 필요한 상품은 상담부터 도와드립니다 →</span></div>
      <header className="site-header subpage-header">
        <Link href="/" className="brand" aria-label="RHINORY 홈"><img src="/images/rhinory-logo.png" alt="RHINORY" /></Link>
        <SearchLauncher />
        <nav className="main-nav" aria-label="주요 메뉴"><Link href="/category/boundary">SHOP</Link><Link href="/project">PROJECT</Link><Link href="/guide">GUIDE</Link><Link href="/consult">SERVICE</Link></nav>
        <div className="header-actions"><Link href="/" className="header-text-action">홈으로</Link><Link href="/mypage" className="header-text-action">마이 RHINORY</Link><Link href="/cart" className="header-text-action cart-action"><CartIcon /><span className="header-cart-label">장바구니</span> <CartCount /></Link><Link href="/partner" className="partner-button">입점문의 →</Link><MobileMenu /></div>
      </header>
      {title && <div className="subpage-title page-frame"><p className="eyebrow">{kicker || "RHINORY / SPACE & PRODUCT"}</p><h1>{title}</h1></div>}
      {children}
      <footer className="site-footer"><div className="footer-top page-frame"><div className="footer-brand"><img src="/images/rhinory-logo.png" alt="RHINORY" /><p>HOUSE · LAND · OUTDOOR</p></div><div className="footer-links"><div><strong>SHOP</strong><Link href="/category/boundary">울타리 · 담장</Link><Link href="/category/gate">대문 · 출입</Link><Link href="/category/storage">창고 · 수납</Link></div><div><strong>HELP</strong><Link href="/guide">구매 가이드</Link><Link href="/consult">설치 상담</Link><Link href="/contact">고객센터</Link></div><div><strong>ABOUT</strong><Link href="/about">RHINORY 소개</Link><Link href="/partner">입점문의</Link><Link href="/project">설치 사례</Link></div></div></div><div className="footer-bottom page-frame"><span>© 2026 RHINORY. All rights reserved.</span><span className="footer-legal"><Link href="/about">사업자정보</Link><Link href="/terms">이용약관</Link><Link href="/privacy">개인정보처리방침</Link></span></div></footer>
    </main>
  );
}
