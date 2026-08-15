import { Suspense } from "react";
import { SubpageShell } from "../components/SubpageShell";
import { ConsultForm } from "../components/ConsultForm";

export default function ConsultPage() {
  return <SubpageShell title="설치 상담" kicker="SERVICE / CONSULT"><div className="consult-page page-frame"><div className="consult-page-copy"><p className="eyebrow">RHINORY SERVICE</p><h2>우리 집에 맞는<br />방법을 찾아보세요.</h2><p>제품을 정하기 전에 지역, 길이, 바닥, 전기 등 현장 조건을 먼저 확인합니다. 상담 내용을 남겨주시면 담당자가 연결됩니다.</p><div className="consult-steps"><span><b>01</b> 기본 정보</span><span><b>02</b> 공간 조건</span><span><b>03</b> 상담 신청</span></div></div><Suspense fallback={<div className="consult-form consult-loading">상담 양식을 준비하고 있습니다.</div>}><ConsultForm /></Suspense></div></SubpageShell>;
}
