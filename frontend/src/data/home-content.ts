export interface HeroImage {
  src: string;
  alt: string;
}

export interface TechnologyImage {
  src: string;
  tag: string;
  alt: string;
}

export interface TechnologyItem {
  id: string;
  title: string;
  description?: string;
  doctorNote?: string;
  keyPoints?: string[];
  images: TechnologyImage[];
}

export const heroImages: HeroImage[] = [
  {
    src: "/images/hero/hero_1.jpg",
    alt: "신구대식물원 방제 작업",
  },
  {
    src: "/images/hero/hero_2.jpg",
    alt: "정부청사 소나무 전정 작업",
  },
];

export const technologyItems: TechnologyItem[] = [
  {
    id: "green_maintenance",
    title: "녹지관리",
    description: "아파트 단지와 공공시설의 녹지를 체계적으로 관리하여, 사계절 내내 푸르고 쾌적한 쉼터를 제공합니다. 정기적인 예초와 잡초 제거는 병해충 서식지를 줄이고 수목의 생육 환경을 개선하는 가장 기초적이고 중요한 작업입니다.",
    doctorNote: "잡초만 제거해도 나무가 숨을 쉽니다. 깔끔하게 정돈된 녹지는 입주민의 삶의 질을 높이고 건물의 가치까지 올려줍니다.",
    keyPoints: [
      "정밀 예초 및 잡초 제거로 쾌적성 유지",
      "수목 생육을 방해하는 덩굴류 집중 관리",
      "사계절 맞춤형 수목 시비 및 관수"
    ],
    images: [
      {
        src: "/images/technology/green_maintenance/before.jpg",
        tag: "Before",
        alt: "녹지관리 전",
      },
      {
        src: "/images/technology/green_maintenance/after.jpg",
        tag: "After",
        alt: "녹지관리 후",
      },
    ],
  },
  {
    id: "pine_pruning",
    title: "소나무 전정",
    description: "소나무의 고유한 수형을 살리고 햇빛과 바람이 잘 통하도록 가지를 정리합니다. 묵은 가지와 웃자란 가지를 솎아내면 병충해를 예방할 뿐만 아니라, 소나무 특유의 기품 있고 웅장한 자태가 되살아납니다.",
    doctorNote: "소나무 전정은 미용이자 건강검진입니다. 꽉 막힌 가지 사이로 바람 길을 열어주어야 나무가 건강하게 장수할 수 있습니다.",
    keyPoints: [
      "전통적 기법과 과학적 수형 관리의 조화",
      "고가 수목의 가치를 보존하는 정밀 전정",
      "생리적 특성을 고려한 가지치기로 수세 강화"
    ],
    images: [
      {
        src: "/images/technology/pine_pruning/before.jpg",
        tag: "Before",
        alt: "소나무 전정 전",
      },
      {
        src: "/images/technology/pine_pruning/after.jpg",
        tag: "After",
        alt: "소나무 전정 후",
      },
    ],
  },
  {
    id: "seasonal_flowers",
    title: "계절꽃 식재",
    description: "삭막한 도심 공간에 계절의 변화를 알리는 다채로운 꽃을 식재합니다. 봄의 팬지부터 가을의 국화까지, 시기에 맞는 최적의 초화류를 선정하여 거리와 화단에 생동감 넘치는 활력을 불어넣습니다.",
    doctorNote: "꽃 한 송이가 거리를 바꿉니다. 걷고 싶은 거리, 머물고 싶은 화단을 위해 색감과 개화 시기를 고려하여 정성껏 디자인합니다.",
    keyPoints: [
      "지역 환경에 최적화된 우수 품종 선정",
      "미관과 생육을 모두 고려한 디자인 식재",
      "식재 후 집중 관리를 통한 최장 개화기 유지"
    ],
    images: [
      {
        src: "/images/technology/seasonal_flowers/planter_spring.jpg",
        tag: "봄 식재",
        alt: "대형화분 봄 식재",
      },
      {
        src: "/images/technology/seasonal_flowers/planter_autumn.jpg",
        tag: "가을 식재",
        alt: "대형화분 가을 식재",
      },
      {
        src: "/images/technology/seasonal_flowers/street_planter.jpeg",
        tag: "거리화분",
        alt: "거리화분 식재",
      },
      {
        src: "/images/technology/seasonal_flowers/hanging_planter.jpg",
        tag: "걸이화분",
        alt: "걸이화분 식재",
      },
      {
        src: "/images/technology/seasonal_flowers/design.jpeg",
        tag: "디자인",
        alt: "화단 디자인",
      },
    ],
  },
  {
    id: "landscape_planting",
    title: "조경식재",
    description: "주변 환경과 토양 조건을 분석하여 해당 장소에 가장 적합한 수종을 식재합니다. 단순한 나무 심기를 넘어, 시간이 지날수록 더욱 울창하고 아름다워지는 지속 가능한 조경 공간을 설계하고 시공합니다.",
    doctorNote: "나무도 제 자리가 있습니다. 그늘을 좋아하는지, 물을 좋아하는지 꼼꼼히 따져 심어야 뿌리를 잘 내리고 튼튼하게 자랍니다.",
    keyPoints: [
      "공간의 가치를 높이는 전략적 수종 배치",
      "하자 발생을 최소화하는 정밀 식재 공법",
      "주변 경관과 조화를 이루는 고품격 조경 연출"
    ],
    images: [
      {
        src: "/images/technology/landscape_planting/before.jpg",
        tag: "Before",
        alt: "조경식재 전",
      },
      {
        src: "/images/technology/landscape_planting/after.jpg",
        tag: "After",
        alt: "조경식재 후",
      },
    ],
  },
  {
    id: "pest_control",
    title: "병충해 방제",
    description: "나무의사의 정확한 진단을 바탕으로 병해충의 종류와 발생 시기에 맞춘 맞춤형 방제를 실시합니다. 무분별한 농약 살포를 지양하고, 적기 적소에 필요한 약제만을 사용하여 수목 피해를 최소화하고 생태계를 보호합니다.",
    doctorNote: "아픈 나무는 말이 없습니다. 잎의 변색이나 해충의 흔적을 조기에 발견하여 치료하는 것이 나무를 살리는 골든타임입니다.",
    keyPoints: [
      "1종 나무병원의 전문 진단 및 처방",
      "농약 오남용 없는 저독성/친환경 방제",
      "수간주사 등 수목별 최적의 방제 공법 적용"
    ],
    images: [
      {
        src: "/images/technology/pest_control/pest_inspection.jpg",
        tag: "해충예찰",
        alt: "해충 예찰",
      },
      {
        src: "/images/technology/pest_control/control_work_1.jpg",
        tag: "방제작업",
        alt: "방제 작업 1",
      },
      {
        src: "/images/technology/pest_control/control_work_2.jpg",
        tag: "방제작업",
        alt: "방제 작업 2",
      },
    ],
  },
  {
    id: "tree_recovery",
    title: "수목수세회복",
    description: "각종 스트레스로 쇠약해진 수목에 영양을 공급하고 토양 환경을 개선합니다. 뿌리 호흡을 돕는 통기 작업과 맞춤형 비료 처방을 통해 죽어가던 나무의 면역력을 높이고 다시 푸르게 소생시킵니다.",
    doctorNote: "나무도 사람처럼 영양제와 보약이 필요할 때가 있습니다. 척박한 도시 환경에서 지친 나무에게 다시 일어설 힘을 선물합니다.",
    keyPoints: [
      "토양 개량 및 영양 공급으로 근본적 원인 해결",
      "수간 주사 및 엽면 시비를 통한 신속한 영양 공급",
      "수목 생리 전문가의 정밀 모니터링 및 관리"
    ],
    images: [
      {
        src: "/images/technology/tree_recovery/before.jpg",
        tag: "Before",
        alt: "수세회복 전",
      },
      {
        src: "/images/technology/tree_recovery/after.jpeg",
        tag: "After",
        alt: "수세회복 후",
      },
      {
        src: "/images/technology/tree_recovery/diagnois.jpg",
        tag: "진단",
        alt: "수목 진단",
      },
      {
        src: "/images/technology/tree_recovery/treatment.jpg",
        tag: "치료",
        alt: "수목 치료",
      },
    ],
  },
  {
    id: "risk_tree_removal",
    title: "위험목 제거",
    description: "태풍이나 노후화로 인해 쓰러질 위험이 있는 수목을 사전에 파악하여 안전하게 제거합니다. 주변 시설물이나 보행자의 안전을 최우선으로 고려하여, 전문 장비와 숙련된 기술로 신속하게 처리합니다.",
    doctorNote: "위험목은 시한폭탄과 같습니다. 사고가 나기 전에 전문가의 진단을 받고 미리 제거하는 것이 가장 안전한 예방책입니다.",
    keyPoints: [
      "전문 장비를 활용한 신속하고 안전한 벌목",
      "주변 시설물 손상 방지를 위한 정밀 로핑 작업",
      "제거 후 근그루 제거 및 현장 깔끔 정리"
    ],
    images: [
      {
        src: "/images/technology/risk_tree_removal/before.jpg",
        tag: "Before",
        alt: "위험목 제거 전",
      },
      {
        src: "/images/technology/risk_tree_removal/after.jpg",
        tag: "After",
        alt: "위험목 제거 후",
      },
      {
        src: "/images/technology/risk_tree_removal/work.jpg",
        tag: "작업",
        alt: "제거 작업",
      },
    ],
  },
];
