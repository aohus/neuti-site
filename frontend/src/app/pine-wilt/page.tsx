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

/**
 * 소나무재선충 현장진단 — 검색어 '재선충'으로 들어온 방문자를 위한 서비스 페이지.
 * 왜 지금인가 → 예방 → 의심 징후 → 진단 절차 → 역할 구분 → 대상 → 실적 → FAQ → 의뢰 순으로 답한다.
 */
export default function PineWiltPage() {
  return (
    <div className="overflow-x-clip bg-white">
      <PineWiltHero />
      <WhyNowSection />
      <PreventionSection />
      <SymptomsSection />
      <ProcessSection />
      <RoleSection />
      <AudienceSection />
      <TrackRecordSection />
      <FaqSection />
      <PineWiltCTA />
    </div>
  )
}
