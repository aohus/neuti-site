// /pine-wilt (소나무재선충 현장진단) 페이지 문구·수치.
//
// 값이 null 인 필드는 아직 확정되지 않은 내용이다. 컴포넌트가 null 을 보고
// 대체 문구를 쓰거나 줄을 숨기므로, 확정 전 자리표시 문구를 여기에 넣지 않는다.
//
// 사실 표현 주의: 재선충병 감염 여부의 최종 판정과 미감염 확인증 발급은 관할 기관의 일이다.
// 저희 쪽 문장은 '1차 진단', '판별', '신고 안내'까지만 쓴다.

import type { OgImage } from '@/lib/seo'

export const PINE_WILT_PHONE = '031-752-6000'
export const DIAGNOSIS_REQUEST_HREF = '/request?tab=diagnosis'
export const PINE_WILT_PATH = '/pine-wilt'

export interface ImageContent {
  src: string
  alt: string
}

// 메타데이터·JSON-LD 가 함께 쓴다. '소나무재선충·재선충·방제·나무주사·소나무' 로 검색해도
// 들어오도록 제목·설명에 그 낱말을 모두 담는다.
export const pineWiltSeo = {
  title: '소나무재선충 예방나무주사, 진단·방제',
  description:
    '소나무가 갑자기 갈변했다면 재선충부터 확인하세요. 산림청 등록 1종 나무병원의 나무의사가 소나무재선충병을 현장에서 1차 진단하고, 관할 기관 신고 안내부터 재선충 예방나무주사·방제까지 이어 드립니다. 서울·경기·인천 수도권의 공원·학교·아파트 소나무.',
  ogDescription:
    '재선충 예방나무주사와 방제 · 나무의사 현장 1차 진단 · 관할 기관 신고 안내. 예방나무주사·현장진단 문의 031-752-6000.',
  keywords: [
    '소나무재선충',
    '소나무재선충병',
    '재선충',
    '재선충 방제',
    '소나무재선충 방제',
    '재선충 예방주사',
    '예방나무주사',
    '나무주사',
    '소나무 나무주사',
    '소나무 방제',
    '소나무 갈변',
    '소나무재선충병 진단',
    '재선충 나무병원',
    '수도권 나무병원',
    '성남 나무병원',
    '나무의사'
  ],
  image: {
    url: '/images/pine-wilt/og-pine-wilt.jpg',
    width: 1200,
    height: 630,
    alt: '대모산에서 느티나무병원 작업자들이 소나무 줄기에 천공하고 재선충 예방나무주사를 놓고 있다'
  } as OgImage
}

export const pineWiltHero = {
  badge: '소나무재선충병 예방나무주사·현장진단',
  titleLines: ['소나무가 갑자기 시들었다면,', '재선충부터 확인합니다'],
  description:
    '1종 나무병원의 나무의사가 현장에 나가 시료를 채취하고 1차 진단합니다. 의심되는 나무는 관할 기관의 확진 절차로, 아닌 경우는 실제 원인 진단과 처방으로 이어 드립니다. 건강한 소나무에는 재선충 예방나무주사를 놓습니다.',
  primaryLabel: '예방나무주사/현장진단 의뢰하기',
  checks: [
    '산림청 등록 1종 나무병원',
    '나무의사 직접 진단',
    '대모산·구룡산(2026), 수정·중원구(2025) 예방나무주사'
  ],
  imageAlt:
    '대모산에서 두 작업자가 소나무 줄기에 천공하고 예방나무주사 약제를 주입하고 있다',
  seasonLabel: '방제기 집중 운영',
  seasonValue: '11월 - 이듬해 3월'
}

