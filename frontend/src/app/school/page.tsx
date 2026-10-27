import React from 'react'
import SchoolHero from '@/components/school/SchoolHero'
import TreeDoctorSection from '@/components/school/TreeDoctorSection'
import SchoolFirstSection from '@/components/school/SchoolFirstSection'
import AnnualPlanSection from '@/components/school/AnnualPlanSection'
import PlansSection from '@/components/school/PlansSection'
import PaperworkSection from '@/components/school/PaperworkSection'
import SchoolsSection from '@/components/school/SchoolsSection'
import SchoolCTA from '@/components/school/SchoolCTA'

/**
 * 학교 수목관리·병해충 방제 (/school).
 * 검색어별 서비스 페이지 — 학교 실적은 숫자가 아니라 작업 방식과 나무의사 역할로 보여 준다.
 */
export default function SchoolPage() {
  return (
    <div className="overflow-x-clip bg-white">
      <SchoolHero />
      <TreeDoctorSection />
      <SchoolFirstSection />
      <AnnualPlanSection />
      <PlansSection />
      <PaperworkSection />
      <SchoolsSection />
      <SchoolCTA />
    </div>
  )
}
