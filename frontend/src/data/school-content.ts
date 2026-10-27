/**
 * 학교 수목관리·병해충 방제 페이지(/school) 문구와 데이터.
 *
 * 가드레일 (README 2026-10-homepage-promo §5)
 * - 학교 실적 횟수·학교 수 같은 집계 숫자는 노출하지 않는다. 작업 방식과 나무의사 역할로 어필한다.
 * - 견적 금액·작업 횟수처럼 확정되지 않은 값은 null 로 두고, 화면에서는 "현장 확인 후 견적"으로 보여 준다.
 * - 함께한 학교 목록은 contract-projects.ts 에서 파생한다. 여기서 학교 이름을 따로 적지 않는다.
 */
import { contractProjects, type ContractProject } from './contract-projects'

export const SCHOOL_PHONE = '031-752-6000'
export const SCHOOL_ESTIMATE_HREF = '/request?tab=estimate'

/** 견적 기준·횟수가 정해지지 않은 항목의 표시 문구 */
export const PRICE_FALLBACK = '현장 확인 후 견적'

export const schoolHero = {
  badge: '학교 수목관리 · 병해충 방제',
  titleLines: ['학생이 없는 날,', '교정의 나무를 돌봅니다'],
  description:
    '병해충 방제부터 화단·수목 연간관리까지. 수업에 지장 없는 날짜로 작업하고, 행정실에 필요한 서류까지 함께 챙깁니다.',
  primaryCta: { label: '내년도 연간관리 상담', href: SCHOOL_ESTIMATE_HREF },
  chips: [
    { title: '나무의사 방문', desc: '교정 직접 예찰', highlight: false },
    {
      title: '처방부터 방제까지',
      desc: '1종 나무병원이 한 번에',
      highlight: false
    },
    { title: '서류까지', desc: '사진대지·완료보고 제출', highlight: true }
  ],
  image: {
    alt: '수도여자고등학교 교정에서 방제복을 입은 작업자가 소나무 수관 상부로 약액을 살포하고 있다'
  },
  overlay: {
    meta: '수도여고 · 2026. 5. 5 공휴일',
    title: '교정 전역 하루 만에 완료'
  }
}

export const treeDoctor = {
  label: 'TREE DOCTOR',
  titleLines: ['학교 나무 방제도', '나무의사의 진단·처방이 먼저입니다'],
  law: {
    title: '산림보호법 — 생활권 수목진료',
    body: '아파트·학교 등 생활권 수목의 진단·처방은 나무병원으로 등록한 곳만 할 수 있습니다.'
  },
  steps: [
    {
      step: '01 · 나무의사',
      title: '방문 예찰',
      desc: '나무의사가 교정을 직접 돌며 수종별 상태와 해충 발생을 살핍니다.',
      highlight: false
    },
    {
      step: '02 · 나무의사',
      title: '진단',
      desc: '무엇이, 어느 나무에, 얼마나 발생했는지 원인을 판단합니다.',
      highlight: false
    },
    {
      step: '03 · 나무의사',
      title: '처방',
      desc: '약제와 시기, 횟수를 정합니다. 필요한 만큼만 뿌리도록 처방합니다.',
      highlight: false
    },
    {
      step: '04 · 같은 나무병원',
      title: '방제 시공',
      desc: '처방한 팀이 그대로 방제까지 합니다. 처방 따로, 방제 따로 맡기지 않아도 됩니다.',
      highlight: true
    }
  ]
}

export type SchoolFirstIcon = 'calendar' | 'shield' | 'leaf' | 'document'

