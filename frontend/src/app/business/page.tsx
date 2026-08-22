'use client'

import React from 'react'
import BusinessHero from '@/components/business/BusinessHero'
import TreeHospitalSection from '@/components/business/TreeHospitalSection'
import LandscapingSection from '@/components/business/LandscapingSection'
import FinalCTA from '@/components/common/FinalCTA'
import { motion } from 'framer-motion'

export default function BusinessPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white pb-12 space-y-12 md:pb-20 md:space-y-20"
    >
      <BusinessHero />
      
      <TreeHospitalSection />
      
      <LandscapingSection />
      
      <div className="pt-10 md:pt-20">
        <FinalCTA />
      </div>
    </motion.div>
  )
}