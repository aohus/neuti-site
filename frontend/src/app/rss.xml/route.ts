import { getNotices, getPerformanceFeed } from '@/lib/feed'
import { buildRssXml, collectRssItems } from '@/lib/rss'

// 빌드(CI) 시점에는 백엔드에 닿지 않으므로 요청 시점에 만든다.
export const dynamic = 'force-dynamic'

export async function GET() {
  const [performances, notices] = await Promise.all([getPerformanceFeed(), getNotices()])
  return new Response(buildRssXml(collectRssItems(performances, notices)), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=600',
    },
  })
}
