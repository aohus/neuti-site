'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Search, PencilRuler, HardHat, ShieldCheck } from 'lucide-react'
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
    description: '1종 나무병원의 전문 인력과 장비를 투입하여 설계에 충실한 고품격 책임 시공을 정밀하게 수행합니다.',
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

export default function ProcessFlow() {
  return (
    <section className="py-40 bg-white">
      <Container>
        <div className="text-center mb-20">
          <h2 className="text-sm font-bold text-green-600 tracking-widest uppercase mb-4">Our Methodology</h2>
          <p className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
            체계적인 프로세스로 완성하는<br/>최상의 녹지 공간
          </p>
        </div>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center group"
              >
                <div className={`${step.bgColor} ${step.color} w-24 h-24 rounded-3xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                  <step.icon size={40} />
                </div>
                <div className="relative">
                  <div className="bg-white px-4">
                    <h3 className="text-2xl font-black text-gray-900 mb-4">{step.title}</h3>
                    <p className="text-gray-500 leading-relaxed font-medium">
                      {step.description}
                    </p>
                  </div>
                  {/* Step Number Badge */}
                  <span className="absolute -top-12 left-1/2 -translate-x-1/2 text-gray-100 text-6xl font-black -z-10 select-none">
                    0{idx + 1}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}