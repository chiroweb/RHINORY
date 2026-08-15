import { SubpageShell } from "./SubpageShell";

const content: Record<string, { title: string; kicker: string; sections: [string, string][] }> = {
  about: { title: "RHINORY 소개", kicker: "ABOUT / HOUSE · LAND · OUTDOOR", sections: [["땅이 있는 집의 기준", "RHINORY는 단독주택과 전원주택의 외부공간에 필요한 상품, 설치, 관리 정보를 한곳에서 제안하는 전문 커머스입니다."], ["우리가 고르는 기준", "제품의 가격만이 아니라 설치 조건, 내구성, 유지관리, 공급사와 A/S 정보를 함께 확인하고 공개하는 것을 기준으로 합니다."]] },
  faq: { title: "배송 · A/S 안내", kicker: "HELP / DELIVERY · A/S", sections: [["배송과 설치", "설치가 필요한 상품은 지역, 현장 조건, 기초·전기 공사 여부에 따라 일정과 비용이 달라질 수 있습니다. 상품 상세와 상담 과정에서 확인합니다."], ["A/S", "상품별 보증 범위와 담당 공급사가 다릅니다. 구매 전 상품 상세의 A/S 안내를 확인하거나 상담을 요청해주세요."], ["교환·반품", "상품 특성, 설치 완료 여부, 주문 제작 여부에 따라 기준이 달라질 수 있습니다. 실제 판매 개시 전 운영자가 최종 정책과 연락처를 확정해야 합니다."]] },
  terms: { title: "이용약관", kicker: "LEGAL / TERMS", sections: [["서비스 이용", "본 페이지는 RHINORY 서비스 이용을 위한 약관 안내 자리입니다. 실제 판매를 시작하기 전 사업자 정보, 통신판매업 정보, 주문·결제·취소·환불 절차를 운영자가 확정해 게시해야 합니다."], ["상품과 설치", "설치 상품은 현장 조건 확인 후 최종 금액과 일정이 확정될 수 있습니다. 상품 상세의 표시와 실제 상담 내용을 기준으로 주문을 진행합니다."]] },
  privacy: { title: "개인정보처리방침", kicker: "LEGAL / PRIVACY", sections: [["수집 항목", "상담·견적 접수 시 성명, 연락처, 이메일, 설치 지역과 문의 내용이 수집될 수 있습니다. 실제 오픈 전 보유 기간, 이용 목적, 파기 방법, 위탁처를 운영자가 확정해야 합니다."], ["보호와 문의", "개인정보 접근 권한과 보관 위치는 운영 환경에 맞게 제한해야 합니다. 개인정보 관련 문의 담당자와 연락처를 실제 사업자 정보로 교체한 뒤 공개해야 합니다."]] },
  refund: { title: "교환 · 반품 · 환불", kicker: "LEGAL / REFUND", sections: [["주문 전 확인", "설치 상품과 주문 제작 상품은 일반 상품과 취소·반품 조건이 다를 수 있습니다. 현장 실측, 제작 착수, 설치 완료 여부를 기준으로 운영 정책을 확정해야 합니다."], ["환불 처리", "결제 연동 후 결제수단, 환불 가능 범위, 처리 기간, 배송비·철거비 부담 주체를 주문 단계에서 명확히 안내해야 합니다."]] },
  contact: { title: "고객센터", kicker: "HELP / CONTACT", sections: [["상담 접수", "상품, 설치, 배송, A/S 문의는 설치 상담 페이지에서 접수할 수 있습니다."], ["운영자 입력 필요", "대표 전화번호, 이메일, 운영 시간, 사업자명과 주소는 실제 오픈 전 운영자가 입력해야 합니다."]] },
};

export function PolicyPage({ slug }: { slug: keyof typeof content }) {
  const page = content[slug];
  return <SubpageShell title={page.title} kicker={page.kicker}><div className="policy-page page-frame"><div className="policy-intro"><p className="eyebrow">RHINORY / INFORMATION</p><p>단독주택의 외부공간을 더 잘 고르고, 더 안전하게 관리하기 위한 안내입니다.</p></div>{page.sections.map(([heading, body]) => <section key={heading}><h2>{heading}</h2><p>{body}</p></section>)}<div className="policy-placeholder">실제 오픈 전 사업자 정보와 운영 정책을 입력해주세요.</div></div></SubpageShell>;
}
