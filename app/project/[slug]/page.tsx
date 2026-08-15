import Link from "next/link";
import { notFound } from "next/navigation";
import { SubpageShell } from "../../components/SubpageShell";

const projects: Record<string, { tag: string; location: string; title: string; price: string; period: string; image: string; description: string; productHref: string }> = {
  "1": { tag: "BOUNDARY / GATE", location: "경기 용인시 단독주택", title: "알루미늄 울타리와 자동대문으로 완성한 집의 경계", price: "5,800,000원", period: "시공 2일", image: "/images/product-fence.png", description: "도로와 마당의 거리를 만들면서 매일 사용하는 차량 출입은 더 편하게 정리한 프로젝트입니다.", productHref: "/product/RF-BD-021" },
  "2": { tag: "STORAGE", location: "경기 남양주 세컨하우스", title: "마당 한편에 놓은 작은 가든하우스", price: "2,180,000원", period: "제작·설치 약 3주", image: "/images/product-storage.png", description: "계절용품과 정원 도구를 한곳에 수납하고, 집 안의 생활 공간을 되찾았습니다.", productHref: "/product/RF-ST-032" },
  "3": { tag: "OUTDOOR", location: "충북 청주시 전원주택", title: "저녁이 길어지는 알루미늄 퍼골라", price: "4,600,000원", period: "시공 3일", image: "/images/product-pergola.png", description: "빛과 비를 조절하는 구조를 더해 계절에 관계없이 마당을 사용하는 시간을 늘렸습니다.", productHref: "/product/RF-OD-019" },
  "4": { tag: "PARKING", location: "강원 춘천시 단독주택", title: "비와 눈으로부터 차량을 지키는 법", price: "3,900,000원", period: "시공 2일", image: "/images/product-carport.png", description: "차량 동선과 현관까지의 이동을 함께 고려해 겨울철 관리 부담을 줄인 프로젝트입니다.", productHref: "/product/RF-PK-006" },
  "yongin-fence": { tag: "BOUNDARY / GATE", location: "경기 용인시 단독주택", title: "알루미늄 울타리와 자동대문으로 완성한 집의 경계", price: "5,800,000원", period: "시공 2일", image: "/images/product-fence.png", description: "도로와 마당의 거리를 만들면서 매일 사용하는 차량 출입은 더 편하게 정리한 프로젝트입니다.", productHref: "/product/RF-BD-021" },
  "garden-house": { tag: "STORAGE", location: "경기 남양주 세컨하우스", title: "마당 한편에 놓은 작은 가든하우스", price: "2,180,000원", period: "제작·설치 약 3주", image: "/images/product-storage.png", description: "계절용품과 정원 도구를 한곳에 수납하고, 집 안의 생활 공간을 되찾았습니다.", productHref: "/product/RF-ST-032" },
  pergola: { tag: "OUTDOOR", location: "충북 청주시 전원주택", title: "저녁이 길어지는 알루미늄 퍼골라", price: "4,600,000원", period: "시공 3일", image: "/images/product-pergola.png", description: "빛과 비를 조절하는 구조를 더해 계절에 관계없이 마당을 사용하는 시간을 늘렸습니다.", productHref: "/product/RF-OD-019" },
  carport: { tag: "PARKING", location: "강원 춘천시 단독주택", title: "비와 눈으로부터 차량을 지키는 법", price: "3,900,000원", period: "시공 2일", image: "/images/product-carport.png", description: "차량 동선과 현관까지의 이동을 함께 고려해 겨울철 관리 부담을 줄인 프로젝트입니다.", productHref: "/product/RF-PK-006" },
};

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects[slug];
  if (!project) notFound();
  return <SubpageShell title="설치 사례" kicker={`PROJECT / ${project.tag}`}><article className="project-detail-page page-frame"><div className="project-detail-hero"><img src={project.image} alt={project.title} /><div><p className="eyebrow light-eyebrow">{project.tag}</p><h2>{project.title}</h2><p>{project.location}</p></div></div><div className="project-detail-grid"><section><p className="eyebrow">PROJECT NOTE</p><h2>공간의 조건을 확인하고,<br />설치 이후까지 설계했습니다.</h2><p>{project.description}</p><Link href="/consult" className="dark-button">내 집도 상담받기 →</Link></section><aside><div><span>LOCATION</span><strong>{project.location}</strong></div><div><span>PROJECT COST</span><strong>{project.price}</strong></div><div><span>INSTALLATION</span><strong>{project.period}</strong></div></aside></div><div className="project-detail-product"><div><p className="eyebrow">USED PRODUCT</p><h3>이 프로젝트에 사용한 상품</h3></div><Link href={project.productHref} className="outline-button">상품 상세 보기 →</Link></div></article></SubpageShell>;
}
