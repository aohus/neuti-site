'use client'

import React from 'react'
import { motion, Variants } from 'framer-motion'
import { Search, PencilRuler, HardHat, ShieldCheck, ChevronRight } from 'lucide-react'
import Container from '../common/Container'

const steps = [
  {
    icon: Search,
    title: '현장 정밀 분석',
    description: '공간의 특성과 토양, 수목 생육 상태를 면밀히 분석하여 현장 맞춤형 기초 데이터를 구축합니다.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    icon: PencilRuler,
    title: '맞춤형 설계 제안',
    description: '분석된 데이터를 바탕으로 최신 트렌드와 현장의 요구사항을 반영한 최적의 시공 및 관리 계획을 수립합니다.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
  {
    icon: HardHat,
    title: '전문 책임 시공',
    description: '1종 나무병원의 전문 인력이 직접 시공하여 설계에 충실한 고품격 책임 시공을 정밀하게 수행합니다.',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    icon: ShieldCheck,
    title: '체계적 사후 관리',
    description: '작업 후 정기 모니터링과 성과 보고를 통해 시공 품질을 완벽하게 유지하고 하자 없는 공간을 보장합니다.',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
  }
]

// Variants for sequential animation
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, // Time between each step appearance
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    },
  },
}

const arrowVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      repeat: Infinity,
      repeatType: "reverse",
      repeatDelay: 1
    },
  },
}

export default function ProcessFlow() {
  return (
    <section className="py-40 bg-white overflow-hidden">
      <Container>
        <div className="text-center mb-24">
          <h2 className="text-sm font-bold text-green-600 tracking-widest uppercase mb-4">Our Methodology</h2>
          <p className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
            체계적인 프로세스로 완성하는<br/>최상의 녹지 공간
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-4"
        >
          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              {/* Step Card */}
              <motion.div
                variants={itemVariants}
                className="flex-1 flex flex-col items-center text-center group"
              >
                <div className={`${step.bgColor} ${step.color} w-24 h-24 rounded-[2rem] flex items-center justify-center mb-8 shadow-sm group-hover:shadow-xl group-hover:scale-110 transition-all duration-500`}>
                  <step.icon size={40} />
                </div>
                <div className="px-4">
                  <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-green-600 transition-colors">{step.title}</h3>
                  <p className="text-gray-500 leading-relaxed font-medium text-sm md:text-base">
                    {step.description}
                  </p>
                </div>
              </motion.div>

              {/* Sequential Arrow (Visible on Desktop between items) */}
              {idx < steps.length - 1 && (
                <motion.div 
                  variants={itemVariants}
                  className="hidden lg:flex items-center justify-center pt-10"
                >
                  <motion.div variants={arrowVariants}>
                    <ChevronRight className="text-gray-200" size={32} strokeWidth={3} />
                  </motion.div>
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}