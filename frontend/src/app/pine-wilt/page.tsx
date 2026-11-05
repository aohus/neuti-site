import React from 'react'
import PineWiltHero from '@/components/pine-wilt/PineWiltHero'
import WhyNowSection from '@/components/pine-wilt/WhyNowSection'
import PreventionSection from '@/components/pine-wilt/PreventionSection'
import SymptomsSection from '@/components/pine-wilt/SymptomsSection'
import ProcessSection from '@/components/pine-wilt/ProcessSection'
import RoleSection from '@/components/pine-wilt/RoleSection'
import AudienceSection from '@/components/pine-wilt/AudienceSection'
import TrackRecordSection from '@/components/pine-wilt/TrackRecordSection'
import FaqSection from '@/components/pine-wilt/FaqSection'
import PineWiltCTA from '@/components/pine-wilt/PineWiltCTA'
import { resolveTrackRecord } from '@/components/pine-wilt/resolveTrackRecord'
import {
  pineWiltBreadcrumbJsonLd,
  pineWiltServiceJsonLd
} from '@/components/pine-wilt/pineWiltJsonLd'
import { pineWiltTrackRecord } from '@/data/pine-wilt-content'
import { getPerformanceFeed } from '@/lib/feed'
import { serializeJsonLd } from '@/lib/structuredData'

// 실적 카드를 시공사례 상세로 잇기 위해 요청 시점에 피드를 읽는다.
// CI 빌드 때는 백엔드가 없어 목록 링크로 굳어 버리므로 프리렌더하지 않는다.
export const dynamic = 'force-dynamic'

/**
 * 소나무재선충 현장진단 — 검색어 '재선충'으로 들어온 방문자를 위한 서비스 페이지.
 * 왜 지금인가 → 예방 → 의심 징후 → 진단 절차 → 역할 구분 → 대상 → 실적 → FAQ → 의뢰 순으로 답한다.
 */
export default async function PineWiltPage() {
  const trackRecord = resolveTrackRecord(pineWiltTrackRecord, await getPerformanceFeed())

  return (
    <div className="overflow-x-clip bg-white">
      {[pineWiltServiceJsonLd(), pineWiltBreadcrumbJsonLd()].map((data) => (
        <script
          key={data['@type']}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
        />
      ))}
      <PineWiltHero />
      <WhyNowSection />
      <PreventionSection />
      <SymptomsSection />
      <ProcessSection />
      <RoleSection />
      <AudienceSection />
      <TrackRecordSection featured={trackRecord.featured} items={trackRecord.items} />
      <FaqSection />
      <PineWiltCTA />
    </div>
  )
}
