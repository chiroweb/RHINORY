import Link from "next/link";
import { SubpageShell } from "../components/SubpageShell";

const projects = [["BOUNDARY / GATE", "경기 용인시 단독주택", "알루미늄 울타리 + 자동대문", "5,800,000원", "/images/product-fence.png"], ["STORAGE", "경기 남양주 세컨하우스", "모듈형 가든하우스", "2,180,000원", "/images/product-storage.png"], ["OUTDOOR", "충북 청주시 전원주택", "알루미늄 퍼골라", "4,600,000원", "/images/product-pergola.png"], ["PARKING", "강원 춘천시 단독주택", "알루미늄 카포트", "3,900,000원", "/images/product-carport.png"]];

export default function ProjectPage() { return <SubpageShell title="실제 설치 사례" kicker="PROJECT / REAL HOMES"><div className="project-page page-frame"><div className="project-page-intro"><p>상품은 공간에 놓였을 때 비로소 이해됩니다. 지역, 대지, 비용, 시공기간을 함께 공개합니다.</p><Link href="/consult" className="dark-button">내 집도 상담받기 →</Link></div><div className="project-cards">{projects.map(([tag, location, title, price, image], i) => <Link href={`/project/${i + 1}`} className={`project-page-card ${i === 0 ? "featured" : ""}`} key={title}><img src={image} alt={title} /><div><span>{tag}</span><h2>{title}</h2><p>{location}</p><strong>{price}</strong><small>시공 사례 자세히 보기 →</small></div></Link>)}</div></div></SubpageShell>; }