// 수치는 출처·기준일이 있는 것만 쓴다. 성남 반출금지구역 수치·지도는 산림청
// 반출금지구역관리정보(2026.07.01 기준)에서 뽑은 것이다.
// 지정 현황이 바뀌면 지도 이미지(seongnam-quarantine-map.jpg)와 아래 값을 함께 갱신한다.
export interface WhyNowKpi {
  value: string
  label: string
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
  title: '소나무재선충병이 서울까지 번졌습니다',
  // 전국 추이는 배경으로만 쓰고, 카드는 서울 → 경기 → 성남 순으로 좁혀 간다.
  description:
    '전국 피해목은 2022년 38만 그루에서 2026년 177만 그루로 늘었습니다. 산림청은 2007년·2014년에 이은 ‘3차 대발생’으로 보고 있습니다.',
  kpis: [
    {
      value: '서울 18배',
      label: '2026년 감염목 74주, 전년 4주 대비',
      isHighlighted: true
    },
    { value: '경기 +66%', label: '피해목 9만 8,677그루 (2026 방제연도)' },
    { value: '성남 전역', label: '50개 동 전체 소나무류 반출금지구역' }
  ] as WhyNowKpi[],
  map: {
    src: '/images/pine-wilt/seongnam-quarantine-map.jpg',
    width: 1200,
    height: 1429,
    alt: '성남시와 접경 8개 시·구의 소나무재선충병 반출금지구역 지도. 최초 지정 연도별로 색을 나눴다. 성남시 전역과 광주시·과천시·하남시 대부분이 지정되어 있다. 2006년 12월 광주 중대동에서 권역 최초로 지정된 뒤, 2012년 4월 성남 야탑·서현동, 2026년 5월 의왕 청계동, 2026년 7월 강동구 강일동까지 지정이 넓어졌다.',
    caption: '성남 일대 반출금지구역 (최초 지정 연도별)'
  },
  cards: [
    {
      badge: '치료 불가',
      title: '걸리면 빠르게 고사합니다',
      body: '감염된 소나무는 살리지 못하고 베어내야 합니다. 감염 전에 예방나무주사로 대비하세요.',
      link: { label: '예방나무주사 상담 →', href: DIAGNOSIS_REQUEST_HREF },
      tone: 'light'
    },
    {
      badge: '산림청 국가방제전략',
      title: '국가가 400km 방제벨트를 만듭니다',
      body: '숲의 경계선은 국가가 막습니다. 단지·교정·공원의 소나무는 관리하는 곳에서 대비해야 합니다.',
      tone: 'dark'
    }
  ] as WhyNowCard[],
  sources: [
    '산림청 「산림병해충방제 소나무이동 반출금지구역관리정보」(2026.07.01)',
    '산림청 2026 방제연도 집계(MTN 2026.10.14 보도)',
    '서울시 발표(2026.10)',
    '산림청 발생 추이(노컷뉴스 보도)',
    '산림청 3차 대발생 진단(코리아데일리 보도)',
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
    '소나무재선충 예방 방제는 뿌리는 방제가 아니라 줄기에 직접 넣는 나무주사입니다. 약제가 날리지 않아 단지·교정·공원의 소나무에도 작업할 수 있습니다.',
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
      body: '밑동에 작은 구멍을 내고 약제를 넣습니다. 약제는 물길을 타고 소나무 전체로 퍼집니다.',
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
    src: '/images/pine-wilt/gachon-infected-pine.jpg',
    alt: '재선충병에 걸린 소나무를 아래에서 올려다본 모습. 주변 활엽수는 푸른데 소나무 수관만 붉게 말랐다'
  },
  caption:
    '재선충병에 걸린 소나무. 몇 주 사이에 수관 전체의 잎이 붉게 말랐습니다.',
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
  // 절차 카드 아래에 시료 채취 → PCR 진단 순서로 놓는 현장 사진
  photos: [
    {
      src: '/images/pine-wilt/gachon-sample-drill.jpg',
      alt: '나무의사가 전동 드릴로 소나무 줄기에 구멍을 내고, 옆 사람이 비닐봉투로 목편 시료를 받고 있다',
      caption: '줄기에서 목편 시료 채취'
    },
    {
      src: '/images/pine-wilt/gachon-pcr-pipette.jpg',
      alt: '장갑 낀 손으로 시료 추출액을 피펫으로 PCR 튜브에 나눠 담고 있다',
      caption: '시료를 PCR 튜브에 분주'
    },
    {
      src: '/images/pine-wilt/gachon-pcr-cycler.jpg',
      alt: 'PCR 장비 화면에 소나무 재선충 진단 프로그램(pinetree.txt)의 온도 단계가 떠 있다',
      caption: 'PCR 장비로 재선충 유전자 확인'
    }
  ] as (ImageContent & { caption: string })[],
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
      body: '채취한 목편을 PCR 분자진단 장비에 넣어 재선충 유전자가 있는지 1차 판별합니다.',
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
      '예방나무주사·수세 회복 등 후속 방제'
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

// 시공사례 id 는 DB 가 부여하므로 md 파일명(sourceFile)으로 적어 두고, 페이지가 요청 시점에
// 피드에서 id 를 찾아 상세 링크로 바꾼다(resolveTrackRecord). 못 찾으면 href(목록 필터)로 보낸다.
// sourceFile 은 backend/data/performances/*.md 의 파일명(확장자 제외)과 같아야 한다.
export interface TrackRecordFeatured {
  meta: string
  title: string
  body: string
  // 시행 본수. 확정 전에는 null 로 두고 숨긴다.
  treeCount: string | null
  sourceFile?: string
  href: string
  image: ImageContent
}

export interface TrackRecordItem {
  meta: string
  title: string
  body?: string
  sourceFile?: string
  href: string
}

export const pineWiltTrackRecord = {
  label: 'TRACK RECORD',
  // 재선충 실적만 싣는다(2026-11 기준 예방나무주사 2건). 일반 방제·고사목 제거는 넣지 않는다.
  title: '가까운 현장에서 해온 재선충 예방나무주사',
  linkLabel: '시공 사례 보기 →',
  featured: {
    meta: '2026 · 서울 강남구청',
    title: '대모산·구룡산 소나무재선충병 예방나무주사',
    body: '2026년 3월, 강남구청 발주로 대모산·구룡산 일대 소나무류에 예방나무주사를 놓고 시행목마다 표찰을 남겼습니다.',
    treeCount: null,
    sourceFile: '2026_대모산_구룡산_재선충_예방나무주사',
    href: '/performance?job_main=병해충방제',
    image: {
      src: '/images/pine-wilt/daemosan-injection-tag.jpg',
      alt: '대모산 소나무에 붙은 표찰. 소나무재선충병 예방주사 시행목, 대모산 7소반, 2026년 3월, 에마멕틴벤조에이트 유제 2.15%, 주입량 30ml, 서울특별시 강남구청'
    }
  } as TrackRecordFeatured,
  items: [
    {
      meta: '2025 · 성남시청',
      title: '수정·중원구 공원 소나무재선충병 예방나무주사',
      body: '2025년 11월, 성남시청 발주로 수정·중원구 공원 소나무류를 구역도로 나누고 흉고직경별 약량을 맞춰 예방나무주사를 놓았습니다.',
      sourceFile: '2025_수정_중원구_산림_돌발해충_방제',
      href: '/performance?job_main=병해충방제'
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
  primaryLabel: '예방나무주사/현장진단 의뢰하기'
}
