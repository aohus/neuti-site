import { serverFetch } from '@/lib/serverApi'
import type { Performance } from '@/types/performance'
import type { TechnologyItemData } from '@/lib/technologyApi'

/** 홈에 노출할 최신 시공사례 수. 3열 그리드가 두 줄로 떨어지는 값. */
export const RECENT_PORTFOLIO_LIMIT = 6

/** 상대 경로(/uploads/...)만 남긴다. 클라이언트 performanceApi 와 같은 규칙. */
function normalizeUrl(url: string | null | undefined) {
  if (!url) return url
  if (url.startsWith('http')) return url
  return url.startsWith('/') ? url : `/${url}`
}

/** 최근 시공사례. 실패하면 로그만 남기고 빈 목록(섹션 생략). */
export async function loadRecentPerformances(): Promise<Performance[]> {
  try {
    const data = await serverFetch<Performance[]>(
      `/performance?skip=0&limit=${RECENT_PORTFOLIO_LIMIT}`
    )
    if (!Array.isArray(data)) return []
    return data.map((p) => ({ ...p, thumbnail_url: normalizeUrl(p.thumbnail_url) }) as Performance)
  } catch (err) {
    console.error('Failed to load recent performances', err)
    return []
  }
}

/** 기술력 항목. 실패하면 로그만 남기고 빈 목록(정적 폴백 사용). */
export async function loadTechnologyItems(): Promise<TechnologyItemData[]> {
  try {
    const data = await serverFetch<TechnologyItemData[]>('/technology-item')
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.error('Failed to load technology items', err)
    return []
  }
}
