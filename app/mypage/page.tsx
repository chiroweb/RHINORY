import Link from "next/link";
import { SubpageShell } from "../components/SubpageShell";

export default function Mypage() { return <SubpageShell title="마이 RHINORY" kicker="ACCOUNT / TEMPORARY"><div className="empty-page page-frame"><p className="eyebrow">TEMPORARY ACCOUNT</p><h2>로그인 기능은 준비 중입니다.</h2><p>현재는 외부 인증 키 없이도 사이트 구조를 확인할 수 있도록 비워두었습니다. 다음 단계에서 주문조회, 상담내역, 찜한 상품을 연결할 수 있습니다.</p><Link href="/" className="dark-button">쇼핑 계속하기 →</Link></div></SubpageShell>; }
