/**
 * 홈 메인 사진 하단 "지금 많이 찾는 서비스" 패널 항목.
 *
 * 앞의 두 칸은 사진이 붙는 큰 카드, 뒤의 두 칸은 텍스트 링크다.
 * 재선충처럼 계절을 타는 항목은 시즌이 지나면 이 파일만 고쳐 교체한다.
 */

export type FeaturedTone = 'amber' | 'green'

export interface FeaturedService {
  href: string
  title: string
  /** 데스크톱 카드 상단 칩. 모바일에서는 숨긴다. */
  chip: string
  desc: string
  /** 모바일은 칩이 없어서 필요하면 칩 내용을 설명에 합쳐 적는다. */
  mobileDesc: string
  image: string
  tone: FeaturedTone
}

export interface QuickLink {
  href: string
  label: string
  /** 모바일 2열 버튼에 들어가는 짧은 이름 */
  shortLabel: string
  icon: 'contract' | 'inquiry'
}

export const featuredServices: FeaturedService[] = [
  {
    href: '/pine-wilt',
    title: '소나무재선충 현장진단',
    chip: '방제기 9월-3월',
    desc: '소나무가 갑자기 시들었다면 먼저 확인',
    mobileDesc: '방제기 9월-3월 · 시들었다면 먼저 확인',
    image: '/images/pine-wilt/daemosan-drill-inject.jpg',
    tone: 'amber',
  },
  {
    href: '/school',
    title: '학교 방제·연간관리',
    chip: '학교',
    desc: '나무의사 예찰·처방부터 방제까지',
    mobileDesc: '나무의사 예찰·처방부터 방제까지',
    image: '/images/school/sudo-girls-canopy-spray.jpg',
    tone: 'green',
  },
]

export const quickLinks: QuickLink[] = [
  {
    href: '/contract',
    label: '관공서 수의계약 견적',
    shortLabel: '관공서 수의계약',
    icon: 'contract',
  },
  {
    href: '/request',
    label: '그 밖의 나무·조경 문의',
    shortLabel: '그 밖의 문의',
    icon: 'inquiry',
  },
]
