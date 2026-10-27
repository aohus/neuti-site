// /pine-wilt (소나무재선충 현장진단) 페이지 문구·수치.
//
// 값이 null 인 필드는 아직 확정되지 않은 내용이다. 컴포넌트가 null 을 보고
// 대체 문구를 쓰거나 줄을 숨기므로, 확정 전 자리표시 문구를 여기에 넣지 않는다.
//
// 사실 표현 주의: 재선충병 감염 여부의 최종 판정과 미감염 확인증 발급은 관할 기관의 일이다.
// 저희 쪽 문장은 '1차 진단', '판별', '신고 안내'까지만 쓴다.

export const PINE_WILT_PHONE = '031-752-6000'
export const DIAGNOSIS_REQUEST_HREF = '/request?tab=diagnosis'

export interface ImageContent {
  src: string
  alt: string
}

export const pineWiltHero = {
  badge: '소나무재선충병 현장진단',
  titleLines: ['소나무가 갑자기 시들었다면,', '재선충부터 확인합니다'],
  description:
    '1종 나무병원의 나무의사가 현장에 나가 시료를 채취하고 1차 진단합니다. 의심되는 나무는 관할 기관의 확진 절차로, 아닌 경우는 실제 원인 진단과 처방으로 이어 드립니다.',
  primaryLabel: '현장진단 의뢰하기',
  checks: [
    '산림청 등록 1종 나무병원',
    '나무의사 직접 진단',
    '대모산·구룡산 예방나무주사 수행 (2026)'
  ],
  imageAlt:
    '대모산에서 두 작업자가 소나무 줄기에 천공하고 예방나무주사 약제를 주입하고 있다',
  seasonLabel: '방제기 집중 운영',
  seasonValue: '9월 - 이듬해 3월'
}

// 아래 수치는 산림청 집계 기준으로 연 1회(방제연도 마감 후) 갱신한다.
export interface WhyNowStat {
  value: string
  unit: string
  lines: string[]
  isHighlighted?: boolean
}

export interface WhyNowCard {
  badge: string
  title: string
  body: string
  link?: { label: string; href: string }
  tone: 'light' | 'dark'
}

export const pineWiltWhyNow = {
  label: 'WHY NOW',
  title: '수도권 피해가 빠르게 늘고 있습니다',
  stats: [
    {
      value: '98,677',
      unit: '그루',
      lines: [
        '경기도 피해 고사목 (2025-26 방제연도)',
        '전년 59,351그루 대비 약 66% 증가'
      ]
    },
    {
      value: '177',
      unit: '만 그루',
      lines: ['전국 피해 고사목 (같은 기간)', '발생 시·군·구 166곳']
    },
    {
      value: '2026. 1',
      unit: '',
      lines: ['서울 구룡산에서 감염 확인', '성남시와 맞닿은 지역입니다'],
      isHighlighted: true
    }
  ] as WhyNowStat[],
  cards: [
    {
      badge: '감염되면 되돌릴 수 없습니다',
      title: '걸리면 빠르게 고사합니다',
      body: '재선충은 나무 안에서 20일 만에 20만 마리 이상으로 늘어 물길을 막습니다. 감염된 소나무는 살리지 못하고 베어낼 수밖에 없습니다. 감염 전에 예방나무주사로 대비해야 하는 이유입니다.',
      link: { label: '예방나무주사 상담 →', href: DIAGNOSIS_REQUEST_HREF },
      tone: 'light'
    },
    {
      badge: '산림청 2026-2030 국가방제전략',
      title: '국가가 400km 방제벨트를 만듭니다',
      body: '산림청은 감염 확산의 최전선을 따라 폭 2km 이상의 띠를 두르고, 솎아베기·나무주사·수종 전환으로 확산을 막는 방제벨트를 구축할 계획입니다. 숲의 경계선은 국가가 막고, 단지·교정·공원의 소나무는 관리하는 곳에서 미리 대비해야 합니다.',
      tone: 'dark'
    }
  ] as WhyNowCard[],
  sources: [
    '산림청 집계(MTN 2026.10.14 보도)',
    '서울시 발표(2026.1.21)',
    '산림청 국가방제전략(한국경제 2026.7.23 보도)'
  ]
}

// 재선충 맥락에는 나무주사 사진만 쓴다. 살포(뿌리는 방제) 사진은 넣지 않는다.
export interface PreventionStep {
  number: string
  title: string
  body: string
  image?: ImageContent
  // 짙은 카드로 강조할 단계 (기록·보고)
  highlight?: boolean
  // 효과 지속기간·재접종 주기. 나무의사 확인 전에는 null 로 두고 줄을 숨긴다.
  note?: string | null
}

