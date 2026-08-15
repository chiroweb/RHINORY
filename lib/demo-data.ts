export type DemoProduct = {
  id: number;
  name: string;
  sku: string;
  categorySlug: string;
  categoryCode: string;
  productType: "BUY" | "BUY_INSTALL" | "PROJECT";
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  priceMin: number;
  priceText: string;
  supplierName: string;
  thumbnailUrl: string;
  quantity: number;
  reserved: number;
  reorderPoint: number;
  tags: string[];
  rating: string;
  reviews: number;
};

export const demoProducts: DemoProduct[] = [
  { id: 1, name: "알루미늄 슬라이딩 대문", sku: "RF-GT-014", categorySlug: "gate", categoryCode: "GATE", productType: "BUY_INSTALL", status: "PUBLISHED", priceMin: 1290000, priceText: "1,290,000원~", supplierName: "RHINORY 검증 파트너 A", thumbnailUrl: "/images/product-gate.png", quantity: 8, reserved: 1, reorderPoint: 3, tags: ["BEST", "설치상담"], rating: "4.9", reviews: 128 },
  { id: 2, name: "알루미늄 루버 펜스", sku: "RF-BD-021", categorySlug: "boundary", categoryCode: "BOUNDARY", productType: "BUY_INSTALL", status: "PUBLISHED", priceMin: 450000, priceText: "450,000원~", supplierName: "RHINORY 검증 파트너 B", thumbnailUrl: "/images/product-fence.png", quantity: 24, reserved: 4, reorderPoint: 6, tags: ["RHINORY SELECT"], rating: "4.8", reviews: 96 },
  { id: 3, name: "합성목 데크 시스템", sku: "RF-OD-008", categorySlug: "outdoor", categoryCode: "OUTDOOR", productType: "BUY_INSTALL", status: "PUBLISHED", priceMin: 280000, priceText: "280,000원~", supplierName: "RHINORY 검증 파트너 C", thumbnailUrl: "/images/product-deck.png", quantity: 42, reserved: 9, reorderPoint: 10, tags: ["설치상담"], rating: "4.7", reviews: 74 },
  { id: 4, name: "모듈형 야외창고", sku: "RF-ST-032", categorySlug: "storage", categoryCode: "STORAGE", productType: "BUY_INSTALL", status: "PUBLISHED", priceMin: 2180000, priceText: "2,180,000원~", supplierName: "RHINORY 검증 파트너 D", thumbnailUrl: "/images/product-storage.png", quantity: 3, reserved: 1, reorderPoint: 4, tags: ["설치상담"], rating: "5.0", reviews: 43 },
  { id: 5, name: "알루미늄 퍼골라", sku: "RF-OD-019", categorySlug: "outdoor", categoryCode: "OUTDOOR", productType: "PROJECT", status: "PUBLISHED", priceMin: 4600000, priceText: "4,600,000원~", supplierName: "RHINORY 검증 파트너 E", thumbnailUrl: "/images/product-pergola.png", quantity: 0, reserved: 0, reorderPoint: 1, tags: ["현장견적"], rating: "4.8", reviews: 31 },
  { id: 6, name: "알루미늄 카포트 3×6m", sku: "RF-PK-006", categorySlug: "parking", categoryCode: "PARKING", productType: "BUY_INSTALL", status: "PUBLISHED", priceMin: 990000, priceText: "990,000원~", supplierName: "RHINORY 검증 파트너 F", thumbnailUrl: "/images/product-carport.png", quantity: 2, reserved: 0, reorderPoint: 2, tags: ["SALE", "설치상담"], rating: "4.8", reviews: 28 },
  { id: 7, name: "외부형 CCTV 세트", sku: "RF-SC-011", categorySlug: "security", categoryCode: "SECURITY", productType: "BUY", status: "DRAFT", priceMin: 390000, priceText: "390,000원~", supplierName: "공급사 미지정", thumbnailUrl: "/images/product-placeholder.svg", quantity: 0, reserved: 0, reorderPoint: 5, tags: ["등록 준비"], rating: "-", reviews: 0 },
];

export const demoInquiries = [
  { id: 101, kind: "CONSULT", status: "NEW", name: "김도윤", phone: "010-****-4821", categorySlug: "gate", message: "용인 단독주택 자동대문 설치 상담", createdAt: "2026-08-14" },
  { id: 102, kind: "PARTNER", status: "IN_PROGRESS", name: "박정우", phone: "010-****-1930", categorySlug: "boundary", message: "알루미늄 펜스 입점 문의", createdAt: "2026-08-13" },
  { id: 103, kind: "CONSULT", status: "DONE", name: "이서연", phone: "010-****-6721", categorySlug: "outdoor", message: "퍼골라 설치 가능 지역 문의", createdAt: "2026-08-12" },
];

export const demoOrders = [
  { id: 201, orderNumber: "RH-260814-001", status: "PAID", customerName: "김도윤", customerPhone: "010-****-4821", customerEmail: "doyun@example.com", totalAmount: 1290000, paymentStatus: "PAID", claimStatus: "NONE", claimReason: "", refundAmount: 0, deliveryStatus: "INSTALL_SCHEDULED", trackingNumber: "", createdAt: "2026-08-14" },
  { id: 202, orderNumber: "RH-260813-004", status: "PENDING", customerName: "이서연", customerPhone: "010-****-6721", customerEmail: "seoyeon@example.com", totalAmount: 520000, paymentStatus: "PENDING", claimStatus: "NONE", claimReason: "", refundAmount: 0, deliveryStatus: "NOT_STARTED", trackingNumber: "", createdAt: "2026-08-13" },
  { id: 203, orderNumber: "RH-260812-002", status: "COMPLETED", customerName: "박정우", customerPhone: "010-****-1930", customerEmail: "jungwoo@example.com", totalAmount: 2180000, paymentStatus: "PAID", claimStatus: "REFUND_REQUESTED", claimReason: "현장 조건 변경", refundAmount: 0, deliveryStatus: "DELIVERED", trackingNumber: "CJ123456789", createdAt: "2026-08-12" },
];

export const demoSuppliers = [
  { id: 1, name: "RHINORY 검증 파트너 A", type: "MANUFACTURER", contactName: "김현우", phone: "02-0000-0001", email: "partner-a@example.com", status: "ACTIVE", productCount: 2 },
  { id: 2, name: "RHINORY 검증 파트너 B", type: "INSTALLER", contactName: "이정민", phone: "031-0000-0002", email: "partner-b@example.com", status: "ACTIVE", productCount: 3 },
  { id: 3, name: "입점 검토 중 파트너 C", type: "DISTRIBUTOR", contactName: "최유진", phone: "010-0000-0003", email: "partner-c@example.com", status: "PENDING", productCount: 0 },
];

export const categorySeed = [
  ["boundary", "BOUNDARY", "울타리 · 담장"], ["gate", "GATE", "대문 · 출입"], ["storage", "STORAGE", "창고 · 수납"], ["outdoor", "OUTDOOR", "퍼골라 · 데크"], ["garden", "GARDEN", "정원 · 잔디"], ["security", "SECURITY", "보안 · CCTV"], ["parking", "PARKING", "주차 · 카포트"], ["water", "WATER", "수영장 · 물관리"], ["maintenance", "MAINTENANCE", "청소 · 제설 · 관리"],
];
