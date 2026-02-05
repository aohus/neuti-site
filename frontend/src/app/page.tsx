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
      {/* 1. Hero Section */}
      <MainCarousel />
      
      {/* 2. Trust Building - Clients & Stats */}
      <ClientBanner />
      <StatisticsDashboard />
      
      {/* 3. Strategic Solutions - Target Entry Points */}
      <TargetCTA />
      
      {/* 4. Professionalism - Scientific Process */}
      <ProcessFlow />

      {/* 5. Evidence - Impact Gallery (B&A) */}
      <ImpactGallery />
      
      {/* 6. Brand Identity - Mission & Philosophy */}
      <MissionSection />
      
      {/* 7. Current Evidence - Latest Performance & Posts */}
      <LatestUpdates />
    </div>
  )
}
