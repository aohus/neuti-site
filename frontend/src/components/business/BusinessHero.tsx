'use client'

import React from 'react'
import Container from '@/components/common/Container'
import { motion } from 'framer-motion'

export default function BusinessHero() {
  return (
    <section className="relative py-32 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-green-50/30 -skew-y-3 origin-top-left transform translate-y-[-50%]" />
      <Container>
        <div className="relative text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-black text-green-600 tracking-[0.5em] uppercase mb-6"
          >
            Our Services
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none mb-8"
          >
            주요 사업 영역
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl text-xl text-gray-400 mx-auto font-bold leading-relaxed"
          >
            느티나무병원은 나무를 치료하고 도시의 회복탄력성을 키우는 <br className="hidden md:block" /> 
            전문적인 수목 진료 및 조경 서비스를 제공합니다.
          </motion.p>
        </div>
      </Container>
    </section>
  )
}
