import type { PerformanceFeedItem } from '@/lib/feed'
import type { TrackRecordFeatured, TrackRecordItem } from '@/data/pine-wilt-content'

export interface TrackRecord {
  featured: TrackRecordFeatured
  items: TrackRecordItem[]
}

const nfc = (s: string) => s.normalize('NFC')

/**
 * 실적 카드의 sourceFile 을 피드에서 찾아 시공사례 상세 링크(/performance/{id})로 바꾼다.
 * 상세로 바로 연결해야 두 페이지가 같은 주제로 서로를 밀어 준다.
 * 못 찾으면(백엔드 장애, md 삭제) 데이터에 적힌 목록 필터 링크를 그대로 쓴다.
 */
export function resolveTrackRecord(
  record: TrackRecord,
  feed: PerformanceFeedItem[]
): TrackRecord {
  const idBySource = new Map(
    feed
      .filter((p): p is PerformanceFeedItem & { source_file: string } => !!p.source_file)
      .map((p) => [nfc(p.source_file), p.id])
  )

  const resolve = <T extends { sourceFile?: string; href: string }>(card: T): T => {
    const id = card.sourceFile ? idBySource.get(nfc(card.sourceFile)) : undefined
    return id === undefined ? card : { ...card, href: `/performance/${id}` }
  }

  return { featured: resolve(record.featured), items: record.items.map(resolve) }
}
