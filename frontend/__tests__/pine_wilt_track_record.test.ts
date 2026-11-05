import { resolveTrackRecord } from '@/components/pine-wilt/resolveTrackRecord'
import type { PerformanceFeedItem } from '@/lib/feed'
import type { TrackRecordFeatured, TrackRecordItem } from '@/data/pine-wilt-content'

function feedItem(id: number, sourceFile: string | null): PerformanceFeedItem {
  return {
    id,
    title: `사례 ${id}`,
    subtitle: null,
    thumbnail_url: null,
    job_main_category: null,
    summary: null,
    source_file: sourceFile,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  }
}

const featured: TrackRecordFeatured = {
  meta: '2026',
  title: '대모산',
  body: '본문',
  treeCount: null,
  sourceFile: '2026_대모산_구룡산_재선충_예방나무주사',
  href: '/performance?job_main=병해충방제',
  image: { src: '/a.jpg', alt: 'a' }
}

const items: TrackRecordItem[] = [
  { meta: '2025', title: '수정', sourceFile: '2025_수정_중원구', href: '/performance?job_main=병해충방제' },
  { meta: '2024', title: '고정 링크', href: '/performance?job_main=위험목제거' }
]

describe('resolveTrackRecord', () => {
  it('피드에서 sourceFile 이 같은 사례를 찾아 상세 페이지로 연결한다', () => {
    const feed = [feedItem(7, '2026_대모산_구룡산_재선충_예방나무주사'), feedItem(9, '2025_수정_중원구')]

    const result = resolveTrackRecord({ featured, items }, feed)

    expect(result.featured.href).toBe('/performance/7')
    expect(result.items.map((i) => i.href)).toEqual([
      '/performance/9',
      '/performance?job_main=위험목제거'
    ])
  })

  it('피드에 없으면(백엔드 장애 포함) 목록 필터 링크를 유지한다', () => {
    const result = resolveTrackRecord({ featured, items }, [])

    expect(result.featured.href).toBe('/performance?job_main=병해충방제')
    expect(result.items[0].href).toBe('/performance?job_main=병해충방제')
  })

  it('macOS NFD 로 저장된 파일명도 같은 사례로 본다', () => {
    const feed = [feedItem(7, featured.sourceFile!.normalize('NFD'))]

    expect(resolveTrackRecord({ featured, items }, feed).featured.href).toBe('/performance/7')
  })

  it('원본 데이터를 바꾸지 않는다', () => {
    resolveTrackRecord({ featured, items }, [feedItem(7, featured.sourceFile!)])

    expect(featured.href).toBe('/performance?job_main=병해충방제')
  })
})
