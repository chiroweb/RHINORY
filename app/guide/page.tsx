import Link from "next/link";
import { SubpageShell } from "../components/SubpageShell";
import { guideArticles } from "../../lib/guide-content";

const featured = guideArticles[0];

export const metadata = {
  title: "전원주택 외부공간 가이드",
  description: "전원주택 울타리, 자동대문, 야외창고, 데크, 정원관리와 설치비를 실제 생활 기준으로 정리한 RHINORY 가이드입니다.",
  alternates: { canonical: "/guide" },
  openGraph: { title: "전원주택 외부공간 가이드 | RHINORY", description: "전원주택 외부공간을 준비하는 순서와 상품 선택 기준을 확인하세요.", url: "/guide" },
};

export default function GuidePage() {
  return (
    <SubpageShell title="전원주택 외부공간 가이드" kicker="KNOWLEDGE / FIELD GUIDE">
      <div className="guide-page page-frame">
        <div className="guide-page-feature">
          <img src={featured.image} alt="전원주택 외부공간 배치와 마당 계획 가이드" />
          <div>
            <p className="eyebrow light-eyebrow">{featured.tag}</p>
            <h2>{featured.title}</h2>
            <p>{featured.description}</p>
            <Link href={`/guide/${featured.slug}`} className="dark-button">읽어보기 →</Link>
          </div>
        </div>

        <div className="guide-intro-copy">
          <p className="eyebrow">RHINORY EDITORIAL</p>
          <h2>상품을 고르기 전에,<br />우리 집의 조건부터 확인하세요.</h2>
          <p>전원주택 생활에서 자주 생기는 고민을 가격, 설치, 관리 기준으로 정리했습니다. 필요한 정보를 읽고 관련 상품과 설치 상담으로 바로 이어갈 수 있습니다.</p>
        </div>

        <div className="guide-page-grid">
          {guideArticles.slice(1).map((article) => (
            <Link href={`/guide/${article.slug}`} className="guide-page-card" key={article.slug}>
              <img src={article.image} alt={`${article.title} 대표 이미지`} />
              <div>
                <span>{article.tag}</span>
                <h2>{article.title}</h2>
                <p>{article.description}</p>
                <small>가이드 읽기 →</small>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </SubpageShell>
  );
}
