'use client'

import React from 'react'
import MainCarousel from '@/components/common/MainCarousel'
import ClientBanner from '@/components/common/ClientBanner'
import StatisticsDashboard from '@/components/home/StatisticsDashboard'
import TargetCTA from '@/components/home/TargetCTA'
import ProcessFlow from '@/components/home/ProcessFlow'
import ImpactGallery from '@/components/home/ImpactGallery'
import { MissionSection } from '@/components/common/HomeSections'
import LatestUpdates from '@/components/common/LatestUpdates'

export default function Home() {
  return (
    <div className="home-page">
      {/* 1. Hero Section - 강렬한 첫인상 */}
      <MainCarousel />
      
      {/* 2. Trust Building - 공공기관 로고와 수치로 신뢰 구축 */}
      <ClientBanner />
      <StatisticsDashboard />
      
      {/* 3. Visual Evidence - 결과로 증명하는 기술력 (비포/애프터) */}
      {/* 사용자의 시각적 확신을 위해 전진 배치되었습니다. */}
      <ImpactGallery />
      
      {/* 4. Professionalism - 과학적이고 체계적인 작업 프로세스 */}
      {/* '왜 결과가 좋은지'에 대한 근거를 제시합니다. */}
      <ProcessFlow />

      {/* 5. Strategic Solutions - 타겟 고객별 맞춤 제안 (아파트/공공기관) */}
      {/* 신뢰와 확신이 생긴 시점에서 구체적인 진입로를 제시합니다. */}
      <TargetCTA />
      
      {/* 6. Brand Identity - 회사의 미션과 철학 */}
      <MissionSection />
      
      {/* 7. Social Evidence - 실시간 작업 현황 및 소식 */}
      <LatestUpdates />
    </div>
  )
}
