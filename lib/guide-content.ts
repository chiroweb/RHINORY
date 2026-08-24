export type GuideSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type GuideArticle = {
  slug: string;
  tag: string;
  title: string;
  description: string;
  image: string;
  updatedAt: string;
  answer: string;
  categorySlug: string;
  sections: GuideSection[];
};

export const guideArticles: GuideArticle[] = [
  {
    slug: "outdoor-space-planning",
    tag: "START / OUTDOOR SPACE",
    title: "전원주택 외부공간, 무엇부터 준비해야 할까요?",
    description: "울타리·대문·창고·데크·정원관리를 따로 고르기 전에 확인할 순서를 정리했습니다.",
    image: "/images/site-plan.png",
    updatedAt: "2026-08-24",
    answer: "전원주택 외부공간은 집의 동선, 경계, 수납, 주차, 배수와 관리 순서로 확인하는 것이 좋습니다. 제품부터 고르기보다 마당을 어떻게 사용할지 먼저 정하면 불필요한 재시공을 줄일 수 있습니다.",
    categorySlug: "boundary",
    sections: [
      { heading: "1. 차량과 사람의 동선을 먼저 그립니다", paragraphs: ["대문에서 주차 공간, 현관까지의 이동이 편한지 확인합니다. 자동대문이나 카포트를 계획한다면 차량 회전 반경과 전기 인입 위치도 함께 봐야 합니다."] },
      { heading: "2. 집의 경계와 시선을 정리합니다", paragraphs: ["울타리와 담장은 보안뿐 아니라 마당의 사생활과 채광을 결정합니다. 높이와 소재를 정할 때 도로, 이웃집, 현관에서 보이는 방향을 함께 비교하세요."] },
      { heading: "3. 관리하기 쉬운 공간으로 만듭니다", paragraphs: ["잔디와 수목, 데크, 배수로는 설치 후 관리가 필요합니다. 물이 고이는 곳과 장비를 보관할 곳을 미리 정하면 계절마다 드는 관리 부담이 줄어듭니다."] },
    ],
  },
  {
    slug: "fence-price",
    tag: "PRICE / BOUNDARY",
    title: "전원주택 울타리 가격은 무엇으로 결정되나요?",
    description: "알루미늄 울타리와 펜스의 제품비, 설치비, 기초공사비를 확인하는 방법입니다.",
    image: "/images/product-fence.png",
    updatedAt: "2026-08-24",
    answer: "전원주택 울타리 가격은 길이와 높이, 소재, 기둥 간격, 바닥 상태, 현장 접근성과 설치 지역에 따라 달라집니다. 제품비만 비교하지 말고 기초공사와 설치비가 포함되는지 확인해야 합니다.",
    categorySlug: "boundary",
    sections: [
      { heading: "길이와 높이가 가장 먼저입니다", paragraphs: ["같은 소재라도 설치 길이가 길어지면 기둥과 연결 부속품, 운송비가 달라집니다. 높이가 높아질수록 바람 하중과 기초 조건도 함께 확인해야 합니다."] },
      { heading: "바닥 상태에 따라 설치비가 달라집니다", paragraphs: ["콘크리트 위 설치와 흙·경사지 설치는 필요한 작업이 다릅니다. 기존 담장 철거, 기초 보강, 배수 처리가 추가될 수 있으므로 사진이나 현장 정보를 준비하면 상담이 빨라집니다."] },
      { heading: "소재별 관리 기준을 비교하세요", paragraphs: ["알루미늄은 부식과 도장 관리 부담을 줄이는 데 유리하고, 목재는 자연스러운 분위기와 주기적인 관리가 필요합니다. 집의 분위기보다 관리 가능한 수준을 먼저 정하는 것이 좋습니다."] },
    ],
  },
  {
    slug: "automatic-gate-installation",
    tag: "PRICE / GATE",
    title: "단독주택 자동대문 설치비가 달라지는 5가지",
    description: "슬라이딩·스윙 자동대문을 고를 때 제품비 외에 확인해야 할 설치 조건입니다.",
    image: "/images/product-gate.png",
    updatedAt: "2026-08-24",
    answer: "자동대문 설치비는 대문 방식, 개구부 크기, 기초와 레일 상태, 전기공사, 리모컨·인터폰 등 부속설비에 따라 달라집니다. 현장 사진과 문이 열리는 방향을 먼저 확인하면 정확한 상담이 가능합니다.",
    categorySlug: "gate",
    sections: [
      { heading: "슬라이딩과 스윙 중 어떤 방식이 맞을까요?", paragraphs: ["슬라이딩 대문은 옆으로 밀 공간이 필요하고, 스윙 대문은 안팎으로 열리는 회전 공간이 필요합니다. 경사와 주차 위치까지 함께 확인해야 합니다."] },
      { heading: "전기와 안전장치를 확인합니다", paragraphs: ["모터만 설치하는 것이 아니라 전원 인입, 감지센서, 수동 해제, 리모컨과 인터폰 연결 여부를 정해야 합니다. 어린이와 반려동물이 있는 집은 안전센서 조건도 중요합니다."] },
      { heading: "설치 후 A/S 범위를 확인하세요", paragraphs: ["모터, 제어기, 센서, 레일은 고장 원인과 관리 방법이 다릅니다. 제품 보증기간과 출장 기준, 소모품 교체 기준을 주문 전에 확인하는 것이 안전합니다."] },
    ],
  },
  {
    slug: "outdoor-storage",
    tag: "CHECK / STORAGE",
    title: "야외창고 설치 전, 바닥부터 확인하세요",
    description: "마당 창고와 가든하우스를 오래 쓰기 위해 위치·바닥·배수를 확인하는 방법입니다.",
    image: "/images/product-storage.png",
    updatedAt: "2026-08-24",
    answer: "야외창고는 창고 본체보다 바닥의 수평과 배수가 중요합니다. 물이 고이거나 지반이 내려앉으면 문이 틀어지고 내부 습기가 생길 수 있으므로 설치 전에 바닥 조건을 확인해야 합니다.",
    categorySlug: "storage",
    sections: [
      { heading: "창고를 사용할 목적부터 정합니다", paragraphs: ["정원 장비, 계절용품, 자전거, 캠핑용품은 필요한 출입 폭과 선반 높이가 다릅니다. 무엇을 보관할지 정하면 크기를 과하게 선택하는 일을 줄일 수 있습니다."] },
      { heading: "바닥과 배수는 별도로 확인합니다", paragraphs: ["제품에 바닥이 포함되는지, 콘크리트 기초가 필요한지 확인하세요. 빗물이 벽면으로 흘러들지 않도록 주변 배수와 처마 방향도 함께 봐야 합니다."] },
      { heading: "문과 환기 구조를 봅니다", paragraphs: ["큰 물건을 넣을 수 있는 문 폭과 잠금장치를 확인하고, 결로가 생기기 쉬운 장소라면 환기 구조와 내부 마감도 비교해야 합니다."] },
    ],
  },
  {
    slug: "pergola-deck",
    tag: "CHECK / OUTDOOR",
    title: "퍼골라와 데크 설치 전에 확인할 것",
    description: "마당을 오래 사용하는 공간으로 만들기 위해 방향, 기초, 배수와 관리 기준을 살펴봅니다.",
    image: "/images/product-pergola.png",
    updatedAt: "2026-08-24",
    answer: "퍼골라와 데크는 설치 위치의 일조량, 배수, 기초 상태, 집과의 연결 방식을 먼저 확인해야 합니다. 예쁜 사진보다 비가 온 뒤 물이 빠지는지와 청소가 쉬운지가 오래 쓰는 기준입니다.",
    categorySlug: "outdoor",
    sections: [
      { heading: "하루 중 언제 사용할 공간인가요?", paragraphs: ["아침 식사, 저녁 휴식, 바비큐처럼 사용하는 시간에 따라 방향과 차양이 달라집니다. 주변 나무와 집의 그림자도 함께 살펴보세요."] },
      { heading: "데크 아래의 배수를 설계합니다", paragraphs: ["데크는 표면보다 아래로 물이 흐르는 구조가 중요합니다. 경사지와 배수로, 지면과의 높이를 확인해야 습기와 뒤틀림을 줄일 수 있습니다."] },
      { heading: "관리 방법을 미리 정합니다", paragraphs: ["합성목과 금속은 관리 방식이 다릅니다. 물청소, 오염 제거, 색상 변화와 부품 교체 기준을 비교해 가족이 관리할 수 있는 소재를 선택하세요."] },
    ],
  },
  {
    slug: "garden-maintenance",
    tag: "CARE / GARDEN",
    title: "전원주택 정원관리, 계절별로 준비하는 방법",
    description: "잔디, 낙엽, 관수와 조경 장비를 계절별 관리 순서로 정리했습니다.",
    image: "/images/product-deck.png",
    updatedAt: "2026-08-24",
    answer: "전원주택 정원관리는 잔디만 관리하는 일이 아니라 물주기, 예초, 낙엽·제설, 배수와 장비 보관까지 포함합니다. 계절마다 필요한 작업을 나누면 관리 시간을 줄일 수 있습니다.",
    categorySlug: "garden",
    sections: [
      { heading: "봄과 여름은 물과 예초를 봅니다", paragraphs: ["잔디와 수목의 성장 속도가 빨라지는 시기에는 관수 시간과 예초 주기를 정해야 합니다. 호스와 장비를 꺼내기 쉬운 수납 위치도 중요합니다."] },
      { heading: "가을은 낙엽과 배수 준비 기간입니다", paragraphs: ["낙엽이 배수구를 막지 않도록 청소하고, 장비와 야외가구를 보관할 장소를 준비합니다. 겨울을 앞두고 물이 고이는 곳도 확인합니다."] },
      { heading: "겨울은 제설과 동파를 대비합니다", paragraphs: ["제설 장비, 외부 수도, 관수 설비를 미리 점검하세요. 무거운 눈이 쌓일 수 있는 퍼골라와 차양 구조도 살펴보는 것이 좋습니다."] },
    ],
  },
  {
    slug: "outdoor-security",
    tag: "CHECK / SECURITY",
    title: "전원주택 CCTV와 보안용품 설치 위치 정하기",
    description: "대문, 주차장, 현관, 창고 주변을 기준으로 외부 보안 장비를 계획합니다.",
    image: "/images/site-plan.png",
    updatedAt: "2026-08-24",
    answer: "전원주택 CCTV는 카메라 수보다 사각지대와 야간 시야를 먼저 확인해야 합니다. 대문과 주차장, 현관, 창고를 기준으로 전원·통신·녹화 위치를 함께 계획하세요.",
    categorySlug: "security",
    sections: [
      { heading: "먼저 지켜야 할 영역을 정합니다", paragraphs: ["도로와 대문, 차량 주차 위치, 현관과 창고처럼 접근이 시작되는 지점을 우선합니다. 카메라를 많이 설치하기보다 필요한 장면이 보이는지 확인해야 합니다."] },
      { heading: "야간 조명과 함께 봅니다", paragraphs: ["어두운 마당은 카메라 성능만으로 해결되지 않습니다. 현관등, 통로등, 센서등과 함께 설치하면 인식과 사용성이 좋아집니다."] },
      { heading: "개인정보와 저장 기간을 확인합니다", paragraphs: ["촬영 범위가 이웃이나 공용도로를 과도하게 향하지 않도록 조정하고, 녹화 저장 방식과 접근 권한을 가족과 함께 정해두는 것이 좋습니다."] },
    ],
  },
  {
    slug: "carport",
    tag: "CHECK / PARKING",
    title: "전원주택 카포트 설치 전 확인할 조건",
    description: "차량 크기와 진입 동선, 눈·비, 기초와 배수를 기준으로 카포트를 고릅니다.",
    image: "/images/product-carport.png",
    updatedAt: "2026-08-24",
    answer: "카포트는 차량 크기만 맞추는 것이 아니라 진입 동선, 문을 여는 공간, 현관까지의 이동, 기초와 배수를 함께 확인해야 합니다. 눈과 비가 많은 지역은 지붕 배수와 구조 조건이 특히 중요합니다.",
    categorySlug: "parking",
    sections: [
      { heading: "차량보다 넓은 사용 공간을 계산합니다", paragraphs: ["차량 문을 여는 폭, 트렁크를 여는 높이, 짐을 내리는 동선을 함께 계산합니다. 향후 차량이 바뀔 가능성도 고려해야 합니다."] },
      { heading: "기초와 배수 방향을 확인합니다", paragraphs: ["기둥을 지지할 기초와 지붕에서 떨어지는 물의 방향을 정해야 합니다. 집과 이웃 대지로 물이 흐르지 않도록 배수 계획을 함께 확인하세요."] },
      { heading: "지역의 눈과 바람 조건을 봅니다", paragraphs: ["지역의 강설량과 바람, 설치 위치의 개방 정도에 따라 필요한 구조가 달라질 수 있습니다. 설치업체의 현장 확인을 거치는 것이 안전합니다."] },
    ],
  },
  {
    slug: "yard-privacy",
    tag: "SOLUTION / BOUNDARY",
    title: "전원주택 마당 사생활 보호 방법 비교",
    description: "울타리, 가림막, 식재와 조합형 경계를 장점과 관리 부담으로 비교합니다.",
    image: "/images/product-fence.png",
    updatedAt: "2026-08-24",
    answer: "마당의 사생활을 보호하는 방법은 높은 울타리 하나만이 아닙니다. 알루미늄 펜스, 가림막, 생울타리, 식재를 시선 방향과 관리 가능성에 맞춰 조합하는 것이 좋습니다.",
    categorySlug: "boundary",
    sections: [
      { heading: "시선이 들어오는 방향부터 확인합니다", paragraphs: ["도로, 이웃집, 높은 지대에서 들어오는 시선을 나누어 확인하면 필요한 높이와 가림 정도를 과하게 잡지 않을 수 있습니다."] },
      { heading: "완전 차단과 개방감 사이를 비교합니다", paragraphs: ["루버 간격과 펜스 높이에 따라 바람과 빛, 시야가 달라집니다. 마당을 넓어 보이게 하고 싶다면 일부 구간만 가리는 방법도 있습니다."] },
      { heading: "설치 후 관리까지 생각합니다", paragraphs: ["생울타리는 계절별 전정과 물주기가 필요하고, 금속 펜스는 오염과 부속품을 관리합니다. 가족이 지속적으로 관리할 수 있는 방식을 선택하세요."] },
    ],
  },
];

export const guideArticleMap = Object.fromEntries(guideArticles.map((article) => [article.slug, article]));
