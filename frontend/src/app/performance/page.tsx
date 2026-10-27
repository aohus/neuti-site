import PerformanceList from '@/components/performance/PerformanceList'
import { serverFetch } from '@/lib/serverApi'
import type { Performance } from '@/types/performance'

// CI 의 docker build 에는 백엔드가 없다. 빌드 시점에 빈 목록으로 프리렌더되지 않도록
// 요청 시 렌더링하고, 백엔드 부하는 serverFetch 의 fetch 캐시(revalidate)가 흡수한다.
export const dynamic = 'force-dynamic'

const LIST_PATH = '/performance?limit=100'

async function loadInitialPerformances(): Promise<Performance[] | null> {
  try {
    return (await serverFetch<Performance[]>(LIST_PATH)) ?? []
  } catch (err) {
    console.error('Failed to load performances on the server', err)
    return null
  }
}

export default async function PerformancePage() {
  const initialPerformances = await loadInitialPerformances()
  return <PerformanceList initialPerformances={initialPerformances} />
}