export const pineWiltPrevention = {
  label: 'PREVENTION',
  title: '예방나무주사는 이렇게 놓습니다',
  description:
    '재선충 예방은 뿌리는 방제가 아니라 줄기에 직접 넣는 나무주사입니다. 약제가 날리지 않아 단지·교정·공원에서도 작업할 수 있습니다.',
  steps: [
    {
      number: '01',
      title: '줄기 직경을 잽니다',
      body: '나무마다 흉고직경을 재서 그 나무에 맞는 약량을 정합니다.',
      image: {
        src: '/images/pine-wilt/daemosan-dbh-measure.jpg',
        alt: '느티나무병원 조끼를 입은 작업자가 직경자로 소나무 줄기 직경을 재고 있다'
      }
    },
    {
      number: '02',
      title: '줄기에 직접 주입합니다',
      body: '밑동에 작은 구멍을 내고 약제를 넣습니다. 약제는 물길을 타고 나무 전체로 퍼집니다.',
      image: {
        src: '/images/pine-wilt/daemosan-injection-gun.jpg',
        alt: '소나무 밑동에 낸 구멍에 주입기를 대고 약제를 넣고 있다'
      }
    },
    {
      number: '03',
      title: '시행목을 기록합니다',
      body: '나무마다 약제명·주입량·시행일을 표찰로 남기고, 작업 사진대지로 보고합니다.',
      image: {
        src: '/images/pine-wilt/daemosan-injection-tag.jpg',
        alt: '소나무 줄기에 붙인 예방주사 시행목 표찰. 시행일·약제명·주입량이 적혀 있다'
      },
      highlight: true,
      note: null
    }
  ] as PreventionStep[]
}

export const pineWiltSymptoms = {
  label: 'SYMPTOMS',
  title: '이런 모습이면 의심해 보세요',
  image: {
    src: '/images/pine-wilt/hadaewon-pine-browning.jpg',
    alt: '성남시 하대원동 행정복지센터 앞 소나무. 수관 하단과 측면 침엽이 갈변했다'
  },
  // 재선충 사례가 아니라는 점을 캡션에서 분명히 한다.
  caption:
    '성남 하대원동 소나무 갈변 현장. 진단 결과 재선충이 아니라 고온 스트레스와 2차 병해충이 원인이었습니다.',
  items: [
    '잎이 몇 주 사이에 나무 전체가 붉게 변합니다',
    '새 잎이 아래로 축 처집니다',
    '줄기에서 송진이 거의 나오지 않습니다',
    '소나무·곰솔·잣나무·섬잣나무입니다'
  ],
  notice:
    '잎이 갈색으로 변했다고 모두 재선충은 아닙니다. 원인이 다르면 처방도 다르기 때문에, 베기 전에 진단이 먼저입니다.'
}

export interface ProcessStep {
  title: string
  // 확정 전이면 null. 그때는 fallback 문구를 보여준다.
  body: string | null
  fallback?: string
}

export const pineWiltProcess = {
  label: 'PROCESS',
  title: '현장진단은 이렇게 진행됩니다',
  steps: [
    {
      title: '의뢰 접수',
      body: '전화나 온라인으로 위치와 사진을 보내 주시면 나무의사가 먼저 살펴봅니다.'
    },
    {
      title: '현장 확인·시료 채취',
      body: '나무의사가 현장에서 수관·줄기 상태를 보고 목편 시료를 채취합니다.'
    },
    {
      title: '현장 1차 진단',
      // 진단 방식(현장 검경, 진단키트 등)이 정해지면 그 방식을 넣은 문장으로 바꾼다.
      body: null,
      fallback: '나무의사가 현장에서 재선충 여부를 1차 판별합니다.'
    },
    {
      title: '결과 보고·후속 연결',
      body: '의심목은 관할 기관 신고와 확진 절차를 안내합니다. 아니라면 원인에 맞는 처방을 드립니다.'
    }
  ] as ProcessStep[]
}

export const pineWiltRole = {
  label: 'OUR ROLE',
  title: '나무병원 진단과 공식 확진은 다릅니다',
  description:
    '재선충병의 최종 판정은 법이 정한 기관이 합니다. 저희는 그 전 단계에서 의심목을 빠르게 가려내고, 확진 이후 방제까지 이어지도록 돕습니다.',
  ours: {
    title: '느티나무병원이 하는 일',
    items: [
      '의심목 현장 확인과 시료 채취',
      '현장 1차 진단과 결과 보고서',
      '관할 기관 신고 안내',
      '예방나무주사·수세 회복 등 후속 시공'
    ]
  },
  // 판정·확인증 발급은 이 칸에서만 쓴다.
  agency: {
    title: '관할 기관이 하는 일',
    items: [
      '감염 최종 판정 (국립산림과학원·시도 산림환경연구기관)',
      '반출금지구역 지정과 소나무류 이동 관리',
      '감염목 방제 명령',
      '미감염 확인증 발급'
    ]
  },
  lawNote:
    '「소나무재선충병 방제특별법」 제7조: 감염이 의심되는 소나무류를 발견한 사람은 인근 행정기관에 신고해야 합니다.'
}

