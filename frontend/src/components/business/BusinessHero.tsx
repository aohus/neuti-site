'use client'

import React from 'react'
import Container from '@/components/common/Container'
import { motion } from 'framer-motion'

export default function BusinessHero() {
  return (
    <section className="bg-surface relative overflow-hidden pt-40 pb-24">
      <Container>
        <div className="relative mx-auto max-w-4xl text-center">
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
            className="text-deep mb-10 text-4xl leading-[1.2] font-black tracking-tighter md:text-6xl"
          >
            주요 사업 영역
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg leading-relaxed font-bold text-gray-500 md:text-xl"
          >
            느티나무병원 협동조합은 나무를 치료하고 도시의 회복탄력성을 키우는{' '}
            <br className="hidden md:block" />
            전문적인 수목 진료 및 조경 서비스를 제공합니다.
          </motion.p>
        </div>
      </Container>
    </section>
  )
}
