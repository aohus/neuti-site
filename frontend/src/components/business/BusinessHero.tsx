'use client'

import React from 'react'
import Container from '@/components/common/Container'
import { motion } from 'framer-motion'

export default function BusinessHero() {
  return (
    <section className="relative pt-40 pb-24 overflow-hidden bg-surface">
      <Container>
        <div className="relative text-center max-w-4xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-label"
          >
            Our Services
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-deep tracking-tighter leading-[1.2] mb-10"
          >
            주요 사업 영역
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-500 font-bold leading-relaxed"
          >
            느티나무병원은 나무를 치료하고 도시의 회복탄력성을 키우는 <br className="hidden md:block" /> 
            전문적인 수목 진료 및 조경 서비스를 제공합니다.
          </motion.p>
        </div>
      </Container>
    </section>
  )
}
