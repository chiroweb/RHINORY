import Link from "next/link";
import { notFound } from "next/navigation";
import { SubpageShell } from "../../components/SubpageShell";

const articles: Record<string, { tag: string; title: string; lead: string; image: string }> = {
  article: { tag: "EDITORIAL / FIELD NOTE", title: "집 밖을 더 잘 쓰는 법", lead: "제품보다 먼저 알아야 할 설치, 관리, 비용에 대한 이야기입니다.", image: "/images/hero-territory.png" },
  "field-note": { tag: "FIELD NOTE / 01", title: "전원주택 외부공간을 시작하기 전에", lead: "울타리, 대문, 창고, 데크를 따로 고르기 전에 우리 집의 동선과 관리 범위를 먼저 확인하세요.", image: "/images/site-plan.png" },
};

export default async function GuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles[slug];
  if (!article) notFound();
  return <SubpageShell title="RHINORY GUIDE" kicker={`KNOWLEDGE / ${article.tag}`}><article className="guide-detail-page page-frame"><div className="guide-detail-hero"><img src={article.image} alt="전원주택 외부공간 가이드" /><div><p className="eyebrow light-eyebrow">{article.tag}</p><h2>{article.title}</h2><p>{article.lead}</p></div></div><div className="guide-detail-body"><p className="eyebrow">RHINORY EDITORIAL</p><h2>외부공간은 상품보다<br />순서가 먼저입니다.</h2><p>집의 경계와 출입, 수납, 휴식, 관리의 순서를 먼저 정하면 필요한 제품의 기준이 선명해집니다. 설치 가능 지역과 바닥 조건, 전기와 배수처럼 나중에 바꾸기 어려운 조건부터 확인하는 것이 좋습니다.</p><div className="guide-detail-points"><div><span>01</span><strong>동선 확인</strong><p>차량과 보행자가 들어오고 나가는 길을 먼저 그립니다.</p></div><div><span>02</span><strong>관리 범위</strong><p>눈, 낙엽, 잔디를 누가 얼마나 자주 관리할지 정합니다.</p></div><div><span>03</span><strong>설치 조건</strong><p>바닥, 전기, 배수와 설치 가능 지역을 확인합니다.</p></div></div><Link href="/consult" className="dark-button">우리 집 조건 상담하기 →</Link></div></article></SubpageShell>;
}
