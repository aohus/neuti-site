'use client'

import React from 'react'
import MainCarousel from '@/components/common/MainCarousel'
import { MissionSection, LandscapingSection, TreeHospitalSection } from '@/components/common/HomeSections'
import LatestUpdates from '@/components/common/LatestUpdates'
import FinalCTA from '@/components/common/FinalCTA'

export default function Home() {
  return (
    <div className="home-page">
      <MainCarousel />
      <MissionSection />
      <LandscapingSection />
      <TreeHospitalSection />
      <LatestUpdates />
      <FinalCTA />
    </div>
  )
}