export const schoolFirst = {
  label: 'SCHOOL FIRST',
  title: '학교라서 다르게 일합니다',
  cards: [
    {
      icon: 'calendar' as SchoolFirstIcon,
      title: '날짜부터 정합니다',
      desc: '수관 살포는 학생이 있는 동안 할 수 없습니다. 주말·공휴일·방학으로 일정을 잡아 학생이 없는 날 작업합니다.'
    },
    {
      icon: 'shield' as SchoolFirstIcon,
      title: '나무의사가 직접 갑니다',
      desc: '사진만 보고 약을 정하지 않습니다. 방제 전에 나무의사가 교정을 둘러보고 대상 나무를 정합니다.'
    },
    {
      icon: 'leaf' as SchoolFirstIcon,
      title: '처방한 팀이 방제합니다',
      desc: '처방과 시공을 한 나무병원이 맡아 약제·시기·횟수가 현장에서 어긋나지 않습니다. 적기를 맞추면 덜 뿌리고도 잡힙니다.'
    },
    {
      icon: 'document' as SchoolFirstIcon,
      title: '서류까지 챙깁니다',
      desc: '작업 사진대지와 완료보고를 함께 드려 행정실 정산 업무가 줄어듭니다.'
    }
  ],
  photos: [
    {
      src: '/images/business/tree-hospital-1.jpg',
      alt: '나무의사가 소나무 밑동을 살피며 수목 상태를 확인하고 있다',
      caption: '나무의사 현장 예찰'
    },
    {
      src: '/images/school/sudo-girls-spray-truck.jpg',
      alt: '수도여고 회랑 옆에 1톤 방제차량을 세우고 작업자가 호스를 끌어 생울타리에 약액을 살포하고 있다',
      caption: '수도여고 — 1톤 방제차량 거점 작업으로 교정 전역을 하루에'
    }
  ]
}

/** 학교 회계연도 순서 (3월 시작, 이듬해 2월 종료) */
export const FISCAL_MONTHS = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2] as const
export type CalendarMonth = (typeof FISCAL_MONTHS)[number]

export type CalendarTone =
  | 'pest'
  | 'weed'
  | 'flower'
  | 'prune'
  | 'survey'
  | 'budget'

export type CalendarBar = {
  label: string
  /** 시작 월 (달력상 월, 1-12) */
  from: CalendarMonth
  /** 끝 월 (포함) */
  to: CalendarMonth
  tone: CalendarTone
}

export type CalendarRow = {
  label: string
  bars: CalendarBar[]
  highlight?: boolean
}

const CALENDAR_ROWS: CalendarRow[] = [
  {
    label: '병해충 방제',
    bars: [
      { label: '봄 방제', from: 4, to: 5, tone: 'pest' },
      { label: '여름 방제', from: 6, to: 7, tone: 'pest' }
    ]
  },
  {
    label: '제초·예초',
    bars: [{ label: '생육기 정기 작업', from: 5, to: 9, tone: 'weed' }]
  },
  {
    label: '화단 관리',
    bars: [
      { label: '봄꽃 식재', from: 3, to: 4, tone: 'flower' },
      { label: '가을꽃 식재', from: 9, to: 10, tone: 'flower' }
    ]
  },
  {
    label: '전정',
    bars: [{ label: '휴면기 전정 (겨울방학)', from: 11, to: 2, tone: 'prune' }]
  },
  {
    label: '나무의사 예찰',
    bars: [
      {
        label: '작업 전 예찰·처방 · 작업마다 사진대지 보고',
        from: 3,
        to: 2,
        tone: 'survey'
      }
    ]
  },
  {
    label: '내년도 예산',
    highlight: true,
    bars: [{ label: '편성·심의 — 상담 적기', from: 12, to: 2, tone: 'budget' }]
  }
]

export const annualPlan = {
  label: 'ANNUAL PLAN',
  title: '학교 회계연도에 맞춘 1년',
  aside: '3월에 시작해 이듬해 2월에 끝납니다',
  footnote: '학교 여건에 따라 조정됩니다',
  rows: CALENDAR_ROWS
}

/** 회계연도 안에서 몇 번째 달인지 (3월 = 0) */
export function fiscalIndex(month: CalendarMonth): number {
  return FISCAL_MONTHS.indexOf(month)
}

export type PlanItem = {
  text: string
  /** 작업 횟수. null 이면 아직 정하지 않은 값이라 "현장 확인 후 견적"으로 표시한다. */
  count?: string | null
}

export type SchoolPlan = {
  name: string
  target: string
  items: PlanItem[]
  /** 견적 기준. null 이면 "현장 확인 후 견적" */
  price: string | null
  featured?: boolean
  badge?: string
}

const SCHOOL_PLANS: SchoolPlan[] = [
  {
    name: '병해충 방제',
    target: '방제만 필요한 학교',
    items: [
      { text: '봄·여름 수관·관목 살포', count: null },
      { text: '나무의사 예찰·처방 포함' },
      { text: '작업 사진대지' }
    ],
    price: null
  },
  {
    name: '화단 관리',
    target: '교문·통학로 화단이 중요한 학교',
    items: [
      { text: '봄·가을 계절꽃 식재' },
      { text: '화단 제초·관수 관리' },
      { text: '작업 사진대지' }
    ],
    price: null
  },
  {
    name: '연간 통합관리',
    target: '한 업체에 1년을 맡기는 학교',
    badge: '행정실 업무가 가장 줄어드는 선택',
    featured: true,
    items: [
      { text: '방제 + 화단 + 제초·예초 + 전정' },
      { text: '나무의사 정기 예찰과 필요 작업 제안' },
      { text: '계약 1건으로 1년 일정 관리' }
    ],
    price: null
  }
]

