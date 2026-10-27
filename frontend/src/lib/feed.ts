// sitemap·RSS 가 공유하는 백엔드 목록. 실패해도 페이지는 살려야 하므로 빈 배열로 내려가되 반드시 로그를 남긴다.
import { serverFetch } from '@/lib/serverApi'

/** GET /api/v1/performance/feed — content 를 뺀 경량 목록 */
export interface PerformanceFeedItem {
  id: number
  title: string
  subtitle: string | null
  thumbnail_url: string | null
  job_main_category: string | null
  summary: string | null
  created_at: string
  updated_at: string
}

export interface NoticeFeedItem {
  id: number
  title: string
  content: string
  created_at: string
}

const FEED_LIMIT = 500
const FEED_REVALIDATE_SECONDS = 600

async function fetchList<T>(path: string): Promise<T[]> {
  try {
    const data = await serverFetch<T[]>(path, { revalidate: FEED_REVALIDATE_SECONDS })
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error(`[feed] ${path} 조회 실패`, error)
    return []
  }
}

export function getPerformanceFeed(): Promise<PerformanceFeedItem[]> {
  return fetchList<PerformanceFeedItem>(`/performance/feed?limit=${FEED_LIMIT}`)
}

export function getNotices(): Promise<NoticeFeedItem[]> {
  return fetchList<NoticeFeedItem>(`/notice?limit=${FEED_LIMIT}`)
}