export const pineWiltAudience = {
  label: 'FOR WHOM',
  title: '이런 경우 의뢰하세요',
  cards: [
    {
      title: '공공기관 녹지 담당',
      body: '관내 공원·가로수·청사 조경의 의심목을 신고 전에 1차로 선별하고, 결과를 보고 자료로 받아 보실 수 있습니다.'
    },
    {
      title: '학교·아파트 관리자',
      body: '단지 안 소나무가 갑자기 붉게 변했을 때, 재선충인지 다른 원인인지 먼저 확인해 불필요한 벌채를 막습니다.'
    },
    {
      title: '소나무 식재·관리 현장',
      body: '식재한 소나무에 하자가 생겼을 때 원인을 확인하고, 예방나무주사 계획까지 함께 세웁니다.'
    }
  ]
}

// 시공사례 id 는 DB 가 부여하므로 job_main 필터로 연결한다.
// 값은 backend/data/performances/*.md 의 job_main_category 와 같아야 한다.
export interface TrackRecordFeatured {
  meta: string
  title: string
  body: string
  // 시행 본수. 확정 전에는 null 로 두고 숨긴다.
  treeCount: string | null
  href: string
  image: ImageContent
}

export interface TrackRecordItem {
  meta: string
  title: string
  href: string
}

export const pineWiltTrackRecord = {
  label: 'TRACK RECORD',
  title: '가까운 현장에서 해온 일',
  linkLabel: '시공 사례 보기 →',
  featured: {
    meta: '2026 · 서울 강남구청',
    title: '대모산·구룡산 소나무재선충병 예방나무주사',
    body: '2026년 3월, 강남구청 발주로 대모산·구룡산 일대 소나무류에 예방나무주사를 놓고 시행목마다 표찰을 남겼습니다.',
    treeCount: null,
    // 시공사례 id 는 DB 가 부여하므로, 대모산 사례가 들어 있는 병해충방제 목록으로 보낸다.
    href: '/performance?job_main=병해충방제',
    image: {
      src: '/images/pine-wilt/daemosan-injection-tag.jpg',
      alt: '대모산 소나무에 붙은 표찰. 소나무재선충병 예방주사 시행목, 대모산 7소반, 2026년 3월, 에마멕틴벤조에이트 유제 2.15%, 주입량 30ml, 서울특별시 강남구청'
    }
  } as TrackRecordFeatured,
  items: [
    {
      meta: '2024 · 성남시청',
      title: '단대·양지공원 방제 예찰 및 효과분석',
      href: '/performance?job_main=병해충방제'
    },
    {
      meta: '2024 · 성남 하대원동',
      title: '하대원동 소나무 고사지 제거',
      href: '/performance?job_main=위험목제거'
    }
  ] as TrackRecordItem[]
}

export interface FaqItem {
  question: string
  // 답이 확정되지 않았으면 null. 그 항목은 통째로 숨긴다.
  answer: string | null
}

export const pineWiltFaq = {
  label: 'FAQ',
  title: '자주 묻는 질문',
  items: [
    {
      question: '진단 비용은 얼마인가요?',
      // 가격 정책이 정해지면 채운다.
      answer: null
    },
    {
      question: '나무병원 진단 결과로 확진이 되나요?',
      answer:
        '아닙니다. 최종 판정은 관할 기관이 합니다. 저희 결과는 신고 여부를 판단하고 후속 조치를 준비하는 근거 자료로 쓰입니다.'
    },
    {
      question: '감염이 의심되면 바로 베어야 하나요?',
      answer:
        '임의로 베거나 옮기면 안 됩니다. 감염목 처리는 관할 기관의 방제 지침에 따라야 하며, 무단 이동은 처벌 대상입니다.'
    },
    {
      question: '건강한 소나무는 예방할 수 있나요?',
      answer:
        '예방나무주사로 대비할 수 있습니다. 적기와 약제는 수종과 현장 여건에 따라 나무의사가 정합니다.'
    }
  ] as FaqItem[]
}

export const pineWiltCta = {
  title: '베기 전에, 먼저 진단부터',
  body: '사진 몇 장과 위치만 보내 주시면 나무의사가 확인하고 연락드립니다.',
  primaryLabel: '현장진단 의뢰하기'
}
