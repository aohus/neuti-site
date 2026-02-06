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
  images: TechnologyImage[];
}

export const heroImages: HeroImage[] = [
  {
    src: "/images/hero/신구대식물원_방제.jpg",
    alt: "신구대식물원 방제 작업",
  },
  {
    src: "/images/hero/정부청사_소나무전정.jpg",
    alt: "정부청사 소나무 전정 작업",
  },
];

export const technologyItems: TechnologyItem[] = [
  {
    id: "green_maintenance",
    title: "녹지관리",
    description: "체계적인 녹지 관리로 쾌적한 환경을 조성합니다.",
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
    description: "소나무의 수형을 아름답게 가꾸고 건강하게 관리합니다.",
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
    description: "계절에 맞는 꽃을 식재하여 다채로운 경관을 연출합니다.",
    images: [
      {
        src: "/images/technology/seasonal_flowers/대형화분봄.jpg",
        tag: "봄 식재",
        alt: "대형화분 봄 식재",
      },
      {
        src: "/images/technology/seasonal_flowers/대형화분가을.jpg",
        tag: "가을 식재",
        alt: "대형화분 가을 식재",
      },
      {
        src: "/images/technology/seasonal_flowers/거리화분.jpeg",
        tag: "거리화분",
        alt: "거리화분 식재",
      },
      {
        src: "/images/technology/seasonal_flowers/걸이화분.jpg",
        tag: "걸이화분",
        alt: "걸이화분 식재",
      },
      {
        src: "/images/technology/seasonal_flowers/디자인.jpeg",
        tag: "디자인",
        alt: "화단 디자인",
      },
    ],
  },
  {
    id: "landscape_planting",
    title: "조경식재",
    description: "주변 환경과 어우러지는 조경 식재를 시공합니다.",
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
    description: "정확한 진단과 방제로 수목을 건강하게 보호합니다.",
    images: [
      {
        src: "/images/technology/pest_control/해충예찰.jpg",
        tag: "해충예찰",
        alt: "해충 예찰",
      },
      {
        src: "/images/technology/pest_control/방제작업1.jpg",
        tag: "방제작업",
        alt: "방제 작업 1",
      },
      {
        src: "/images/technology/pest_control/방제작업2.jpg",
        tag: "방제작업",
        alt: "방제 작업 2",
      },
    ],
  },
  {
    id: "tree_recovery",
    title: "수목수세회복",
    description: "약해진 수목의 수세를 회복시키고 활력을 되찾아줍니다.",
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
        src: "/images/technology/tree_recovery/진단.jpg",
        tag: "진단",
        alt: "수목 진단",
      },
      {
        src: "/images/technology/tree_recovery/치료.jpg",
        tag: "치료",
        alt: "수목 치료",
      },
    ],
  },
  {
    id: "risk_tree_removal",
    title: "위험목 제거",
    description: "안전을 위협하는 위험목을 신속하고 안전하게 제거합니다.",
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
        src: "/images/technology/risk_tree_removal/작업.jpg",
        tag: "작업",
        alt: "제거 작업",
      },
    ],
  },
];