export const plans = {
  label: 'PLANS',
  title: '학교 예산에 맞춰 고르세요',
  items: SCHOOL_PLANS
}

export const paperwork = {
  label: 'PAPERWORK',
  titleLines: ['행정실 담당자께', '드리는 서류'],
  description:
    '계약부터 정산까지 필요한 서류를 먼저 챙겨 드립니다. 여성기업 확인서를 보유하고 있습니다.',
  items: [
    { phase: '계약 전', title: '견적서' },
    { phase: '계약 전', title: '나무병원 등록증 · 여성기업 확인서' },
    { phase: '계약 전', title: '학교 실적증명서' },
    { phase: '작업 후', title: '작업 사진대지 · 완료보고' }
  ]
}

export type SchoolCase = {
  title: string
  image: string
  alt: string
  chips: { label: string; dark?: boolean }[]
  href: string
  /** 사진 크롭 기준 (object-position) */
  focus?: 'top' | 'center'
}

const SCHOOL_CASES: SchoolCase[] = [
  {
    title: '늘푸른초등학교 화단조성·수목관리·방제',
    image: '/images/school/neulpureun-cherry-spray.jpg',
    alt: '늘푸른초등학교 운동장 펜스 옆 벚나무 수관으로 약액을 살포하는 작업자',
    chips: [
      { label: '연간관리', dark: true },
      { label: '다시 맡겨 주신 학교' }
    ],
    href: '/performance?job_main=병해충방제',
    focus: 'top'
  },
  {
    title: '수도여자고등학교 수목 병해충 방제',
    image: '/images/school/sudo-girls-canopy-spray.jpg',
    alt: '수도여고 교정 소나무 수관 상부 살포',
    chips: [{ label: '병해충 방제 · 2026' }],
    href: '/performance?job_main=병해충방제',
    focus: 'center'
  }
]

export const schoolCases = {
  label: 'SCHOOLS',
  title: '함께한 학교',
  moreLink: { label: '학교 시공 사례 모아보기', href: '/performance' },
  cases: SCHOOL_CASES
}

export const schoolCta = {
  badge: '학교회계는 3월에 시작합니다',
  titleLines: ['내년도 예산 편성 전에', '상담받아 보세요'],
  description:
    '교정을 한 번 둘러보고, 학교 예산에 맞는 연간 계획과 견적을 드립니다.',
  primaryCta: { label: '연간관리 상담 신청', href: SCHOOL_ESTIMATE_HREF }
}

/**
 * 발주처가 초·중·고등학교인지.
 * 학교명 끝이 "초등학교/중학교/고등학교"(여자고등학교 포함) 또는 약칭 "여중/여고"인 경우만 본다.
 * 대학교 부속시설(신구대학교 식물원)·교육지원청·어린이집은 학교 고객으로 보지 않는다.
 */
const SCHOOL_CLIENT = /(?:초등|중|고등)학교$|여[중고]$/

export function isSchoolClient(client: string): boolean {
  return SCHOOL_CLIENT.test(client.trim())
}

export type SchoolClient = {
  name: string
  /** 함께한 연도 (최신순, 중복 제거) */
  years: string[]
}

/** 실적 원장에서 학교 발주처만 골라 학교별로 묶는다. 최근 연도 순 → 이름 순. */
export function getSchoolClients(
  source: Record<string, ContractProject[]> = contractProjects
): SchoolClient[] {
  const yearsBySchool = Object.values(source)
    .flat()
    .filter((project) => isSchoolClient(project.client))
    .reduce<Map<string, Set<string>>>((acc, project) => {
      const name = project.client.trim()
      const years = new Set(acc.get(name) ?? [])
      years.add(project.year)
      return new Map(acc).set(name, years)
    }, new Map())

  return Array.from(yearsBySchool, ([name, years]) => ({
    name,
    years: Array.from(years).sort((a, b) => b.localeCompare(a))
  })).sort(
    (a, b) =>
      b.years[0].localeCompare(a.years[0]) || a.name.localeCompare(b.name, 'ko')
  )
}
