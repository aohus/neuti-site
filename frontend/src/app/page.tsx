'use client'

import React from 'react'
import MainCarousel from '@/components/common/MainCarousel'
import ClientLogos from '@/components/home/ClientLogos'
import WhyUs from '@/components/home/WhyUs'
import TechnologySection from '@/components/home/TechnologySection'
import RecentPortfolio from '@/components/home/RecentPortfolio'
import FinalCTA from '@/components/common/FinalCTA'

/**
 * 홈 섹션 순서. 바꾸면 `__tests__/index.test.tsx` 가 실패한다.
 *
 * 수의계약 안내는 상단 내비게이션과 Hero 버튼으로 충분하다. 홈 본문까지
 * 계약 이야기로 채우면 조경·수목관리 회사가 아니라 관공서 영업 페이지처럼 읽힌다.
 */
export default function Home() {
  return (
    <div className="home-page">
      {/* 1. Hero */}
      <MainCarousel />

      {/* 2. 함께 일한 발주처 — 로고 + 학교·행정복지센터까지 전체 */}
      <ClientLogos />

      {/* 3. 나무를 대하는 방식 */}
      <WhyUs />

      {/* 4. 기술력 탭 + 카테고리별 시공사례 */}
      <TechnologySection />

      {/* 5. 최근 시공사례 — 카테고리 무관 최신순 */}
      <RecentPortfolio />

      {/* 6. 문의 */}
      <FinalCTA
        buttons={[
          { label: '견적·상담 문의', href: '/request?tab=estimate', variant: 'primary' },
          { label: '수목 진단 의뢰', href: '/request', variant: 'secondary' },
        ]}
      />
    </div>
  )
}
