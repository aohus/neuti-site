import { cache } from 'react'
import { serverFetch } from '@/lib/serverApi'
import type { Performance } from '@/types/performance'

/** 숫자가 아닌 id 는 백엔드를 부르기 전에 걸러낸다. */
export function parseId(raw: string): number | null {
  return /^[1-9]\d*$/.test(raw) ? Number(raw) : null
}

/** 한 요청 안에서 generateMetadata 와 page 가 같은 fetch 를 공유한다. */
export const loadPerformance = cache(async (id: number): Promise<Performance | null> =>
  serverFetch<Performance>(`/performance/${id}`)
)
