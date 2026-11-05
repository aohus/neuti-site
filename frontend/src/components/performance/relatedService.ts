import type { Performance } from '@/types/performance'

export interface RelatedService {
  href: string
  title: string
  body: string
}

const PINE_WILT_SERVICE: RelatedService = {
  href: '/pine-wilt',
  title: '소나무재선충 진단·방제, 예방나무주사',
  body: '소나무가 갑자기 시들었다면 재선충부터 확인합니다. 나무의사 현장 1차 진단과 예방나무주사 안내를 보세요.'
}

// 나무주사는 느티나무 등 다른 수종에도 놓으므로 소나무류일 때만 재선충 페이지로 잇는다.
const PINE_WILT = /재선충/
const TRUNK_INJECTION = /나무주사/
const PINE_SPECIES = /소나무|곰솔|잣나무/

/**
 * 사례와 같은 주제의 서비스 페이지. 서로 링크해야 검색엔진이 두 페이지를 같은 주제로 묶는다.
 * 제목·부제·세부 공종만 본다(본문은 '재선충이 아니었다' 같은 문장에도 걸리므로 제외).
 */
export function findRelatedService(
  p: Pick<Performance, 'title' | 'subtitle' | 'job_sub_category'>
): RelatedService | null {
  const text = [p.title, p.subtitle, p.job_sub_category].filter(Boolean).join(' ')
  const isPineWilt = PINE_WILT.test(text) || (TRUNK_INJECTION.test(text) && PINE_SPECIES.test(text))
  return isPineWilt ? PINE_WILT_SERVICE : null
}
