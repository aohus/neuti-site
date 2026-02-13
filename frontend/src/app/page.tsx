'use client'

import React from 'react'
import MainCarousel from '@/components/common/MainCarousel'
import ClientLogos from '@/components/home/ClientLogos'
import TechnologySection from '@/components/home/TechnologySection'
import FinalCTA from '@/components/common/FinalCTA'

export default function Home() {
  return (
    <div className="home-page">
      {/* 1. Hero — 사진 배경, 고정 */}
      <MainCarousel />

      {/* 2. 우리의 고객 — CI 그리드 */}
      <ClientLogos />

      {/* 3. 기술력 탭 + 시공사례 */}
      <TechnologySection />

      {/* 4. CTA */}
      <FinalCTA
        buttons={[
          { label: '수의계약 견적 요청', href: '/contract', variant: 'primary' },
          { label: '수목 진단 의뢰', href: '/request', variant: 'secondary' },
        ]}
      />
    </div>
  )
}
